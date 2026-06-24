import type { Metadata } from 'next'
import { getDashboards } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'
import { DashboardsGrid } from '@/components/features'

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: 'Dashboards | Business Intelligence & Analytics | DSC',
    description: 'Browse DSC\'s library of business intelligence dashboards. Filter by tool or use case to find dashboards built for your role.',
    canonicalPath: '/dashboards/',
  })
}

export default function Dashboards() {
  const dashboards = getDashboards()

  return (
    <main>
      {/* Page Header */}
      <section className="pt-24 pb-12 bg-cool-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-thin text-4xl lg:text-5xl text-cool-charcoal">
            Dashboards
          </h1>
        </div>
      </section>

      {/* Dashboards with filtering */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardsGrid data={dashboards} />
        </div>
      </section>
    </main>
  )
}
