import { spawnSync, execSync } from 'child_process'
import mysql from 'mysql2/promise'

const DB_HOST = process.env.DB_HOST || '127.0.0.1'
const DB_PORT = parseInt(process.env.DB_PORT || '10005', 10)
const DB_USER = process.env.DB_USER || 'root'
const DB_PASS = process.env.DB_PASS || 'root'
const DB_NAME = process.env.DB_NAME || 'local'
// LocalWP's bundled MySQL 8.4 client — accessible as a Windows exe from WSL2
const MYSQL_BIN = process.env.MYSQL_BIN || '/mnt/c/Users/nevin/AppData/Roaming/Local/lightning-services/mysql-8.4.0/bin/win64/bin/mysql.exe'
const DB_ARGS = ['-h', DB_HOST, '-P', String(DB_PORT), '-u', DB_USER, `-p${DB_PASS}`, DB_NAME, '--batch']

function escapeValue(val) {
  if (val === null || val === undefined) return 'NULL'
  if (typeof val === 'number') return String(val)
  return `'${String(val)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\0/g, '\\0')}'`
}

function interpolate(sql, params) {
  if (!params || params.length === 0) return sql
  const placeholders = (sql.match(/\?/g) || []).length
  if (placeholders !== params.length) {
    throw new Error(`interpolate: ${placeholders} placeholders but ${params.length} params`)
  }
  let i = 0
  return sql.replace(/\?/g, () => escapeValue(params[i++]))
}

function unescapeBatch(val) {
  // Process MySQL --batch escape sequences character-by-character to avoid
  // regex ordering issues (e.g. \\n must become \n, not backslash+newline)
  let result = ''
  let i = 0
  while (i < val.length) {
    if (val[i] === '\\' && i + 1 < val.length) {
      const next = val[i + 1]
      if (next === '\\') { result += '\\'; i += 2 }
      else if (next === 't') { result += '\t'; i += 2 }
      else if (next === 'n') { result += '\n'; i += 2 }
      else if (next === 'r') { result += '\r'; i += 2 }
      else { result += val[i]; i++ }
    } else {
      result += val[i++]
    }
  }
  return result
}

function parseTabDelimited(output) {
  const lines = output.replace(/\r/g, '').split('\n').filter(l => l.length > 0)
  if (lines.length === 0) return []
  const headers = lines[0].split('\t')
  return lines.slice(1).map(line => {
    const values = line.split('\t')
    const row = {}
    headers.forEach((h, i) => {
      const v = values[i]
      row[h] = (v === undefined || v === 'NULL') ? null : unescapeBatch(v)
    })
    return row
  })
}

function runQuery(sql) {
  const result = spawnSync(MYSQL_BIN, DB_ARGS, {
    input: sql,
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
  })
  if (result.error) {
    const msg = result.error.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER'
      ? `MySQL output exceeded maxBuffer (50 MB) — consider chunking the query`
      : result.error.message
    throw new Error(`MySQL subprocess error: ${msg}`)
  }
  if (result.status !== 0) {
    throw new Error(`MySQL query failed (status ${result.status}): ${result.stderr}`)
  }
  return parseTabDelimited(result.stdout)
}

function createSubprocessConnection() {
  return {
    execute(sql, params) {
      const query = interpolate(sql, params)
      const rows = runQuery(query)
      return [rows, []]
    },
    end() {},
  }
}

function getWindowsHostIp() {
  try {
    const out = execSync("ip route show default | awk '{print $3}' | head -1", { encoding: 'utf8' })
    return out.trim() || null
  } catch { return null }
}

export async function connect() {
  // Try native mysql2 TCP first (works if WSL2 localhost forwarding is configured)
  for (const host of ['127.0.0.1', getWindowsHostIp()].filter(Boolean)) {
    try {
      const conn = await mysql.createConnection({
        host, port: DB_PORT, user: DB_USER, password: DB_PASS, database: DB_NAME,
        connectTimeout: 2000,
      })
      console.log(`[db] Connected via TCP at ${host}:10005`)
      return conn
    } catch (err) {
      console.warn(`[db] TCP ${host}:10005 failed — ${err.message}`)
    }
  }

  // Fallback: mysql.exe subprocess — Windows binary bypasses WSL2 network isolation
  console.log('[db] Using mysql.exe subprocess fallback')
  return createSubprocessConnection()
}
