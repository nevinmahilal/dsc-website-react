import fs from 'fs'
import path from 'path'

const CONTENT_DIR = path.resolve('content')
let errors = 0
let warnings = 0
let passed = 0

function err(file, msg) {
  console.error(`  ❌ [${file}] ${msg}`)
  errors++
}

function warn(file, msg) {
  console.warn(`  ⚠️  [${file}] ${msg}`)
  warnings++
}

function ok(file, msg) {
  console.log(`  ✅ [${file}] ${msg}`)
  passed++
}

function checkString(obj, key, file, required = true) {
  if (required && !obj[key]) err(file, `Missing required field: ${key}`)
  else if (required && typeof obj[key] !== 'string') err(file, `Field ${key} must be a string`)
  return !!obj[key]
}

function checkArray(obj, key, file, required = true) {
  if (required && !Array.isArray(obj[key])) {
    err(file, `Missing or non-array required field: ${key}`)
    return false
  }
  return true
}

function checkSeo(seo, file) {
  if (!seo || typeof seo !== 'object') { err(file, 'Missing seo object'); return }
  if (!seo.title) err(file, 'seo.title is missing')
  if (!seo.description) err(file, 'seo.description is missing')
  if (seo.ogImage && seo.ogImage.startsWith('http')) {
    warn(file, `seo.ogImage is an absolute URL (${seo.ogImage.substring(0, 50)}) — prefer local /images/ path`)
  }
}

function checkFeaturedImage(val, file) {
  if (!val) { warn(file, 'featuredImage is empty'); return }
  if (val.startsWith('http')) {
    err(file, `featuredImage must be a local /images/ path, not: ${val.substring(0, 60)}`)
  }
}

// ─── Case Studies ───────────────────────────────────────────────────────────
console.log('\n=== Case Studies ===')
const csDir = path.join(CONTENT_DIR, 'case-studies')
const csFiles = fs.readdirSync(csDir).filter(f => f.endsWith('.json'))
console.log(`Found ${csFiles.length} case study files`)
for (const file of csFiles) {
  const obj = JSON.parse(fs.readFileSync(path.join(csDir, file), 'utf8'))
  let ok_local = true
  if (!checkString(obj, 'slug', file)) ok_local = false
  if (!checkString(obj, 'title', file)) ok_local = false
  if (!checkString(obj, 'excerpt', file, false)) { /* optional */ }
  if (!checkString(obj, 'body', file, false)) { /* optional — may be empty */ }
  if (!checkArray(obj, 'serviceTags', file)) ok_local = false
  if (!checkString(obj, 'industry', file, false)) { /* optional */ }
  if (!checkArray(obj, 'techStack', file)) ok_local = false
  checkSeo(obj.seo, file)
  if (ok_local) ok(file, 'valid')
}

// ─── Dashboards ─────────────────────────────────────────────────────────────
console.log('\n=== Dashboards ===')
const dashDir = path.join(CONTENT_DIR, 'dashboards')
const dashFiles = fs.readdirSync(dashDir).filter(f => f.endsWith('.json'))
console.log(`Found ${dashFiles.length} dashboard files`)
for (const file of dashFiles) {
  const obj = JSON.parse(fs.readFileSync(path.join(dashDir, file), 'utf8'))
  let ok_local = true
  if (!checkString(obj, 'slug', file)) ok_local = false
  if (!checkString(obj, 'title', file)) ok_local = false
  if (!checkString(obj, 'excerpt', file, false)) { /* optional */ }
  if (!checkString(obj, 'body', file, false)) { /* optional */ }
  if (!checkString(obj, 'persona', file)) ok_local = false
  if (!checkArray(obj, 'tools', file)) ok_local = false
  if (!checkArray(obj, 'useCases', file)) ok_local = false
  checkSeo(obj.seo, file)
  if (ok_local) ok(file, 'valid')
}

// ─── Work Page Dashboards ────────────────────────────────────────────────────
console.log('\n=== Work Page Dashboards ===')
const wpdDir = path.join(CONTENT_DIR, 'work-page-dashboards')
const wpdFiles = fs.readdirSync(wpdDir).filter(f => f.endsWith('.json'))
console.log(`Found ${wpdFiles.length} work-page-dashboard files (expected 4)`)
if (wpdFiles.length !== 4) warn('', `Expected 4 work-page-dashboards, got ${wpdFiles.length}`)
for (const file of wpdFiles) {
  const obj = JSON.parse(fs.readFileSync(path.join(wpdDir, file), 'utf8'))
  let ok_local = true
  if (!checkString(obj, 'slug', file)) ok_local = false
  if (!checkString(obj, 'title', file)) ok_local = false
  if (!checkString(obj, 'excerpt', file, false)) { /* optional */ }
  if (!checkString(obj, 'body', file, false)) { /* optional */ }
  checkSeo(obj.seo, file)
  if (ok_local) ok(file, 'valid')
}

// ─── Blog Posts ─────────────────────────────────────────────────────────────
console.log('\n=== Blog Posts ===')
const blogDir = path.join(CONTENT_DIR, 'blog-posts')
const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'))
console.log(`Found ${blogFiles.length} blog post files`)
for (const file of blogFiles) {
  const raw = fs.readFileSync(path.join(blogDir, file), 'utf8')
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!fmMatch) { err(file, 'Missing frontmatter'); continue }
  const fm = fmMatch[1]
  // Match double-quoted YAML scalar; allow escaped \" inside value
  const get = (key) => fm.match(new RegExp(`^${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`,'m'))?.[1] || ''
  let ok_local = true
  if (!get('title')) { err(file, 'Missing title'); ok_local = false }
  if (!get('date')) { err(file, 'Missing date'); ok_local = false }
  if (!get('category')) { err(file, 'Missing category'); ok_local = false }
  if (!get('seoTitle')) { err(file, 'Missing seoTitle'); ok_local = false }
  if (!get('seoDescription')) { err(file, 'Missing seoDescription'); ok_local = false }
  checkFeaturedImage(get('featuredImage'), file)
  if (ok_local) ok(file, 'valid')
}

// ─── Careers ────────────────────────────────────────────────────────────────
console.log('\n=== Careers ===')
const careersDir = path.join(CONTENT_DIR, 'careers')
const careerFiles = fs.readdirSync(careersDir).filter(f => f.endsWith('.json'))
console.log(`Found ${careerFiles.length} career file(s)`)
for (const file of careerFiles) {
  const obj = JSON.parse(fs.readFileSync(path.join(careersDir, file), 'utf8'))
  let ok_local = true
  if (!checkString(obj, 'slug', file)) ok_local = false
  if (!checkString(obj, 'title', file)) ok_local = false
  if (!checkString(obj, 'excerpt', file, false)) { /* optional */ }
  if (!checkString(obj, 'description', file)) ok_local = false
  if (!checkArray(obj, 'requirements', file)) ok_local = false
  checkSeo(obj.seo, file)
  if (ok_local) ok(file, 'valid')
}

// ─── Pages ──────────────────────────────────────────────────────────────────
console.log('\n=== Pages ===')
const pagesDir = path.join(CONTENT_DIR, 'pages')
const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.json'))
const EXPECTED_PAGES = ['home','about','work','contact','dsc-optimizer','try-dsc-optimizer',
  'terms-and-conditions','privacy-policy','accessibility','sitemap-page']
console.log(`Found ${pageFiles.length} page files (expected 10)`)
for (const exp of EXPECTED_PAGES) {
  if (!pageFiles.includes(`${exp}.json`)) err(`${exp}.json`, 'MISSING required page file')
}
for (const file of pageFiles) {
  const obj = JSON.parse(fs.readFileSync(path.join(pagesDir, file), 'utf8'))
  let ok_local = true
  if (!checkString(obj, 'slug', file)) ok_local = false
  if (!checkString(obj, 'title', file)) ok_local = false
  checkSeo(obj.seo, file)

  // Type-specific checks
  if (file === 'home.json') {
    if (!obj.hero) { err(file, 'Missing hero object'); ok_local = false }
    else {
      if (!obj.hero.headline) err(file, 'hero.headline missing')
      if (!obj.hero.subheading) err(file, 'hero.subheading missing')
      if (!obj.hero.ctaLabel) err(file, 'hero.ctaLabel missing')
      if (!obj.hero.backgroundImage) err(file, 'hero.backgroundImage missing')
      if (obj.hero.backgroundImage && obj.hero.backgroundImage.startsWith('http'))
        err(file, 'hero.backgroundImage must be a local path')
    }
    if (!Array.isArray(obj.sections)) err(file, 'sections must be an array')
  } else if (file === 'contact.json') {
    if (!checkString(obj, 'intro', file)) ok_local = false
    if (!obj.contactDetails) err(file, 'Missing contactDetails')
  } else if (['terms-and-conditions.json','privacy-policy.json','accessibility.json','sitemap-page.json'].includes(file)) {
    if (!checkString(obj, 'body', file)) ok_local = false
  } else {
    if (!Array.isArray(obj.sections)) err(file, 'sections must be an array')
  }
  if (ok_local) ok(file, 'valid')
}

// ─── Meta Files ─────────────────────────────────────────────────────────────
console.log('\n=== Meta Files ===')
const nav = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'meta/nav.json'), 'utf8'))
if (!Array.isArray(nav.items) || nav.items.length === 0) err('nav.json', 'items array missing/empty')
else ok('nav.json', `valid (${nav.items.length} top-level items)`)

const site = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'meta/site.json'), 'utf8'))
if (!site.siteUrl) err('site.json', 'siteUrl missing')
else if (!site.defaultSeo?.title) err('site.json', 'defaultSeo.title missing')
else if (!site.footer?.social?.length) err('site.json', 'footer.social missing/empty')
else ok('site.json', `valid (${site.footer.social.length} social platforms)`)

// ─── Summary ────────────────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════')
console.log(`PASSED: ${passed}  ERRORS: ${errors}  WARNINGS: ${warnings}`)
if (errors > 0) {
  console.error('\n⛔ Validation FAILED — fix errors before proceeding')
  process.exit(1)
} else if (warnings > 0) {
  console.warn('\n⚠️  Validation passed with warnings')
} else {
  console.log('\n✅ All content validated successfully')
}
