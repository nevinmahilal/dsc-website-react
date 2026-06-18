import { unserialize } from 'php-serialize'
import path from 'path'

export async function fetchAllMeta(conn, postId) {
  const [rows] = await conn.execute(
    `SELECT meta_key, meta_value FROM wpkf_postmeta WHERE post_id = ?`,
    [postId]
  )
  const meta = {}
  for (const { meta_key, meta_value } of rows) {
    meta[meta_key] = meta_value
  }
  return meta
}

export async function fetchTaxonomyTerms(conn, postId, taxonomy) {
  const [rows] = await conn.execute(`
    SELECT t.name
    FROM wpkf_terms t
    JOIN wpkf_term_taxonomy tt ON t.term_id = tt.term_id
    JOIN wpkf_term_relationships tr ON tt.term_taxonomy_id = tr.term_taxonomy_id
    WHERE tr.object_id = ? AND tt.taxonomy = ?
    ORDER BY t.name
  `, [String(postId), taxonomy])
  return rows.map(r => decodeHtmlEntities(r.name))
}

export function getSeoFromMeta(meta, fallbackTitle = '', fallbackDesc = '') {
  const title = meta['rank_math_title'] || meta['_yoast_wpseo_title'] || fallbackTitle
  const description = meta['rank_math_description'] || meta['_yoast_wpseo_metadesc'] || fallbackDesc
  // Only include ogImage if it's a local path — absolute WordPress URLs are not useful for Next.js
  const rawOg = meta['rank_math_facebook_image'] || meta['_yoast_wpseo_opengraph-image'] || ''
  const ogImage = rawOg && !rawOg.startsWith('http') ? rawOg : undefined
  return {
    title: title || fallbackTitle,
    description: description || fallbackDesc,
    ...(ogImage ? { ogImage } : {}),
  }
}

export async function getFeaturedImageFilename(conn, postId) {
  const [rows] = await conn.execute(`
    SELECT pm2.meta_value as attached_file
    FROM wpkf_postmeta pm1
    JOIN wpkf_posts att ON pm1.meta_value = att.ID
    JOIN wpkf_postmeta pm2 ON att.ID = pm2.post_id AND pm2.meta_key = '_wp_attached_file'
    WHERE pm1.post_id = ? AND pm1.meta_key = '_thumbnail_id'
  `, [String(postId)])
  if (!rows.length || !rows[0].attached_file) return null
  return path.basename(rows[0].attached_file)
}

export function tryUnserialize(value) {
  if (!value || typeof value !== 'string') return value
  if (value.startsWith('a:') || value.startsWith('s:') || value.startsWith('i:') || value.startsWith('b:')) {
    try { return unserialize(value) } catch { return value }
  }
  return value
}

export function walkElementor(elements) {
  const sections = []
  function walk(els) {
    for (const el of (els ?? [])) {
      if (el.elType === 'widget') {
        const s = el.settings || {}
        switch (el.widgetType) {
          case 'heading':
            if (s.title) sections.push({ type: 'heading', text: s.title, tag: s.header_size || 'h2' })
            break
          case 'text-editor':
            if (s.editor) sections.push({ type: 'richText', html: s.editor })
            break
          case 'image':
            if (s.image?.url) sections.push({ type: 'image', src: s.image.url, alt: s.image.alt || '' })
            break
          case 'button':
            if (s.text) sections.push({ type: 'cta', label: s.text, href: s.link?.url || '' })
            break
          case 'video':
            sections.push({ type: 'video', url: s.youtube_url || s.vimeo_url || '' })
            break
          case 'image-carousel':
            sections.push({
              type: 'imageCarousel',
              // Elementor uses 'carousel' array (not 'gallery') for image-carousel widget
              images: (s.carousel || s.gallery || []).map(img => ({ url: img.url || '', alt: img.alt || '' })),
            })
            break
        }
      }
      if (el.elements?.length) walk(el.elements)
    }
  }
  walk(elements)
  return sections
}

export async function getElementorData(conn, postId) {
  const [rows] = await conn.execute(
    `SELECT meta_value FROM wpkf_postmeta WHERE post_id = ? AND meta_key = '_elementor_data'`,
    [String(postId)]
  )
  if (!rows.length || !rows[0].meta_value) return []
  try {
    return JSON.parse(rows[0].meta_value)
  } catch {
    return []
  }
}

// Decode HTML entities like &amp; &#47; etc.
export function decodeHtmlEntities(str) {
  if (!str) return str
  return str
    .replace(/&amp;/g, '&')
    .replace(/&#47;/g, '/')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
}
