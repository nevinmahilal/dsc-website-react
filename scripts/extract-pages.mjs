import fs from 'fs'
import path from 'path'
import { connect } from './db.mjs'
import { fetchAllMeta, getSeoFromMeta, walkElementor, getElementorData, decodeHtmlEntities } from './utils.mjs'

const CONTENT_DIR = path.resolve('content/pages')

// Pages to extract: [wp_post_name, output_filename_without_extension, type]
const PAGE_MAP = [
  { slug: 'home',                  file: 'home',                  type: 'home' },
  { slug: 'about',                 file: 'about',                 type: 'sections' },
  { slug: 'work',                  file: 'work',                  type: 'sections' },
  { slug: 'contact',               file: 'contact',               type: 'contact' },
  { slug: 'dsc-optimizer',         file: 'dsc-optimizer',         type: 'sections' },
  { slug: 'try-dsc-optimizer',     file: 'try-dsc-optimizer',     type: 'sections' },
  { slug: 'terms-and-conditions',  file: 'terms-and-conditions',  type: 'static' },
  { slug: 'privacy-policy',        file: 'privacy-policy',        type: 'static' },
  { slug: 'accessibility',         file: 'accessibility',         type: 'static' },
  { slug: 'sitemap',               file: 'sitemap-page',          type: 'static' },
]

function findHeroContainer(elements) {
  for (const el of elements) {
    const title = el.settings?._title || ''
    if (title.toUpperCase().includes('BANNER') || title.toUpperCase().includes('HERO')) {
      return el
    }
  }
  // Fallback: first top-level container with a background image
  for (const el of elements) {
    if (el.settings?.background_image?.url) return el
  }
  return elements[0] || null
}

function extractHeroFromContainer(container) {
  const settings = container?.settings || {}
  const bgUrl = settings.background_image?.url || ''
  const bgFile = bgUrl ? path.basename(bgUrl) : 'banner-dsc.png'
  const backgroundImage = `/images/hero/${bgFile}`

  let headline = '', subheading = '', ctaLabel = '', ctaHref = ''
  const widgets = []

  function collectWidgets(els) {
    for (const el of (els ?? [])) {
      if (el.elType === 'widget') widgets.push(el)
      if (el.elements?.length) collectWidgets(el.elements)
    }
  }
  collectWidgets(container?.elements ?? [])

  const headings = widgets.filter(w => w.widgetType === 'heading')
  const buttons = widgets.filter(w => w.widgetType === 'button')

  if (headings[0]) headline = decodeHtmlEntities(headings[0].settings?.title || '')
  if (headings[1]) subheading = decodeHtmlEntities(headings[1].settings?.title || '')
  if (buttons[0]) {
    ctaLabel = buttons[0].settings?.text || 'Learn More'
    ctaHref = buttons[0].settings?.link?.url || '/'
  }

  return { headline, subheading, ctaLabel, ctaHref, backgroundImage }
}

function extractContactDetails(sections, postContent) {
  // Prefer the second heading (e.g. "Meet with our team of experts") over page title
  const headings = sections.filter(s => s.type === 'heading')
  const richText = sections.find(s => s.type === 'richText')?.html || ''
  const intro = headings[1]?.text || headings[0]?.text || richText || ''

  // Extract email from post_content (most reliable source)
  const emailSrc = postContent || richText
  const email = emailSrc.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || ''
  const phone = postContent?.match(/\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/)?.[0]?.trim() || ''

  return { intro, email, phone }
}

async function extractPage(conn, pageConfig, dbRow) {
  const { file, type } = pageConfig
  const { ID, post_title, post_content } = dbRow
  const meta = await fetchAllMeta(conn, ID)
  const seo = getSeoFromMeta(meta, post_title, post_title)
  const elementorData = await getElementorData(conn, ID)
  const sections = walkElementor(elementorData)

  if (type === 'static') {
    // Use post_content for static pages (terms, privacy, accessibility, sitemap)
    const body = post_content || sections.map(s => s.html || s.text || '').join('\n')
    return {
      slug: file,
      title: post_title,
      body,
      seo,
    }
  }

  if (type === 'home') {
    const heroContainer = findHeroContainer(elementorData)
    const hero = extractHeroFromContainer(heroContainer)
    // Sections = everything after the hero container
    const restElements = elementorData.filter(el => el !== heroContainer)
    const restSections = walkElementor(restElements)
    return {
      slug: 'home',
      title: post_title,
      hero,
      sections: restSections,
      seo,
    }
  }

  if (type === 'contact') {
    const { intro, email, phone } = extractContactDetails(sections, post_content)
    return {
      slug: 'contact',
      title: post_title,
      intro: intro || post_title,
      contactDetails: {
        ...(email ? { email } : {}),
        ...(phone ? { phone } : {}),
      },
      seo,
    }
  }

  // Default: sections page (about, work, dsc-optimizer, try-dsc-optimizer)
  return {
    slug: file,
    title: post_title,
    sections,
    seo,
  }
}

async function main() {
  const conn = await connect()

  // Load all target pages at once
  const [dbPages] = await conn.execute(`
    SELECT ID, post_name, post_title, post_content
    FROM wpkf_posts
    WHERE post_type = 'page' AND post_status = 'publish'
      AND post_name IN (${PAGE_MAP.map(() => '?').join(',')})
  `, PAGE_MAP.map(p => p.slug))

  const pagesBySlug = {}
  for (const row of dbPages) pagesBySlug[row.post_name] = row

  let written = 0
  for (const pageConfig of PAGE_MAP) {
    const dbRow = pagesBySlug[pageConfig.slug]
    if (!dbRow) {
      console.warn(`⚠️  Page not found in DB: ${pageConfig.slug}`)
      continue
    }
    const data = await extractPage(conn, pageConfig, dbRow)
    const outPath = path.join(CONTENT_DIR, `${pageConfig.file}.json`)
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2))
    console.log(`✅  ${pageConfig.file}.json — ID:${dbRow.ID}`)
    written++
  }

  await conn.end()

  // Remove .gitkeep after writing
  const gitkeep = path.join(CONTENT_DIR, '.gitkeep')
  if (fs.existsSync(gitkeep)) fs.unlinkSync(gitkeep)

  console.log(`\nExtracted ${written}/${PAGE_MAP.length} pages to ${CONTENT_DIR}`)
}

main().catch(err => { console.error(err); process.exit(1) })
