import type { Metadata } from 'next'
import { getSiteData } from '@/lib/content'

interface BuildMetadataParams {
  title: string
  description: string
  canonicalPath: string
  ogImage?: string
}

export function buildMetadata({
  title,
  description,
  canonicalPath,
  ogImage,
}: BuildMetadataParams): Metadata {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://datasolutionsinc.ca'
  ).replace(/\/$/, '')
  const site = getSiteData()
  const resolvedOgImage = ogImage || site.defaultSeo.ogImage
  const normalizedPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`
  const canonicalUrl = `${siteUrl}${normalizedPath}`

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: resolvedOgImage ? [{ url: `${siteUrl}${resolvedOgImage}` }] : [],
    },
  }
}
