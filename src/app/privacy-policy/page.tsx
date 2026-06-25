import type { Metadata } from 'next'
import { getPage } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'
import type { StaticContentPage } from '@/types/content-types'

const PROSE_CLASSES =
  'font-light text-body-text leading-relaxed ' +
  '[&_h1]:font-thin [&_h1]:text-3xl [&_h1]:lg:text-4xl [&_h1]:text-cool-charcoal [&_h1]:mb-6 [&_h1]:leading-tight ' +
  '[&_h2]:font-semibold [&_h2]:text-cool-charcoal [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:leading-snug ' +
  '[&_p]:mb-4 [&_p:empty]:hidden ' +
  '[&_b]:font-semibold [&_strong]:font-semibold ' +
  '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 ' +
  '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 ' +
  '[&_li]:mb-1 ' +
  '[&_a]:text-tech-teal [&_a]:underline [&_a:hover]:text-dark-teal ' +
  '[&_table]:block [&_table]:overflow-x-auto [&_table]:max-w-full [&_table]:mb-8 [&_table]:text-sm ' +
  '[&_th]:text-left [&_th]:font-semibold [&_th]:p-2 [&_th]:border [&_th]:border-cool-charcoal/20 [&_th]:bg-cool-white [&_th]:align-top ' +
  '[&_td]:p-2 [&_td]:border [&_td]:border-cool-charcoal/20 [&_td]:align-top [&_td]:leading-relaxed'

export function generateMetadata(): Metadata {
  const page = getPage<StaticContentPage>('privacy-policy')
  if (!page) return {}
  return buildMetadata({
    title: page.seo.title,
    description: page.seo.description,
    canonicalPath: '/privacy-policy/',
  })
}

export default function PrivacyPolicy() {
  const page = getPage<StaticContentPage>('privacy-policy')
  if (!page) return null

  return (
    <main>
      <section className="pt-32 pb-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={PROSE_CLASSES}
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        </div>
      </section>
    </main>
  )
}
