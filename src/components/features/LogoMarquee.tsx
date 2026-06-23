'use client'

import { useState } from 'react'
import Image from 'next/image'

interface LogoImage {
  url: string
  alt: string
}

interface LogoMarqueeProps {
  images: LogoImage[]
  label?: string
}

export function LogoMarquee({ images, label = 'Customers' }: LogoMarqueeProps) {
  const [paused, setPaused] = useState(false)

  if (images.length === 0) return null

  return (
    <section
      className="py-10 bg-white overflow-hidden"
      aria-label={`${label} logos`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <p className="text-center text-xs tracking-widest uppercase text-cool-charcoal/60 mb-6 font-light">
        {label}
      </p>
      <div className={`flex animate-marquee${paused ? ' [animation-play-state:paused]' : ''}`}>
        {images.map((logo, i) => (
          <div key={i} className="shrink-0 mx-8 flex items-center">
            <Image
              src={logo.url}
              alt={logo.alt}
              width={120}
              height={40}
              className="object-contain"
              priority={i < 3}
            />
          </div>
        ))}
        {images.map((logo, i) => (
          <div key={`dup-${i}`} className="shrink-0 mx-8 flex items-center" aria-hidden="true">
            <Image
              src={logo.url}
              alt=""
              width={120}
              height={40}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
