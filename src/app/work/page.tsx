import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPage, getCaseStudies, getDashboards } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'
import { CaseStudiesGrid } from '@/components/features'
import type { WorkPage } from '@/types/content-types'

export function generateMetadata(): Metadata {
  const page = getPage<WorkPage>('work')
  if (!page) return {}
  return buildMetadata({
    title: page.seo.title,
    description: page.seo.description,
    canonicalPath: '/work/',
  })
}

export default function Work() {
  const page = getPage<WorkPage>('work')
  const caseStudies = getCaseStudies()
  const dashboards = getDashboards()

  return (
    <main>
      {/* Page Header */}
      <section className="pt-24 pb-12 bg-cool-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-thin text-4xl lg:text-5xl text-cool-charcoal">
            Work
          </h1>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-12 bg-white" aria-labelledby="case-studies-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            id="case-studies-heading"
            className="text-xs font-semibold tracking-widest uppercase text-cool-charcoal/60 mb-8"
          >
            Case Studies
          </h2>
          <CaseStudiesGrid data={caseStudies} />
          <div className="mt-8">
            <Link
              href="/case-studies/"
              className="inline-block text-sm font-semibold text-tech-teal hover:text-dark-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal"
            >
              View All Case Studies →
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboards */}
      <section className="py-12 bg-cool-white" aria-labelledby="dashboards-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            id="dashboards-heading"
            className="text-xs font-semibold tracking-widest uppercase text-cool-charcoal/60 mb-8"
          >
            Dashboards
          </h2>
          {dashboards.length === 0 ? (
            <p className="font-light text-body-text text-sm py-4">No dashboards available.</p>
          ) : (
            <div className="space-y-4">
              {dashboards.map(dashboard => (
                <Link
                  key={dashboard.slug}
                  href={`/dashboard/${dashboard.slug}/`}
                  className="block border border-cool-charcoal/10 rounded-lg bg-white p-6 lg:p-8 hover:border-tech-teal/40 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal"
                >
                  <h3 className="font-semibold text-lg text-cool-charcoal mb-2 group-hover:text-tech-teal transition-colors">
                    {dashboard.title}
                  </h3>
                  {dashboard.excerpt && (
                    <p className="font-light text-body-text text-sm leading-relaxed mb-3">
                      {dashboard.excerpt}
                    </p>
                  )}
                  {dashboard.persona && (
                    <span className="inline-block text-xs font-light px-2 py-1 rounded bg-cool-white text-cool-charcoal">
                      {dashboard.persona}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
          <div className="mt-8">
            <Link
              href="/dashboards/"
              className="inline-block text-sm font-semibold text-tech-teal hover:text-dark-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal"
            >
              View All Dashboards →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {page?.testimonial && (
        <section className="py-16 lg:py-24 bg-cool-charcoal text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-4xl text-tech-teal font-thin mb-6 leading-none" aria-hidden="true">&ldquo;</p>
            <blockquote className="font-light text-lg lg:text-xl leading-relaxed mb-8">
              {page.testimonial.quote}
            </blockquote>
            {page.testimonial.author && (
              <p className="font-semibold text-sm text-white mb-2">
                {page.testimonial.author}
              </p>
            )}
            <div className="flex flex-col justify-center items-center gap-2">
              {page.testimonial.companyLogo && (
                <Image
                  src={page.testimonial.companyLogo}
                  alt=""
                  width={120}
                  height={40}
                  className="object-contain brightness-0 invert"
                />
              )}
              {page.testimonial.company && (
                <p className="font-semibold text-sm tracking-wide text-white/70">
                  {page.testimonial.company}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Let's talk CTA */}
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
