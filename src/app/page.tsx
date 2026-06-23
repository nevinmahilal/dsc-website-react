import type { Metadata } from 'next'
import { getPage } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'
import {
  HeroSection,
  LogoMarquee,
  ServicesSection,
  WhyDscSection,
  BuiltByDscSection,
} from '@/components/features'
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

  type ImageCarousel = {
    type: string
    name?: string
    images?: Array<{ url: string; alt: string }>
  }
  type ServicesData = {
    type: string
    title: string
    items: Array<{ title: string; description: string }>
  }
  type WhyDscData = {
    type: string
    title: string
    quoteImage: string
    items: Array<{ title: string; description: string }>
  }
  type BuiltByDscData = {
    type: string
    title: string
    description: string
    cta: { label: string; href: string }
    productImages: Array<{ src: string; alt: string }>
    feature: {
      image: { src: string; alt: string }
      title: string
      description: string
    }
  }

  const customersCarousel = page.sections.find(
    s => s.type === 'imageCarousel' && (s as ImageCarousel).name === 'customers'
  ) as ImageCarousel | undefined

  const servicesSection = page.sections.find(
    s => s.type === 'services'
  ) as ServicesData | undefined

  const whyDscSection = page.sections.find(
    s => s.type === 'whyDsc'
  ) as WhyDscData | undefined

  const builtByDscSection = page.sections.find(
    s => s.type === 'builtByDsc'
  ) as BuiltByDscData | undefined

  const partnersCarousel = page.sections.find(
    s => s.type === 'imageCarousel' && (s as ImageCarousel).name === 'partners'
  ) as ImageCarousel | undefined

  return (
    <main>
      <HeroSection hero={page.hero} />
      {customersCarousel?.images && (
        <LogoMarquee images={customersCarousel.images} label="Customers" />
      )}
      {servicesSection && <ServicesSection section={servicesSection as Parameters<typeof ServicesSection>[0]['section']} />}
      {whyDscSection && <WhyDscSection section={whyDscSection as Parameters<typeof WhyDscSection>[0]['section']} />}
      {builtByDscSection && <BuiltByDscSection section={builtByDscSection as Parameters<typeof BuiltByDscSection>[0]['section']} />}
      {partnersCarousel?.images && (
        <LogoMarquee images={partnersCarousel.images} label="Partners" />
      )}
    </main>
  )
}
