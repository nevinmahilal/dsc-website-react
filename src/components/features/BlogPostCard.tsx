import Link from 'next/link'
import type { BlogPost } from '@/types/content-types'

interface BlogPostCardProps {
  post: BlogPost
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="border border-cool-charcoal/10 rounded-lg bg-white overflow-hidden">
      <Link
        href={`/${post.slug}/`}
        className="block p-6 lg:p-8 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal focus-visible:ring-inset"
      >
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="text-xs font-light px-2 py-1 rounded bg-cool-white text-cool-charcoal">
            {post.category}
          </span>
          <span className="text-xs font-light text-cool-charcoal/60">
            {formattedDate}
          </span>
        </div>
        <h3 className="font-semibold text-lg text-cool-charcoal mb-2 group-hover:text-tech-teal transition-colors">
          {post.title}
        </h3>
        <p className="font-light text-body-text text-sm leading-relaxed">
          {post.excerpt}
        </p>
      </Link>
    </article>
  )
}
