import fs from 'fs'
import path from 'path'
import { connect } from './db.mjs'
import { fetchAllMeta, getSeoFromMeta } from './utils.mjs'

const CONTENT_DIR = path.resolve('content/careers')

function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

// Parse requirements from HTML post_content — look for list items under "Key Responsibilities"
function parseRequirements(html) {
  if (!html) return []
  // Look for <strong>...</strong>: content lines as requirements
  const items = []
  const liMatches = html.match(/<li[^>]*>(.*?)<\/li>/gi) || []
  for (const li of liMatches) {
    const text = stripHtml(li)
    if (text.length > 0 && text.length < 500) items.push(text)
  }
  if (items.length > 0) return items

  // Fallback: split on <p> tags that have <strong> content
  const pMatches = html.match(/<p[^>]*><strong>(.*?)<\/strong>/gi) || []
  return pMatches.map(p => stripHtml(p)).filter(t => t.length > 0 && t.length < 200)
}

async function main() {
  const conn = await connect()

  const [careers] = await conn.execute(`
    SELECT ID, post_title, post_name as slug, post_excerpt, post_content
    FROM wpkf_posts
    WHERE post_type = 'career' AND post_status = 'publish'
    ORDER BY post_name
  `)

  console.log(`Found ${careers.length} career(s)`)
  let written = 0

  for (const career of careers) {
    const { ID, post_title, slug, post_excerpt, post_content } = career
    const meta = await fetchAllMeta(conn, ID)
    const seo = getSeoFromMeta(meta, post_title, post_excerpt || stripHtml(post_content).substring(0, 160))

    const requirements = parseRequirements(post_content)

    const record = {
      slug,
      title: post_title,
      excerpt: post_excerpt || stripHtml(post_content).substring(0, 300),
      description: post_content || '',
      requirements,
      seo,
      // Additional ACF fields for context
      ...(meta.career_type ? { careerType: meta.career_type } : {}),
      ...(meta.career_location ? { location: meta.career_location } : {}),
      ...(meta.salary_range ? { salaryRange: meta.salary_range } : {}),
      ...(meta.start_date ? { startDate: meta.start_date } : {}),
    }

    const outPath = path.join(CONTENT_DIR, `${slug}.json`)
    fs.writeFileSync(outPath, JSON.stringify(record, null, 2))
    console.log(`✅  ${slug}.json`)
    written++
  }

  await conn.end()

  const gitkeep = path.join(CONTENT_DIR, '.gitkeep')
  if (fs.existsSync(gitkeep)) fs.unlinkSync(gitkeep)

  console.log(`\nExtracted ${written} careers to ${CONTENT_DIR}`)
}

main().catch(err => { console.error(err); process.exit(1) })
