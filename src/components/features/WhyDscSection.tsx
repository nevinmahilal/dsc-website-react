import Image from 'next/image'
import type { PageSection } from '@/types/content-types'

interface WhyDscItem {
  title: string
  description: string
}

interface WhyDscSectionData extends PageSection {
  type: 'whyDsc'
  title: string
  quoteImage: string
  items: WhyDscItem[]
}

interface WhyDscSectionProps {
  section: WhyDscSectionData
}

export function WhyDscSection({ section }: WhyDscSectionProps) {
  return (
    <section className="py-16 lg:py-24 bg-white" aria-labelledby="why-dsc-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-12 lg:mb-16">
          <Image
            src={section.quoteImage}
            alt=""
            width={60}
            height={60}
            className="mb-6 opacity-60"
          />
          <h2
            id="why-dsc-heading"
            className="font-thin text-3xl lg:text-4xl text-cool-charcoal text-center"
          >
            {section.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {section.items.map((item, i) => (
            <div key={i} className="text-center md:text-left">
              <h3 className="font-semibold text-lg text-cool-charcoal mb-3">
                {item.title}
              </h3>
              <p className="font-light text-body-text leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
