import type { Metadata } from 'next'
import Link from 'next/link'
import { getPage } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'
import type { TryDscOptimizerPage } from '@/types/content-types'

export function generateMetadata(): Metadata {
  const page = getPage<TryDscOptimizerPage>('try-dsc-optimizer')
  if (!page) return {}
  return buildMetadata({
    title: page.seo.title,
    description: page.seo.description,
    canonicalPath: '/try-dsc-optimizer/',
  })
}

export default function TryDscOptimizer() {
  const page = getPage<TryDscOptimizerPage>('try-dsc-optimizer')
  if (!page) return null

  const h1 = page.sections.find(s => s.type === 'heading' && s.tag === 'h1')
  const description = page.sections.find(s => s.type === 'richText')
  const requestHeading = page.sections.find(
    s =>
      s.type === 'heading' &&
      typeof s.text === 'string' &&
      (s.text as string).toLowerCase().includes('request access')
  )

  return (
    <main>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {h1 && (
            <h1 className="font-thin text-4xl lg:text-5xl xl:text-6xl text-cool-charcoal mb-8">
              {h1.text as string}
            </h1>
          )}
          {description && (
            <div
              className="font-light text-body-text text-lg leading-relaxed mb-12 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_p:empty]:hidden max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: (description.html ?? '') as string }}
            />
          )}
          {requestHeading && (
            <div className="bg-cool-white rounded-2xl p-10 max-w-lg mx-auto">
              <h2 className="font-thin text-2xl lg:text-3xl text-cool-charcoal mb-6">
                {requestHeading.text as string}
              </h2>
              <Link
                href="/contact/"
                className="inline-block bg-tech-teal text-white font-semibold px-8 py-3 rounded hover:bg-dark-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal focus-visible:ring-offset-2"
              >
                Get In Touch
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Let's Talk CTA */}
      <section className="py-16 bg-tech-teal text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-thin text-3xl lg:text-4xl mb-6">
            Let&apos;s talk about your data
          </h2>
          <Link
            href="/contact/"
            className="inline-block border-2 border-white text-white font-semibold text-sm px-8 py-3 rounded hover:bg-white hover:text-tech-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-tech-teal"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </main>
  )
}
