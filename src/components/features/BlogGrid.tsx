'use client'

import type { BlogPost } from '@/types/content-types'
import { FilterableGrid } from './FilterableGrid'
import { BlogPostCard } from './BlogPostCard'
import type { FilterConfig } from './FilterPanel'

interface BlogGridProps {
  data: BlogPost[]
}

const filterConfigs: FilterConfig[] = [
  { id: 'title', label: 'Search posts...', type: 'search' },
  { id: 'category', label: 'Category', type: 'radio' },
]

export function BlogGrid({ data }: BlogGridProps) {
  return (
    <FilterableGrid
      data={data}
      filterConfigs={filterConfigs}
      renderItem={post => <BlogPostCard key={post.slug} post={post} />}
      emptyMessage="No posts match your search."
    />
  )
}
