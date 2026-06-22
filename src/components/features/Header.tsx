import Link from 'next/link'
import { getNavData, getSiteData } from '@/lib/content'
import { NavDropdown } from './NavDropdown'
import { MobileNavDrawer } from './MobileNavDrawer'

export function Header() {
  const { items = [] } = getNavData()
  const { footer } = getSiteData()
  const ctaItem = items.find(item => item.isCTA)

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100"
      aria-label="Site header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            aria-label="DSC — home"
            className="text-2xl font-semibold text-tech-teal tracking-tight"
          >
            DSC
          </Link>

          {/* Desktop nav — only visible ≥768px */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
            {items.map((item) => {
              if (item.isCTA && item.href) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="border border-tech-teal text-tech-teal text-sm font-semibold px-5 py-2 rounded hover:bg-tech-teal hover:text-cool-charcoal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal"
                  >
                    {item.label}
                  </Link>
                )
              }
              if (item.children?.length) {
                return <NavDropdown key={item.label} item={item} />
              }
              if (item.href) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-sm font-light text-cool-charcoal hover:text-tech-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal rounded"
                  >
                    {item.label}
                  </Link>
                )
              }
              return null
            })}
          </nav>

          {/* Mobile: hamburger trigger + drawer — self-contained in MobileNavDrawer */}
          <MobileNavDrawer
            navItems={items}
            socialLinks={footer?.social ?? []}
            ctaHref={ctaItem?.href ?? '/contact/'}
            ctaLabel={ctaItem?.label ?? 'Get In Touch'}
          />
        </div>
      </div>
    </header>
  )
}
