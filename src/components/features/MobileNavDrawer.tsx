'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import type { JSX } from 'react'
import type { NavItem } from '@/types/nav-types'

// ─── Social icon components (inline SVG — no icon library installed) ───────────
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

// ─── Props ─────────────────────────────────────────────────────────────────────
interface MobileNavDrawerProps {
  navItems: NavItem[]
  socialLinks: Array<{ platform: string; href: string }>
  ctaHref: string
  ctaLabel: string
}

// ─── Component ─────────────────────────────────────────────────────────────────
export function MobileNavDrawer({ navItems, socialLinks, ctaHref, ctaLabel }: MobileNavDrawerProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  // close() is stable (useCallback with no deps) so effects can safely depend on it
  const close = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  // Body scroll lock — position:fixed approach works on iOS Safari unlike overflow:hidden alone
  useEffect(() => {
    if (!open) return
    const scrollY = window.scrollY
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }, [open])

  // Keyboard: Escape to close + Tab focus trap within drawer
  useEffect(() => {
    if (!open) return
    const drawer = drawerRef.current
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        close()
        return
      }
      if (e.key === 'Tab' && drawer) {
        const focusable = Array.from(
          drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus() }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus() }
        }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, close])

  // inert attribute hides drawer from keyboard and AT when closed
  useEffect(() => {
    const drawer = drawerRef.current
    if (!drawer) return
    if (open) {
      drawer.removeAttribute('inert')
    } else {
      drawer.setAttribute('inert', '')
    }
  }, [open])

  // Delay focus move until after the 300ms open transition completes
  useEffect(() => {
    if (!open) return
    const id = setTimeout(() => {
      const firstFocusable = drawerRef.current?.querySelector<HTMLElement>('a[href], button')
      firstFocusable?.focus()
    }, 300)
    return () => clearTimeout(id)
  }, [open])

  // Close drawer automatically if viewport is resized above the md breakpoint
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {/* ── Hamburger trigger — only visible on mobile ─────────────────────── */}
      <button
        ref={triggerRef}
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        onClick={() => setOpen(v => !v)}
        className="md:hidden flex items-center justify-center w-10 h-10 text-cool-charcoal hover:text-tech-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal rounded"
      >
        {/* + icon (two perpendicular bars) */}
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* ── Full-screen drawer overlay ─────────────────────────────────────── */}
      <div
        id="mobile-nav-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        className={`fixed inset-0 z-[60] bg-cool-charcoal flex flex-col px-8 pt-24 pb-8 transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ── Nav links ─────────────────────────────────────────────────────── */}
        <nav aria-label="Mobile navigation links" className="flex flex-col gap-2 grow">
          {navItems.map((item) => {
            if (item.isCTA) return null

            if (item.children?.length) {
              return (
                <div
                  key={item.label}
                  className="flex flex-col"
                  role="group"
                  aria-labelledby={`nav-group-${item.label.toLowerCase()}`}
                >
                  <span
                    id={`nav-group-${item.label.toLowerCase()}`}
                    className="text-2xl font-light text-white/60 py-2"
                  >
                    {item.label}
                  </span>
                  <div className="flex flex-col pl-4 gap-1">
                    {item.children.map((child) => {
                      // If child has nested children (Tools → DSC Optimizer), flatten them
                      if (child.children?.length) {
                        return child.children.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={close}
                            className="text-xl font-light text-white hover:text-tech-teal transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal rounded"
                          >
                            {sub.label}
                          </Link>
                        ))
                      }
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={close}
                          className="text-xl font-light text-white hover:text-tech-teal transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal rounded"
                        >
                          {child.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            }

            if (item.href) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className="text-2xl font-light text-white hover:text-tech-teal transition-colors py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal rounded"
                >
                  {item.label}
                </Link>
              )
            }

            return null
          })}
        </nav>

        {/* ── Social icons ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-5 mb-5">
          {socialLinks.map(({ platform, href }) => {
            const Icon = socialIconMap[platform]
            if (!Icon) return null
            const label = socialLabelMap[platform] ?? `Follow DSC on ${platform}`
            return (
              <a
                key={platform}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-tech-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal rounded"
              >
                <Icon />
              </a>
            )
          })}
        </div>

        {/* ── "Get In Touch" CTA ────────────────────────────────────────────── */}
        <Link
          href={ctaHref}
          onClick={close}
          className="block text-center border border-white text-white text-sm font-semibold px-5 py-3 rounded hover:border-tech-teal hover:text-tech-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal"
        >
          {ctaLabel}
        </Link>

        {/* ── Circled × close button — flowed at bottom right ───────────────── */}
        <div className="flex justify-end mt-6">
          <button
            aria-label="Close navigation menu"
            onClick={close}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-white text-white hover:border-tech-teal hover:text-tech-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal"
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
