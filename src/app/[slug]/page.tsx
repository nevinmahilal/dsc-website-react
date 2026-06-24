import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getBlogPosts, getBlogPost } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'

export function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return notFound()
  return buildMetadata({
    title: post.seoTitle,
    description: post.seoDescription,
    canonicalPath: `/${slug}/`,
    ogImage: post.featuredImage || undefined,
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return notFound()

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main>
      <section className="pt-24 pb-10 bg-cool-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/our-blog/"
            className="inline-flex items-center text-sm font-light text-tech-teal hover:underline mb-6"
          >
            ← Back to Our Blog
          </Link>
          <h1 className="font-thin text-3xl lg:text-4xl text-cool-charcoal leading-snug">
            {post.title}
          </h1>
        </div>
      </section>

      {post.featuredImage && (
        <Image
          src={post.featuredImage}
          alt={post.title}
          width={1200}
          height={630}
          className="w-full h-auto"
          priority
        />
      )}

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            {post.category && (
              <span className="bg-cool-white text-cool-charcoal text-xs font-light px-2 py-1 rounded">
                {post.category}
              </span>
            )}
            <span className="text-xs font-light text-cool-charcoal/60">{formattedDate}</span>
          </div>

          {post.body && (
            <div
              className="font-light text-body-text leading-relaxed [&_p]:mb-4 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_h2]:font-semibold [&_h2]:text-cool-charcoal [&_h2]:mt-8 [&_h2]:mb-4 [&_h4]:font-semibold [&_h4]:text-cool-charcoal [&_h4]:mt-6 [&_h4]:mb-3 [&_pre]:overflow-x-auto [&_pre]:bg-cool-white [&_pre]:p-4 [&_pre]:rounded [&_code]:font-mono [&_code]:text-sm"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          )}
        </div>
      </section>
    </main>
  )
}
