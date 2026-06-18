import fs from 'fs'
import path from 'path'
import { connect } from './db.mjs'
import { fetchAllMeta, getSeoFromMeta, getElementorData, walkElementor } from './utils.mjs'

const CONTENT_DIR = path.resolve('content/work-page-dashboards')

async function main() {
  const conn = await connect()

  const [items] = await conn.execute(`
    SELECT ID, post_title, post_name as slug, post_excerpt, post_content
    FROM wpkf_posts
    WHERE post_type = 'work-page-dashboard' AND post_status = 'publish'
    ORDER BY post_name
  `)

  console.log(`Found ${items.length} work-page-dashboards`)
  let written = 0

  for (const item of items) {
    const { ID, post_title, slug, post_excerpt, post_content } = item
    const meta = await fetchAllMeta(conn, ID)
    const seo = getSeoFromMeta(meta, post_title, post_excerpt || post_title)

    // Try Elementor data first, fall back to post_content
    const elementorData = await getElementorData(conn, ID)
    const sections = walkElementor(elementorData)
    const body = post_content ||
      sections.map(s => s.html || s.text || '').filter(Boolean).join('\n') ||
      ''

    const record = {
      slug,
      title: post_title,
      excerpt: post_excerpt || '',
      body,
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

  if (written !== 4) console.warn(`⚠️  Expected 4 records, got ${written}`)
  console.log(`\nExtracted ${written} work-page-dashboards to ${CONTENT_DIR}`)
}

main().catch(err => { console.error(err); process.exit(1) })
