'use client'

import type { Dashboard } from '@/types/content-types'
import { FilterableGrid } from './FilterableGrid'
import { DashboardCard } from './DashboardCard'

interface DashboardsGridProps {
  data: Dashboard[]
}

const filterConfigs = [
  { id: 'tools', label: 'Tools', isArray: true },
  { id: 'useCases', label: 'Use Cases', isArray: true },
] as const

export function DashboardsGrid({ data }: DashboardsGridProps) {
  return (
    <FilterableGrid
      data={data}
      filterConfigs={[...filterConfigs]}
      renderItem={d => <DashboardCard key={d.slug} dashboard={d} />}
      emptyMessage="No dashboards match the selected filters."
    />
  )
}
