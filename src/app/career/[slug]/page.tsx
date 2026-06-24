import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getCareers, getCareer } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'

export function generateStaticParams() {
  return getCareers().map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const career = getCareer(slug)
  if (!career) return {}
  return buildMetadata({
    title: career.seo?.title ?? career.title,
    description: career.seo?.description ?? career.excerpt,
    canonicalPath: `/career/${slug}/`,
  })
}

export default async function CareerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const career = getCareer(slug)
  if (!career) return notFound()

  return (
    <main>
      {/* Page Header */}
      <section className="pt-24 pb-10 bg-cool-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/careers/"
            className="inline-flex items-center text-sm font-light text-tech-teal hover:underline mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal"
          >
            <span aria-hidden="true">←</span> Back to Careers
          </Link>
          <h1 className="font-thin text-3xl lg:text-4xl text-cool-charcoal leading-snug">
            {career.title}
          </h1>
        </div>
      </section>

      {/* Metadata Pills */}
      {(career.careerType || career.location || career.salaryRange || career.startDate) && (
        <section className="py-6 bg-white border-b border-cool-charcoal/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-3">
            {career.careerType && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-tech-teal/10 text-tech-teal">
                {career.careerType}
              </span>
            )}
            {career.location && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cool-white text-cool-charcoal">
                <span aria-hidden="true">📍</span> {career.location}
              </span>
            )}
            {career.salaryRange && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cool-white text-cool-charcoal">
                {career.salaryRange}
              </span>
            )}
            {career.startDate && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cool-white text-cool-charcoal">
                Start: {career.startDate}
              </span>
            )}
          </div>
        </section>
      )}

      {/* Description */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="font-light text-body-text leading-relaxed [&_h2]:font-semibold [&_h2]:text-xl [&_h2]:text-cool-charcoal [&_h2]:mt-8 [&_h2]:mb-4 [&_h4]:font-semibold [&_h4]:text-base [&_h4]:text-cool-charcoal [&_h4]:mt-6 [&_h4]:mb-3 [&_p]:mb-4 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
            dangerouslySetInnerHTML={{ __html: career.description }}
          />
        </div>
      </section>

      {/* Requirements */}
      {career.requirements.length > 0 && (
        <section className="py-12 bg-cool-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-semibold text-xl text-cool-charcoal mb-6">Requirements</h2>
            <ul className="space-y-3">
              {career.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3 font-light text-body-text leading-relaxed">
                  <span className="mt-1 w-2 h-2 rounded-full bg-tech-teal flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CTA */}
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
