import type { Metadata } from 'next'
import { getCaseStudies } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'
import { CaseStudiesGrid } from '@/components/features'

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: 'Case Studies | Data Analytics & Business Intelligence | DSC',
    description: 'Browse DSC\'s portfolio of data analytics, business intelligence, and data engineering case studies. Filter by service, industry, or technology.',
    canonicalPath: '/case-studies/',
  })
}

export default function CaseStudies() {
  const caseStudies = getCaseStudies()

  return (
    <main>
      {/* Page Header */}
      <section className="pt-24 pb-12 bg-cool-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-thin text-4xl lg:text-5xl text-cool-charcoal">
            Case Studies
          </h1>
        </div>
      </section>

      {/* Case Studies with filtering */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CaseStudiesGrid data={caseStudies} />
        </div>
      </section>
    </main>
  )
}
