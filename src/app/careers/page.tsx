import type { Metadata } from 'next'
import type { Career } from '@/types/content-types'
import { getCareers } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'
import Link from 'next/link'

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: 'Careers | Join the DSC Team | Data Solutions Consulting',
    description:
      'Explore open positions at DSC. Join a fast-growing analytics consulting firm and build your career in data engineering, BI, and cloud analytics.',
    canonicalPath: '/careers/',
  })
}

export default function CareersPage() {
  let careers: Career[] = []
  try {
    careers = getCareers()
  } catch {
    careers = []
  }

  return (
    <main>
      {/* Page Header */}
      <section className="pt-24 pb-12 bg-cool-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-thin text-4xl lg:text-5xl text-cool-charcoal">Careers</h1>
        </div>
      </section>

      {/* Careers List */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {careers.length === 0 ? (
            <p className="font-light text-body-text">
              No open positions at this time. Check back soon.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {careers.map((career) => (
                <li key={career.slug} className="py-8">
                  <Link href={`/career/${career.slug}/`} className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal">
                    <h2 className="font-semibold text-xl text-cool-charcoal group-hover:text-tech-teal transition-colors mb-3">
                      {career.title}
                    </h2>
                  </Link>
                  <p className="font-light text-body-text leading-relaxed mb-4">
                    {career.excerpt}
                  </p>
                  <Link
                    href={`/career/${career.slug}/`}
                    className="inline-block text-sm font-semibold text-tech-teal hover:text-dark-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal"
                  >
                    View Position →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

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
