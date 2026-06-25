import type { JSX } from 'react'
import type { Metadata } from 'next'
import type { ContactPage } from '@/types/content-types'
import { getPage, getSiteData } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'
import { ContactForm } from '@/components/features'

function EnvelopeIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 7L2 7" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l-.01-8.81a8.18 8.18 0 0 0 4.78 1.52V4.56a4.85 4.85 0 0 1-1-.87z" />
    </svg>
  )
}

const socialIconMap: Record<string, () => JSX.Element> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  tiktok: TikTokIcon,
}

const socialLabelMap: Record<string, string> = {
  facebook: 'Follow DSC on Facebook',
  instagram: 'Follow DSC on Instagram',
  linkedin: 'Follow DSC on LinkedIn',
  tiktok: 'Follow DSC on TikTok',
}

export function generateMetadata(): Metadata {
  const page = getPage<ContactPage>('contact')
  if (!page?.seo) return {}
  return buildMetadata({
    title: page.seo.title,
    description: page.seo.description,
    canonicalPath: '/contact/',
  })
}

export default function ContactPage() {
  const page = getPage<ContactPage>('contact')
  const { footer } = getSiteData()
  const email = page?.contactDetails?.email || footer.contactEmail

  return (
    <main>
      {/* Section 1: Page Header */}
      <section className="pt-24 pb-12 bg-cool-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-thin text-4xl lg:text-5xl text-cool-charcoal mb-4">
            {page?.title ?? 'Contact'}
          </h1>
          {page?.intro && (
            <p className="font-light text-lg text-body-text">{page.intro}</p>
          )}
        </div>
      </section>

      {/* Section 2: Contact Form */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </section>

      {/* Section 3: Connect With Us */}
      <section className="py-16 bg-cool-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-thin text-3xl lg:text-4xl text-cool-charcoal mb-12">
            Connect With Us
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-12 sm:gap-24">
            {/* EMAIL column */}
            {email && (
              <div className="flex flex-col items-center gap-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-cool-charcoal">Email</p>
                <a
                  href={`mailto:${email}`}
                  aria-label={`Email DSC at ${email}`}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-tech-teal text-white hover:bg-dark-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal focus-visible:ring-offset-2"
                >
                  <EnvelopeIcon />
                </a>
              </div>
            )}

            {/* SOCIAL column */}
            {footer.social.length > 0 && (
              <div className="flex flex-col items-center gap-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-cool-charcoal">Social</p>
                <div className="flex items-center gap-3">
                  {footer.social.map(({ platform, href }) => {
                    const Icon = socialIconMap[platform]
                    const label = socialLabelMap[platform] ?? `Follow DSC on ${platform}`
                    if (!Icon) return null
                    return (
                      <a
                        key={platform}
                        href={href}
                        aria-label={label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-tech-teal text-white hover:bg-dark-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal focus-visible:ring-offset-2"
                      >
                        <Icon />
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
