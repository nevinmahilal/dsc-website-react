import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getDashboards, getDashboard } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'
import { DashboardEmbed } from '@/components/features'

export function generateStaticParams() {
  return getDashboards().map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const dashboard = getDashboard(slug)
  if (!dashboard) return notFound()
  return buildMetadata({
    title: dashboard.seo?.title ?? 'Dashboard | DSC',
    description: dashboard.seo?.description ?? '',
    canonicalPath: `/dashboard/${slug}/`,
  })
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const dashboard = getDashboard(slug)
  if (!dashboard) return notFound()

  const hasTags =
    (dashboard.tools ?? []).length > 0 ||
    (dashboard.useCases ?? []).length > 0 ||
    !!dashboard.persona

  return (
    <main>
      {/* Page Header */}
      <section className="pt-24 pb-10 bg-cool-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboards/"
            className="inline-flex items-center text-sm font-light text-tech-teal hover:underline mb-6"
          >
            ← Back to Dashboards
          </Link>
          <h1 className="font-thin text-3xl lg:text-4xl text-cool-charcoal leading-snug">
            {dashboard.title}
          </h1>
        </div>
      </section>

      {/* Taxonomy Tags */}
      {hasTags && (
        <section className="py-6 bg-white border-b border-cool-charcoal/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-3">
            {[...new Set(dashboard.tools ?? [])].map((tool) => (
              <span
                key={tool}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-tech-teal/10 text-tech-teal"
              >
                {tool}
              </span>
            ))}
            {[...new Set(dashboard.useCases ?? [])].map((uc) => (
              <span
                key={uc}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-cool-white text-cool-charcoal"
              >
                {uc}
              </span>
            ))}
            {dashboard.persona && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cool-white text-cool-charcoal">
                {dashboard.persona}
              </span>
            )}
          </div>
        </section>
      )}

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
