import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getCaseStudies, getCaseStudy } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'

export function generateStaticParams() {
  return getCaseStudies().map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (!study) return notFound()
  return buildMetadata({
    title: study.seo?.title ?? 'Case Study | DSC',
    description: study.seo?.description ?? '',
    canonicalPath: `/case-study/${slug}/`,
  })
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (!study) return notFound()

  const hasTags =
    (study.serviceTags ?? []).length > 0 ||
    study.industry ||
    (study.techStack ?? []).length > 0
  const hasAcfContent = study.challenge || study.whatWeDid || study.outcome

  return (
    <main>
      {/* Page Header */}
      <section className="pt-24 pb-10 bg-cool-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/case-studies/"
            className="inline-flex items-center text-sm font-light text-tech-teal hover:underline mb-6"
          >
            ← Back to Case Studies
          </Link>
          <h1 className="font-thin text-3xl lg:text-4xl text-cool-charcoal leading-snug">
            {study.title}
          </h1>
        </div>
      </section>

      {/* Taxonomy Tags */}
      {hasTags && (
        <section className="py-6 bg-white border-b border-cool-charcoal/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-3">
            {(study.serviceTags ?? []).map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-tech-teal/10 text-tech-teal"
              >
                {tag}
              </span>
            ))}
            {study.industry && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cool-white text-cool-charcoal">
                {study.industry}
              </span>
            )}
            {(study.techStack ?? []).map((tech) => (
              <span
                key={tech}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-cool-white text-cool-charcoal"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* ACF columns */}
          {hasAcfContent && (
            <div className="space-y-8">
              {study.challenge && (
                <div>
                  <h2 className="text-xs font-semibold tracking-widest uppercase text-tech-teal mb-3">
                    Challenge
                  </h2>
                  <p className="font-light text-body-text leading-relaxed">
                    {study.challenge}
                  </p>
                </div>
              )}
              {study.whatWeDid && (
                <div>
                  <h2 className="text-xs font-semibold tracking-widest uppercase text-tech-teal mb-3">
                    How We Did It
                  </h2>
                  <p className="font-light text-body-text leading-relaxed whitespace-pre-line">
                    {study.whatWeDid}
                  </p>
                </div>
              )}
              {study.outcome && (
                <div>
                  <h2 className="text-xs font-semibold tracking-widest uppercase text-tech-teal mb-3">
                    Outcome
                  </h2>
                  <p className="font-light text-body-text leading-relaxed">
                    {study.outcome}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* WordPress body HTML (post_content) */}
          {study.body && (
            <div
              className="font-light text-body-text leading-relaxed [&_p]:mb-4 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
              dangerouslySetInnerHTML={{ __html: study.body }}
            />
          )}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-12 bg-cool-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-light text-body-text mb-6">
            Interested in what DSC can do for your organization?
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
