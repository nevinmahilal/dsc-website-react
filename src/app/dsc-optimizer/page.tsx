import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPage } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'
import type { DscOptimizerPage, PageSection } from '@/types/content-types'

export function generateMetadata(): Metadata {
  const page = getPage<DscOptimizerPage>('dsc-optimizer')
  if (!page) return {}
  return buildMetadata({
    title: page.seo.title,
    description: page.seo.description,
    canonicalPath: '/dsc-optimizer/',
  })
}

function parseSectionGroups(
  sections: PageSection[],
  afterHeading: string,
  stopHeading: string,
  withHtml: boolean
): Array<{ image: string; title: string; html?: string }> {
  const startIdx = sections.findIndex(
    s =>
      s.type === 'heading' &&
      typeof s.text === 'string' &&
      (s.text as string).toLowerCase().includes(afterHeading.toLowerCase())
  )
  if (startIdx === -1) return []

  const seenImages = new Set<string>()
  const items: Array<{ image: string; title: string; html?: string }> = []

  for (let i = startIdx + 1; i < sections.length; i++) {
    const sec = sections[i]
    if (
      sec.type === 'heading' &&
      typeof sec.text === 'string' &&
      (sec.text as string).toLowerCase().includes(stopHeading.toLowerCase())
    )
      break

    if (sec.type === 'image' && !seenImages.has(sec.src as string)) {
      const titleSec = sections[i + 1]
      const htmlSec = withHtml ? sections[i + 2] : undefined

      if (titleSec?.type === 'heading') {
        seenImages.add(sec.src as string)
        const item: { image: string; title: string; html?: string } = {
          image: sec.src as string,
          title: (titleSec.text as string).replace(/\n/g, ' ').replace(/[\u2028\u2029]/g, '').trim(),
        }
        if (withHtml && htmlSec?.type === 'richText') {
          item.html =
            typeof htmlSec.html === 'string' ? htmlSec.html : String(htmlSec.html ?? '')
        }
        items.push(item)
        if (items.length === 4) break
      }
    }
  }
  return items
}

export default function DscOptimizer() {
  const page = getPage<DscOptimizerPage>('dsc-optimizer')
  if (!page) return null

  const s = page.sections

  // Hero
  const h1Idx = s.findIndex(x => x.type === 'heading' && x.tag === 'h1')
  const heroTitle = h1Idx !== -1 ? (s[h1Idx].text as string) : undefined
  const heroSubtitle = h1Idx !== -1 ? (s[h1Idx + 1]?.text as string | undefined) : undefined
  const heroCta = s.find(x => x.type === 'cta')

  // Dashboard screenshots (4 images immediately after the CTA)
  const ctaIdx = s.findIndex(x => x.type === 'cta')
  const dashboardImages = ctaIdx !== -1
    ? s.slice(ctaIdx + 1, ctaIdx + 5).filter(x => x.type === 'image')
    : []

  // What DSC Optimizer Does (first 2 richTexts after heading)
  const whatIdx = s.findIndex(
    x =>
      x.type === 'heading' &&
      typeof x.text === 'string' &&
      (x.text as string).toLowerCase().includes('what dsc optimizer does')
  )
  const whatTexts =
    whatIdx !== -1 ? s.slice(whatIdx + 1).filter(x => x.type === 'richText').slice(0, 2) : []

  // Core Capabilities (deduped by image src)
  const capabilities = parseSectionGroups(s, 'core capabilities', 'why we built', true)

  // Why We Built It (deduped by html content, max 2 columns)
  const whyIdx = s.findIndex(
    x =>
      x.type === 'heading' &&
      typeof x.text === 'string' &&
      (x.text as string).toLowerCase().includes('why we built')
  )
  const whyTexts =
    whyIdx !== -1
      ? s.slice(whyIdx + 1).filter(x => x.type === 'richText').slice(0, 2)
      : []

  // Predictable Pricing
  const pricingIdx = s.findIndex(
    x =>
      x.type === 'heading' &&
      typeof x.text === 'string' &&
      (x.text as string).toLowerCase().includes('predictable pricing')
  )
  const pricingSubtitle =
    pricingIdx !== -1 ? (s[pricingIdx + 1]?.text as string | undefined) : undefined
  const monthlyLabel =
    pricingIdx !== -1 ? (s[pricingIdx + 2]?.text as string | undefined) : undefined
  const monthlyPrice =
    pricingIdx !== -1 ? (s[pricingIdx + 3]?.text as string | undefined) : undefined
  const annualLabel =
    pricingIdx !== -1 ? (s[pricingIdx + 4]?.text as string | undefined) : undefined
  const annualPrice =
    pricingIdx !== -1 ? (s[pricingIdx + 5]?.text as string | undefined) : undefined
  const whatsIncluded =
    pricingIdx !== -1 ? (s[pricingIdx + 6]?.text as string | undefined) : undefined

  // What's Coming Next
  const comingNextIdx = s.findIndex(
    x =>
      x.type === 'heading' &&
      typeof x.text === 'string' &&
      (x.text as string).toLowerCase().includes("what’s coming next")
  )
  const comingDescription =
    comingNextIdx !== -1 ? (s[comingNextIdx + 1]?.text as string | undefined) : undefined
  const comingSubLabel =
    comingNextIdx !== -1 ? (s[comingNextIdx + 2]?.text as string | undefined) : undefined
  const comingItems = parseSectionGroups(s, "what’s coming next", "who it’s for", false)
  const goalStatement = s.find(
    x =>
      x.type === 'heading' &&
      typeof x.text === 'string' &&
      (x.text as string).toLowerCase().includes('the goal is a unified')
  )?.text as string | undefined

  // Who It's For
  const whoItems = parseSectionGroups(s, "who it’s for", 'getting started', false)

  // Getting Started
  const gettingIdx = s.findIndex(
    x =>
      x.type === 'heading' &&
      typeof x.text === 'string' &&
      (x.text as string).toLowerCase().includes('getting started')
  )
  const gettingSubtitle =
    gettingIdx !== -1 ? (s[gettingIdx + 1]?.text as string | undefined) : undefined
  const gettingText =
    gettingIdx !== -1
      ? s.slice(gettingIdx + 2).find(x => x.type === 'richText')
      : undefined
  const gettingCta =
    gettingIdx !== -1 ? s.slice(gettingIdx + 2).find(x => x.type === 'cta') : undefined

  // Bottom brand section (cloud.png after Getting Started)
  const baseIdx = gettingIdx !== -1 ? gettingIdx : 0
  const cloudOffset = s
    .slice(baseIdx)
    .findIndex(
      x =>
        x.type === 'image' &&
        typeof x.src === 'string' &&
        (x.src as string).includes('cloud.png')
    )
  const absCloudIdx = cloudOffset !== -1 ? baseIdx + cloudOffset : -1
  const bottomHeading =
    absCloudIdx !== -1 ? (s[absCloudIdx + 1]?.text as string | undefined) : undefined
  const bottomText =
    absCloudIdx !== -1 ? (s[absCloudIdx + 2]?.html as string | undefined) : undefined

  return (
    <main>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {heroTitle && (
            <h1 className="font-thin text-4xl lg:text-5xl xl:text-6xl text-cool-charcoal mb-6">
              {heroTitle}
            </h1>
          )}
          {heroSubtitle && (
            <p className="font-light text-lg lg:text-xl text-body-text mb-10 max-w-2xl mx-auto">
              {heroSubtitle}
            </p>
          )}
          {heroCta && (
            <Link
              href={heroCta.href as string}
              className="inline-block bg-tech-teal text-white font-semibold px-8 py-3 rounded hover:bg-dark-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal focus-visible:ring-offset-2"
            >
              {heroCta.label as string}
            </Link>
          )}
        </div>
      </section>

      {/* Dashboard Screenshots Strip */}
      {dashboardImages.length > 0 && (
        <section className="bg-cool-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-6 overflow-x-auto pb-4">
              {dashboardImages.map((img, i) => (
                <Image
                  key={i}
                  src={img.src as string}
                  alt={
                    typeof img.alt === 'string'
                      ? (img.alt as string)
                      : 'DSC Optimizer dashboard screenshot'
                  }
                  width={600}
                  height={400}
                  className="rounded-xl shadow-md flex-shrink-0"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What DSC Optimizer Does */}
      {whatTexts.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-cool-charcoal/60 mb-8">
              What DSC Optimizer Does
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {whatTexts.map((col, i) => (
                <div
                  key={i}
                  className="font-light text-body-text leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_p:empty]:hidden [&_br]:hidden"
                  dangerouslySetInnerHTML={{ __html: (col.html ?? '') as string }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Core Capabilities */}
      {capabilities.length > 0 && (
        <section className="bg-cool-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-thin text-3xl lg:text-4xl text-cool-charcoal mb-12">
              Core Capabilities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {capabilities.map((cap, i) => (
                <div key={i}>
                  <Image
                    src={cap.image}
                    alt={cap.title}
                    width={120}
                    height={120}
                    className="mb-4"
                  />
                  <h3 className="font-semibold text-cool-charcoal mb-3">{cap.title}</h3>
                  {cap.html && (
                    <div
                      className="font-light text-body-text text-sm leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 [&_p:empty]:hidden"
                      dangerouslySetInnerHTML={{ __html: cap.html }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why We Built It */}
      {whyTexts.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-thin text-3xl lg:text-4xl text-cool-charcoal mb-10">
              Why We Built It
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {whyTexts.map((col, i) => (
                <div
                  key={i}
                  className="font-light text-body-text leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_p:empty]:hidden"
                  dangerouslySetInnerHTML={{ __html: (col.html ?? '') as string }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Predictable Pricing */}
      {pricingIdx !== -1 && (
        <section className="bg-cool-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-thin text-3xl lg:text-4xl text-cool-charcoal mb-4">
              Predictable Pricing
            </h2>
            {pricingSubtitle && (
              <p className="font-light text-body-text mb-10 max-w-2xl">{pricingSubtitle}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="bg-white border border-cool-charcoal/10 rounded-xl p-8 text-center">
                {monthlyLabel && (
                  <p className="text-xs font-semibold tracking-widest uppercase text-cool-charcoal/60 mb-4">
                    {monthlyLabel}
                  </p>
                )}
                {monthlyPrice && (
                  <p
                    className="text-3xl font-thin text-cool-charcoal [&_span]:text-tech-teal [&_span]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: monthlyPrice }}
                  />
                )}
              </div>
              <div className="bg-white border border-cool-charcoal/10 rounded-xl p-8 text-center">
                {annualLabel && (
                  <p className="text-xs font-semibold tracking-widest uppercase text-cool-charcoal/60 mb-4">
                    {annualLabel}
                  </p>
                )}
                {annualPrice && (
                  <p
                    className="text-3xl font-thin text-cool-charcoal [&_span]:text-tech-teal [&_span]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: annualPrice }}
                  />
                )}
              </div>
            </div>
            {whatsIncluded && (
              <h3 className="font-semibold text-cool-charcoal mt-12 mb-4 text-center">
                {whatsIncluded}
              </h3>
            )}
          </div>
        </section>
      )}

      {/* What's Coming Next */}
      {comingItems.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-thin text-3xl lg:text-4xl text-cool-charcoal mb-4">
              What&apos;s Coming Next
            </h2>
            {comingDescription && (
              <p className="font-light text-body-text mb-4">{comingDescription}</p>
            )}
            {comingSubLabel && (
              <p className="font-light text-body-text mb-10">
                {comingSubLabel.replace(/[\u2028\u2029]/g, ' ')}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {comingItems.map((item, i) => (
                <div key={i} className="text-center">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="mx-auto mb-4"
                  />
                  <p className="font-light text-cool-charcoal text-sm">{item.title}</p>
                </div>
              ))}
            </div>
            {goalStatement && (
              <p className="font-light text-body-text italic text-center mt-12 max-w-2xl mx-auto">
                {goalStatement}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Who It's For */}
      {whoItems.length > 0 && (
        <section className="bg-cool-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-thin text-3xl lg:text-4xl text-cool-charcoal mb-4">
              Who It&apos;s For
            </h2>
            <p className="font-light text-body-text mb-10">DSC Optimizer is built for:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {whoItems.map((item, i) => (
                <div key={i} className="text-center">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="mx-auto mb-4"
                  />
                  <p className="font-light text-cool-charcoal text-sm text-center">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Getting Started */}
      <section className="bg-white py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-thin text-3xl lg:text-4xl text-cool-charcoal mb-4">
            Getting Started
          </h2>
          {gettingSubtitle && (
            <p className="font-light text-body-text mb-6">{gettingSubtitle}</p>
          )}
          {gettingText && (
            <div
              className="font-light text-body-text mb-10 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_p:empty]:hidden"
              dangerouslySetInnerHTML={{ __html: (gettingText.html ?? '') as string }}
            />
          )}
          {gettingCta && (
            <Link
              href={gettingCta.href as string}
              className="inline-block bg-tech-teal text-white font-semibold px-8 py-3 rounded hover:bg-dark-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-teal focus-visible:ring-offset-2"
            >
              {gettingCta.label as string}
            </Link>
          )}
        </div>
      </section>

      {/* Bottom Brand Section */}
      {absCloudIdx !== -1 && (
        <section className="bg-cool-white py-16 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Image
              src={s[absCloudIdx].src as string}
              alt="DSC Optimizer"
              width={200}
              height={200}
              className="mx-auto"
            />
            {bottomHeading && (
              <h2 className="font-thin text-2xl text-cool-charcoal mt-6 mb-4">{bottomHeading}</h2>
            )}
            {bottomText && (
              <div
                className="font-light text-body-text [&_p]:mb-2 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: bottomText }}
              />
            )}
          </div>
        </section>
      )}

      {/* Let's Talk CTA */}
      <section className="py-16 bg-tech-teal text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-thin text-3xl lg:text-4xl mb-6">
            Let&apos;s talk about your data
          </h2>
          <Link
            href="/contact/"
            className="inline-block border-2 border-white text-white font-semibold text-sm px-8 py-3 rounded hover:bg-white hover:text-tech-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-tech-teal"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </main>
  )
}
