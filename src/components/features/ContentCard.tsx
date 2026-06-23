'use client'

import Link from 'next/link'
import type { CaseStudy } from '@/types/content-types'

interface ContentCardProps {
  study: CaseStudy
}

export function ContentCard({ study }: ContentCardProps) {
  const hasAnyColumn = study.challenge || study.whatWeDid || study.outcome
  const columnCount = [study.challenge, study.whatWeDid, study.outcome].filter(Boolean).length
  const gridCols = columnCount === 1 ? '' : columnCount === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'

  return (
    <article className="border border-cool-charcoal/10 rounded-lg overflow-hidden bg-white">
      <Link
        href={`/case-study/${study.slug}/`}
        className="block p-6 lg:p-8 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal focus-visible:ring-inset"
      >
        <h3 className="font-semibold text-lg text-cool-charcoal mb-4 group-hover:text-tech-teal transition-colors">
          {study.title}
        </h3>

        {hasAnyColumn && (
          <div className={`grid grid-cols-1 gap-6 ${gridCols}`}>
            {study.challenge && (
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-tech-teal mb-2">
                  Challenge
                </p>
                <p className="font-light text-body-text text-sm leading-relaxed">
                  {study.challenge}
                </p>
              </div>
            )}
            {study.whatWeDid && (
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-tech-teal mb-2">
                  How We Did It
                </p>
                <p className="font-light text-body-text text-sm leading-relaxed">
                  {study.whatWeDid}
                </p>
              </div>
            )}
            {study.outcome && (
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-tech-teal mb-2">
                  Outcome
                </p>
                <p className="font-light text-body-text text-sm leading-relaxed">
                  {study.outcome}
                </p>
              </div>
            )}
          </div>
        )}

        {!hasAnyColumn && (
          <p className="font-light text-body-text text-sm leading-relaxed">
            {study.excerpt || 'No description available.'}
          </p>
        )}

        {(study.serviceTags ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {study.serviceTags.map(tag => (
              <span
                key={tag}
                className="text-xs font-light px-2 py-1 rounded bg-cool-white text-cool-charcoal"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  )
}
