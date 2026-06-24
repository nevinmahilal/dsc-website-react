import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getWorkPageDashboards, getWorkPageDashboard } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'
import { DashboardEmbed } from '@/components/features'

export function generateStaticParams() {
  return getWorkPageDashboards().map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const dashboard = getWorkPageDashboard(slug)
  if (!dashboard) return notFound()
  return buildMetadata({
    title: dashboard.seo?.title ?? 'Work Dashboard | DSC',
    description: dashboard.seo?.description ?? '',
    canonicalPath: `/work-page-dashboard/${slug}/`,
  })
}

export default async function WorkPageDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const dashboard = getWorkPageDashboard(slug)
  if (!dashboard) return notFound()

  return (
    <main>
      {/* Page Header */}
      <section className="pt-24 pb-10 bg-cool-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/work/"
            className="inline-flex items-center text-sm font-light text-tech-teal hover:underline mb-6"
          >
            ← Back to Work
          </Link>
          <h1 className="font-thin text-3xl lg:text-4xl text-cool-charcoal leading-snug">
            {dashboard.title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {dashboard.excerpt && (
            <p className="font-light text-body-text leading-relaxed text-lg">
              {dashboard.excerpt}
            </p>
          )}
          {dashboard.body && (
            <DashboardEmbed body={dashboard.body} />
          )}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-12 bg-cool-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-light text-body-text mb-6">
            Want a custom dashboard built for your business?
          </p>
          <Link
            href="/contact/"
            className="inline-block px-8 py-3 border border-tech-teal text-tech-teal font-semibold text-sm rounded hover:bg-tech-teal hover:text-white transition-colors"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </main>
  )
}
