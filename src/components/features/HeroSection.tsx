import Image from 'next/image'
import Link from 'next/link'
import type { HomePage } from '@/types/content-types'

interface HeroSectionProps {
  hero: HomePage['hero']
}

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section
      className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      <Image
        src={hero.backgroundImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        quality={90}
      />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-16 max-w-4xl mx-auto">
        <p className="font-thin text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-cool-charcoal leading-tight tracking-tight mb-4">
          {hero.subheading}
        </p>

        <h1 className="font-light text-lg sm:text-xl text-cool-charcoal/80 max-w-2xl mb-8">
          {hero.headline}
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href={hero.ctaHref}
            className="inline-block bg-tech-teal text-white font-semibold text-sm px-8 py-3 rounded hover:bg-dark-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal focus-visible:ring-offset-2"
          >
            {hero.ctaLabel}
          </Link>

          <Link
            href="/contact/"
            className="md:hidden inline-block border border-cool-charcoal text-cool-charcoal font-semibold text-sm px-8 py-3 rounded hover:border-tech-teal hover:text-tech-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal focus-visible:ring-offset-2"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  )
}
