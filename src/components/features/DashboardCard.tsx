'use client'

import Link from 'next/link'
import type { Dashboard } from '@/types/content-types'

interface DashboardCardProps {
  dashboard: Dashboard
}

export function DashboardCard({ dashboard }: DashboardCardProps) {
  return (
    <article className="border border-cool-charcoal/10 rounded-lg overflow-hidden bg-white">
      <Link
        href={`/dashboard/${dashboard.slug}/`}
        className="block p-6 lg:p-8 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal focus-visible:ring-inset"
      >
        <h3 className="font-semibold text-lg text-cool-charcoal mb-3 group-hover:text-tech-teal transition-colors">
          {dashboard.title}
        </h3>

        <p className="font-light text-body-text text-sm leading-relaxed">
          {dashboard.excerpt || 'No description available.'}
        </p>

        {(dashboard.tools ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {dashboard.tools.map(tool => (
              <span
                key={tool}
                className="text-xs font-light px-2 py-1 rounded bg-cool-white text-cool-charcoal"
              >
                {tool}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  )
}
