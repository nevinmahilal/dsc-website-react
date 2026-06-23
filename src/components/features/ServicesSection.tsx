import type { PageSection } from '@/types/content-types'

interface ServiceItem {
  title: string
  description: string
}

interface ServicesSectionData extends PageSection {
  type: 'services'
  title: string
  items: ServiceItem[]
}

interface ServicesSectionProps {
  section: ServicesSectionData
}

export function ServicesSection({ section }: ServicesSectionProps) {
  return (
    <section className="py-16 lg:py-24 bg-cool-white" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="services-heading"
          className="font-thin text-3xl lg:text-4xl text-cool-charcoal text-center mb-12 lg:mb-16"
        >
          {section.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {section.items.map((item, i) => (
            <div key={i} className="bg-white rounded-lg p-6 lg:p-8 shadow-sm">
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
