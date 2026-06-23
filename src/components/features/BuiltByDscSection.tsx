import Image from 'next/image'
import Link from 'next/link'
import type { PageSection } from '@/types/content-types'

interface BuiltByDscSectionData extends PageSection {
  type: 'builtByDsc'
  title: string
  description: string
  cta: { label: string; href: string }
  productImages: Array<{ src: string; alt: string }>
  feature: {
    image: { src: string; alt: string }
    title: string
    description: string
  }
}

interface BuiltByDscSectionProps {
  section: BuiltByDscSectionData
}

export function BuiltByDscSection({ section }: BuiltByDscSectionProps) {
  return (
    <section className="py-16 lg:py-24 bg-cool-white" aria-labelledby="built-by-dsc-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 lg:mb-14">
          <h2
            id="built-by-dsc-heading"
            className="font-thin text-3xl lg:text-4xl text-cool-charcoal mb-4"
          >
            {section.title}
          </h2>
          <p className="font-light text-body-text max-w-2xl leading-relaxed mb-6">
            {section.description}
          </p>
          <Link
            href={section.cta.href}
            className="inline-block bg-tech-teal text-white font-semibold text-sm px-8 py-3 rounded hover:bg-dark-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal focus-visible:ring-offset-2"
          >
            {section.cta.label}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 lg:mb-14">
          {section.productImages.map((img, i) => (
            <div key={i} className="relative aspect-video rounded-lg overflow-hidden shadow-md">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 bg-white rounded-lg p-6 lg:p-10 shadow-sm">
          <div className="relative w-full md:w-1/2 aspect-video rounded-lg overflow-hidden">
            <Image
              src={section.feature.image.src}
              alt={section.feature.image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="font-semibold text-xl text-cool-charcoal mb-3">
              {section.feature.title}
            </h3>
            <p className="font-light text-body-text leading-relaxed">
              {section.feature.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
