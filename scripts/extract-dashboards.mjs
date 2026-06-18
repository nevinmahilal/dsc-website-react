import fs from 'fs'
import path from 'path'
import { connect } from './db.mjs'
import { fetchAllMeta, fetchTaxonomyTerms, getSeoFromMeta } from './utils.mjs'

const CONTENT_DIR = path.resolve('content/dashboards')

// Derive persona from dashboard title (e.g. "CEO/Executive Overview..." → "CEO")
function derivePersona(title) {
  const roles = ['CEO', 'COO', 'CRO', 'CFO', 'CMO', 'CTO', 'VP', 'Director', 'Marketing', 'Financial', 'Executive']
  for (const role of roles) {
    if (title.includes(role)) return role
  }
  return title.split(/[^a-zA-Z0-9 &]/)[0].trim()
}

async function main() {
  const conn = await connect()

  const [dashboards] = await conn.execute(`
    SELECT ID, post_title, post_name as slug, post_excerpt, post_content
    FROM wpkf_posts
    WHERE post_type = 'dashboard' AND post_status = 'publish'
    ORDER BY post_name
  `)

  console.log(`Found ${dashboards.length} dashboards`)
  let written = 0

  for (const dashboard of dashboards) {
    const { ID, post_title, slug, post_excerpt } = dashboard
    const meta = await fetchAllMeta(conn, ID)
    const tools = await fetchTaxonomyTerms(conn, ID, 'tool')
    const useCases = await fetchTaxonomyTerms(conn, ID, 'use-case')

    // tool ACF field as fallback if taxonomy is empty
    const resolvedTools = tools.length > 0 ? tools : (meta.tool ? [meta.tool] : [])
    const persona = derivePersona(post_title)
    const body = meta.iframe_embed_for_dashboard || ''
    const seo = getSeoFromMeta(meta, post_title, post_excerpt || '')

    const record = {
      slug,
      title: post_title,
      excerpt: post_excerpt || post_title,
      body,
      persona,
      tools: resolvedTools,
      useCases,
      seo,
    }

    const outPath = path.join(CONTENT_DIR, `${slug}.json`)
    fs.writeFileSync(outPath, JSON.stringify(record, null, 2))
    console.log(`✅  ${slug}.json`)
    written++
  }

  await conn.end()

  const gitkeep = path.join(CONTENT_DIR, '.gitkeep')
  if (fs.existsSync(gitkeep)) fs.unlinkSync(gitkeep)

  console.log(`\nExtracted ${written} dashboards to ${CONTENT_DIR}`)
}

main().catch(err => { console.error(err); process.exit(1) })
