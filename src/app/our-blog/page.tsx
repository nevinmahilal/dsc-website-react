import type { Metadata } from 'next'
import { getBlogPosts } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'
import { BlogPostCard } from '@/components/features'

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: 'Blog | Data Analytics Insights | DSC',
    description:
      "Explore DSC's thought-leadership articles on data analytics, business intelligence, Snowflake, Tableau, and more.",
    canonicalPath: '/our-blog/',
  })
}

export default function OurBlogPage() {
  const posts = getBlogPosts()

  return (
    <main>
      {/* Page Header */}
      <section className="pt-24 pb-12 bg-cool-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-thin text-4xl lg:text-5xl text-cool-charcoal">
            Our Blog
          </h1>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {posts.map(post => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
