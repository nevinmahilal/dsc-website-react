import fs from 'fs'
import path from 'path'
import { connect } from './db.mjs'
import { fetchAllMeta, fetchTaxonomyTerms, getSeoFromMeta } from './utils.mjs'

const CONTENT_DIR = path.resolve('content/case-studies')

function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

async function main() {
  const conn = await connect()

  const [studies] = await conn.execute(`
    SELECT ID, post_title, post_name as slug, post_excerpt, post_content
    FROM wpkf_posts
    WHERE post_type = 'case-study' AND post_status = 'publish'
    ORDER BY post_name
  `)

  console.log(`Found ${studies.length} case studies`)
  let written = 0

  for (const study of studies) {
    const { ID, post_title, slug, post_excerpt, post_content } = study
    const meta = await fetchAllMeta(conn, ID)
    const serviceTags = await fetchTaxonomyTerms(conn, ID, 'service-tag')
    const techStack = await fetchTaxonomyTerms(conn, ID, 'tech-stack')
    const industryTerms = await fetchTaxonomyTerms(conn, ID, 'industry')
    const industry = industryTerms[0] || ''

    const seo = getSeoFromMeta(meta, post_title, stripHtml(post_excerpt) || stripHtml(meta.challenge || ''))

    const record = {
      slug,
      title: post_title,
      excerpt: post_excerpt || stripHtml(meta.challenge || '') || '',
      body: post_content || '',
      serviceTags,
      industry,
      techStack,
      seo,
      // Additional ACF fields
      ...(meta.challenge ? { challenge: meta.challenge } : {}),
      ...(meta.what_we_did ? { whatWeDid: meta.what_we_did } : {}),
      ...(meta.outcome ? { outcome: meta.outcome } : {}),
    }

    const outPath = path.join(CONTENT_DIR, `${slug}.json`)
    fs.writeFileSync(outPath, JSON.stringify(record, null, 2))
    console.log(`✅  ${slug}.json`)
    written++
  }

  await conn.end()

  const gitkeep = path.join(CONTENT_DIR, '.gitkeep')
  if (fs.existsSync(gitkeep)) fs.unlinkSync(gitkeep)

  console.log(`\nExtracted ${written} case studies to ${CONTENT_DIR}`)
}

main().catch(err => { console.error(err); process.exit(1) })
