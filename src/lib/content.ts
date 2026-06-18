import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type {
  CaseStudy,
  Dashboard,
  WorkPageDashboard,
  BlogPost,
  Career,
} from '@/types/content-types'
import type { NavData } from '@/types/nav-types'

const contentRoot = path.join(process.cwd(), 'content')

// ===== Inline interfaces =====

interface SiteData {
  siteUrl: string
  name: string
  defaultSeo: { title: string; description: string; ogImage?: string }
  footer: {
    copyright: string
    social: { platform: string; href: string }[]
    contactEmail: string
    contactPhone?: string
  }
}

// ===== Helpers =====

function stripGutenbergComments(html: string): string {
  return html.replace(/<!--\s*\/?wp:[^>]*-->/g, '').trim()
}

// ===== Case Studies =====

export function getCaseStudies(): CaseStudy[] {
  const dir = path.join(contentRoot, 'case-studies')
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map(
      (f) =>
        JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) as CaseStudy
    )
}

export function getCaseStudy(slug: string): CaseStudy | null {
  const dir = path.join(contentRoot, 'case-studies')
  const filePath = path.join(dir, `${slug}.json`)
  if (!filePath.startsWith(dir + path.sep)) return null
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as CaseStudy
}

// ===== Dashboards =====

export function getDashboards(): Dashboard[] {
  const dir = path.join(contentRoot, 'dashboards')
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map(
      (f) =>
        JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) as Dashboard
    )
}

export function getDashboard(slug: string): Dashboard | null {
  const dir = path.join(contentRoot, 'dashboards')
  const filePath = path.join(dir, `${slug}.json`)
  if (!filePath.startsWith(dir + path.sep)) return null
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Dashboard
}

// ===== Work Page Dashboards =====

export function getWorkPageDashboards(): WorkPageDashboard[] {
  const dir = path.join(contentRoot, 'work-page-dashboards')
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map(
      (f) =>
        JSON.parse(
          fs.readFileSync(path.join(dir, f), 'utf-8')
        ) as WorkPageDashboard
    )
}

export function getWorkPageDashboard(slug: string): WorkPageDashboard | null {
  const dir = path.join(contentRoot, 'work-page-dashboards')
  const filePath = path.join(dir, `${slug}.json`)
  if (!filePath.startsWith(dir + path.sep)) return null
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as WorkPageDashboard
}

// ===== Blog Posts =====

export function getBlogPosts(): BlogPost[] {
  const dir = path.join(contentRoot, 'blog-posts')
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const slug = f.replace(/\.mdx$/, '')
      const { data } = matter(fs.readFileSync(path.join(dir, f), 'utf-8'))
      return { slug, ...data } as BlogPost
    })
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
}

export function getBlogPost(slug: string): (BlogPost & { body: string }) | null {
  const dir = path.join(contentRoot, 'blog-posts')
  const filePath = path.join(dir, `${slug}.mdx`)
  if (!filePath.startsWith(dir + path.sep)) return null
  if (!fs.existsSync(filePath)) return null
  const { data, content } = matter(fs.readFileSync(filePath, 'utf-8'))
  return {
    slug,
    title: data.title as string,
    excerpt: data.excerpt as string,
    date: data.date as string,
    category: data.category as string,
    featuredImage: (data.featuredImage as string) ?? '',
    seoTitle: data.seoTitle as string,
    seoDescription: data.seoDescription as string,
    body: stripGutenbergComments(content),
  }
}

export function getBlogCategories(): string[] {
  const posts = getBlogPosts()
  return [...new Set(posts.map((p) => p.category).filter(Boolean))]
}

// ===== Careers =====

export function getCareers(): Career[] {
  const dir = path.join(contentRoot, 'careers')
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map(
      (f) =>
        JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) as Career
    )
}

export function getCareer(slug: string): Career | null {
  const dir = path.join(contentRoot, 'careers')
  const filePath = path.join(dir, `${slug}.json`)
  if (!filePath.startsWith(dir + path.sep)) return null
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Career
}

// ===== Page Loaders =====

export function getPage<T>(name: string): T | null {
  const dir = path.join(contentRoot, 'pages')
  const filePath = path.join(dir, `${name}.json`)
  if (!filePath.startsWith(dir + path.sep)) return null
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T
}

// ===== Meta Loaders =====

export function getNavData(): NavData {
  return JSON.parse(
    fs.readFileSync(path.join(contentRoot, 'meta', 'nav.json'), 'utf-8')
  ) as NavData
}

export function getSiteData(): SiteData {
  return JSON.parse(
    fs.readFileSync(path.join(contentRoot, 'meta', 'site.json'), 'utf-8')
  ) as SiteData
}
