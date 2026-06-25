import type { MetadataRoute } from 'next'
import {
  getCaseStudies,
  getDashboards,
  getWorkPageDashboards,
  getBlogPosts,
  getBlogCategories,
  getCareers,
} from '@/lib/content'

function slugify(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '')

  const staticPages: MetadataRoute.Sitemap = [
    '/',
    '/about/',
    '/work/',
    '/case-studies/',
    '/dashboards/',
    '/our-blog/',
    '/careers/',
    '/contact/',
    '/dsc-optimizer/',
    '/try-dsc-optimizer/',
    '/terms-and-conditions/',
    '/privacy-policy/',
    '/accessibility/',
    '/sitemap/',
  ].map((path) => ({ url: `${base}${path}` }))

  const caseStudyPages: MetadataRoute.Sitemap = getCaseStudies().map((s) => ({
    url: `${base}/case-study/${s.slug}/`,
  }))

  const dashboardPages: MetadataRoute.Sitemap = getDashboards().map((d) => ({
    url: `${base}/dashboard/${d.slug}/`,
  }))

  const workPageDashboards: MetadataRoute.Sitemap = getWorkPageDashboards().map((d) => ({
    url: `${base}/work-page-dashboard/${d.slug}/`,
  }))

  const blogPages: MetadataRoute.Sitemap = getBlogPosts().map((p) => ({
    url: `${base}/${p.slug}/`,
    ...(p.date ? { lastModified: new Date(p.date) } : {}),
  }))

  const careerPages: MetadataRoute.Sitemap = getCareers().map((c) => ({
    url: `${base}/career/${c.slug}/`,
  }))

  const categoryPages: MetadataRoute.Sitemap = getBlogCategories().map((cat) => ({
    url: `${base}/category/${slugify(cat)}/`,
  }))

  return [
    ...staticPages,
    ...caseStudyPages,
    ...dashboardPages,
    ...workPageDashboards,
    ...blogPages,
    ...careerPages,
    ...categoryPages,
  ]
}
