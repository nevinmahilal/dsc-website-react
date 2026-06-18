import fs from 'fs'
import path from 'path'
import { connect } from './db.mjs'
import { fetchAllMeta, getSeoFromMeta, getFeaturedImageFilename } from './utils.mjs'

const CONTENT_DIR = path.resolve('content/blog-posts')

function formatMdxFrontmatter(fields) {
  const lines = ['---']
  for (const [key, val] of Object.entries(fields)) {
    const escaped = String(val)
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
    lines.push(`${key}: "${escaped}"`)
  }
  lines.push('---')
  return lines.join('\n')
}

async function main() {
  const conn = await connect()

  // Get unique blog posts with their primary category (GROUP_CONCAT for multi-cat)
  const [posts] = await conn.execute(`
    SELECT
      p.ID, p.post_title, p.post_name as slug,
      p.post_excerpt, p.post_content as body,
      p.post_date,
      GROUP_CONCAT(DISTINCT t.name ORDER BY t.name SEPARATOR ', ') as categories
    FROM wpkf_posts p
    LEFT JOIN wpkf_term_relationships tr ON p.ID = tr.object_id
    LEFT JOIN wpkf_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = 'category'
    LEFT JOIN wpkf_terms t ON tt.term_id = t.term_id AND t.slug != 'uncategorized'
    WHERE p.post_type = 'post' AND p.post_status = 'publish'
    GROUP BY p.ID
    ORDER BY p.post_date DESC
  `)

  console.log(`Found ${posts.length} blog posts`)
  let written = 0
  const imageFilenames = []

  for (const post of posts) {
    const { ID, post_title, slug, post_excerpt, body, post_date, categories } = post
    const meta = await fetchAllMeta(conn, ID)

    // Featured image: resolve to local path
    const imgFilename = await getFeaturedImageFilename(conn, ID)
    const featuredImage = imgFilename ? `/images/blog-posts/${imgFilename}` : ''
    if (imgFilename) imageFilenames.push(imgFilename)

    // Category: use first category from the comma-separated list
    const category = categories?.split(', ')[0] || 'General'

    // SEO: Yoast
    const seoTitle = meta['_yoast_wpseo_title'] || post_title
    const seoDescription = meta['_yoast_wpseo_metadesc'] || post_excerpt || ''

    // Date: ISO 8601
    const date = new Date(post_date).toISOString()

    const frontmatter = formatMdxFrontmatter({
      title: post_title,
      excerpt: post_excerpt || '',
      date,
      category,
      featuredImage,
      seoTitle,
      seoDescription,
    })

    const mdxContent = `${frontmatter}\n\n${body || ''}`
    const outPath = path.join(CONTENT_DIR, `${slug}.mdx`)
    fs.writeFileSync(outPath, mdxContent)
    console.log(`✅  ${slug}.mdx (cat: ${category})`)
    written++
  }

  await conn.end()

  const gitkeep = path.join(CONTENT_DIR, '.gitkeep')
  if (fs.existsSync(gitkeep)) fs.unlinkSync(gitkeep)

  console.log(`\nExtracted ${written} blog posts to ${CONTENT_DIR}`)
  console.log(`Images to migrate (${imageFilenames.length}): ${imageFilenames.join(', ')}`)
}

main().catch(err => { console.error(err); process.exit(1) })
