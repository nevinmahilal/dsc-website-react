import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getBlogPosts, getBlogCategories } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'
import { BlogPostCard } from '@/components/features'

function slugify(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function generateStaticParams() {
  return getBlogCategories().map((cat) => ({ slug: slugify(cat) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const posts = getBlogPosts().filter((p) => p.category && slugify(p.category) === slug)
  if (!posts.length) notFound()
  const categoryName = posts[0].category
  return buildMetadata({
    title: `${categoryName} | DSC Blog`,
    description: `Browse all DSC blog posts on ${categoryName}.`,
    canonicalPath: `/category/${slug}/`,
  })
}

export default async function CategoryArchivePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const allPosts = getBlogPosts()
  const posts = allPosts.filter((p) => p.category && slugify(p.category) === slug)
  if (!posts.length) notFound()
  const categoryName = posts[0].category

  return (
    <main>
      <section className="pt-24 pb-12 bg-cool-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/our-blog/"
            className="inline-flex items-center text-sm font-light text-tech-teal hover:underline mb-6"
          >
            ← Back to Our Blog
          </Link>
          <h1 className="font-thin text-4xl lg:text-5xl text-cool-charcoal">
            {categoryName}
          </h1>
        </div>
      </section>
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {posts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
