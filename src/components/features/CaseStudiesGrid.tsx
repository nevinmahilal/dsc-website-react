'use client'

import type { CaseStudy } from '@/types/content-types'
import { FilterableGrid } from './FilterableGrid'
import { ContentCard } from './ContentCard'

interface CaseStudiesGridProps {
  data: CaseStudy[]
}

const filterConfigs = [
  { id: 'serviceTags', label: 'Service Tags', isArray: true },
  { id: 'industry', label: 'Industry', isArray: false },
  { id: 'techStack', label: 'Tech Stack', isArray: true },
] as const

export function CaseStudiesGrid({ data }: CaseStudiesGridProps) {
  return (
    <FilterableGrid
      data={data}
      filterConfigs={[...filterConfigs]}
      renderItem={study => <ContentCard key={study.slug} study={study} />}
      emptyMessage="No case studies match the selected filters."
    />
  )
}
