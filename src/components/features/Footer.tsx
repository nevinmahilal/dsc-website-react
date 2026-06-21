import type { JSX } from 'react'
import Link from 'next/link'
import { getSiteData } from '@/lib/content'

function FacebookIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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

export function Footer() {
  const { footer } = getSiteData()

  return (
    <footer aria-label="Site footer" className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 3-column grid — COMPANY hidden on mobile */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Column 1: DSC logo + social icons */}
          <div className="flex flex-col gap-6">
            <Link href="/" aria-label="DSC — home" className="text-3xl font-semibold text-tech-teal tracking-tight">DSC</Link>
            <div className="flex items-center gap-4">
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
                    className="text-cool-charcoal hover:text-tech-teal transition-colors"
                  >
                    <Icon />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Column 2: COMPANY — hidden on mobile */}
          <div className="hidden md:flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-cool-charcoal">Company</p>
            <p className="text-sm font-light text-body-text">{footer.company.headline}</p>
            <Link
              href={footer.company.ctaHref}
              className="inline-block self-start bg-tech-teal text-cool-charcoal text-sm font-semibold px-5 py-2 rounded hover:bg-dark-teal transition-colors"
            >
              {footer.company.ctaLabel}
            </Link>
          </div>

          {/* Column 3: NAVIGATION */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-cool-charcoal">Navigation</p>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-2">
                {footer.navLinks.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm font-light text-body-text hover:text-tech-teal transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-gray-100 pt-6 flex flex-col gap-2 sm:flex-row sm:justify-between">
          <p className="text-xs font-light text-body-text">{footer.copyright}</p>
          <a
            href={`mailto:${footer.contactEmail}`}
            className="text-xs font-light text-body-text hover:text-tech-teal transition-colors"
          >
            {footer.contactEmail}
          </a>
        </div>
      </div>
    </footer>
  )
}
