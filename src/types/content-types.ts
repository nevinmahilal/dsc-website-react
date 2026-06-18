// ===== Shared =====

export interface Seo {
  title: string
  description: string
  ogImage?: string
}

export interface PageSection {
  type: string
  [key: string]: unknown
}

// ===== Content Types =====

// Maps to content/case-studies/{slug}.json
// serviceTags, industry, techStack drive FR-14 faceted filtering
export interface CaseStudy {
  slug: string
  title: string
  excerpt: string
  body: string
  serviceTags: string[]
  industry: string
  techStack: string[]
  seo: Seo
}

// Maps to content/dashboards/{slug}.json
// tools, useCases drive FR-14b faceted filtering
export interface Dashboard {
  slug: string
  title: string
  excerpt: string
  body: string
  persona: string
  tools: string[]
  useCases: string[]
  seo: Seo
}

// Maps to content/work-page-dashboards/{slug}.json
export interface WorkPageDashboard {
  slug: string
  title: string
  excerpt: string
  body: string
  seo: Seo
}

// Maps to content/blog-posts/{slug}.mdx frontmatter
// Flat seoTitle/seoDescription (not nested seo object) — MDX frontmatter convention
// body content is the compiled MDX, not stored here
export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string          // ISO 8601 e.g. "2025-03-15T00:00:00Z"
  category: string
  featuredImage: string // Path under /public/images/ or absolute URL
  seoTitle: string
  seoDescription: string
}

// Maps to content/careers/{slug}.json
export interface Career {
  slug: string
  title: string
  excerpt: string
  description: string
  requirements: string[]
  seo: Seo
}

// ===== Page-Level Types (content/pages/) =====

export interface HomePage {
  slug: string
  title: string
  hero: {
    headline: string
    subheading: string
    ctaLabel: string
    ctaHref: string
    backgroundImage: string
  }
  sections: PageSection[]
  seo: Seo
}

export interface AboutPage {
  slug: string
  title: string
  sections: PageSection[]
  seo: Seo
}

export interface WorkPage {
  slug: string
  title: string
  sections: PageSection[]
  seo: Seo
}

export interface ContactPage {
  slug: string
  title: string
  intro: string
  contactDetails: {
    email?: string
    phone?: string
    address?: string
  }
  seo: Seo
}

export interface DscOptimizerPage {
  slug: string
  title: string
  sections: PageSection[]
  seo: Seo
}

export interface TryDscOptimizerPage {
  slug: string
  title: string
  sections: PageSection[]
  seo: Seo
}

// Shared shape for terms-and-conditions, privacy-policy, accessibility, sitemap-page
export interface StaticContentPage {
  slug: string
  title: string
  body: string
  seo: Seo
}
