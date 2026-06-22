import type { Metadata } from 'next'
import { getPage } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'
import { HeroSection } from '@/components/features'
import type { HomePage } from '@/types/content-types'

export function generateMetadata(): Metadata {
  const page = getPage<HomePage>('home')
  if (!page) return {}
  return buildMetadata({
    title: page.seo.title,
    description: page.seo.description,
    canonicalPath: '/',
    ogImage: page.seo.ogImage,
  })
}

export default function Home() {
  const page = getPage<HomePage>('home')
  if (!page) return null

  return (
    <main>
      <HeroSection hero={page.hero} />
    </main>
  )
}
