import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPage } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'
import type { AboutPage, PageSection } from '@/types/content-types'

export function generateMetadata(): Metadata {
  const page = getPage<AboutPage>('about')
  if (!page) return {}
  return buildMetadata({
    title: page.seo.title,
    description: page.seo.description,
    canonicalPath: '/about/',
  })
}

interface TeamMember { photo: string; name: string; title: string }

function parseTeamMembers(sections: PageSection[]): TeamMember[] {
  const leaderIdx = sections.findIndex(
    s => s.type === 'heading' &&
         typeof s.text === 'string' &&
         (s.text as string).toLowerCase().trim() === 'leadership team'
  )
  if (leaderIdx === -1) return []

  const members: TeamMember[] = []
  const seenNames = new Set<string>()
  let i = leaderIdx + 1

  while (i + 3 < sections.length) {
    const photo = sections[i]
    const nameSection = sections[i + 1]
    const titleSection = sections[i + 2]
    const linkedIn = sections[i + 3]

    if (
      photo.type !== 'image' ||
      nameSection.type !== 'heading' ||
      titleSection.type !== 'heading' ||
      linkedIn.type !== 'image'
    ) break

    const name = typeof nameSection.text === 'string' ? nameSection.text.trim() : ''
    if (!name || seenNames.has(name)) break

    seenNames.add(name)
    members.push({
      photo: typeof photo.src === 'string' ? photo.src : '',
      name,
      title: typeof titleSection.text === 'string' ? titleSection.text.trim() : '',
    })
    i += 4
  }
  return members
}

interface WorkStep { title: string; html: string }

function parseWorkSteps(sections: PageSection[]): WorkStep[] {
  const hwwIdx = sections.findIndex(
    s => s.type === 'heading' &&
         typeof s.text === 'string' &&
         (s.text as string).toLowerCase().trim() === 'how we work'
  )
  if (hwwIdx === -1) return []

  const stepMap = new Map<string, string>()
  const relevant = sections.slice(hwwIdx + 1)

  for (let i = 0; i < relevant.length - 1; i++) {
    const curr = relevant[i]
    const next = relevant[i + 1]
    if (curr.type === 'heading' && next.type === 'richText') {
      const title = (curr.text as string).trim()
      const html = next.html as string
      if (!stepMap.has(title) || (html as string).includes('<p>')) {
        stepMap.set(title, html)
      }
    }
  }

  return Array.from(stepMap.entries()).map(([title, html]) => ({ title, html }))
}

export default function About() {
  const page = getPage<AboutPage>('about')
  if (!page) return null

  const csIdx = page.sections.findIndex(
    s => s.type === 'heading' &&
         typeof s.text === 'string' &&
         (s.text as string).toUpperCase().includes('COMPANY STORY')
  )
  const companyIntro = csIdx !== -1 ? (page.sections[csIdx + 1]?.html as string | undefined) : undefined
  const companyBody = csIdx !== -1 ? (page.sections[csIdx + 3]?.html as string | undefined) : undefined

  const teamMembers = parseTeamMembers(page.sections)

  const hwwIdx = page.sections.findIndex(
    s => s.type === 'heading' &&
         typeof s.text === 'string' &&
         (s.text as string).toLowerCase().trim() === 'how we work'
  )
  const hwwAfter = hwwIdx !== -1 ? page.sections.slice(hwwIdx + 1) : []
  const hwwFirstStepIdx = hwwAfter.findIndex(s => s.type === 'heading')
  const hwwIntroSection = (hwwFirstStepIdx !== -1 ? hwwAfter.slice(0, hwwFirstStepIdx) : hwwAfter).find(
    s => s.type === 'richText' && typeof s.html === 'string' && (s.html as string).includes('<p>')
  )
  const hwwIntro = hwwIntroSection?.html as string | undefined
  const workSteps = parseWorkSteps(page.sections)

  return (
    <main>
      {/* Header */}
      <section className="pt-24 pb-12 bg-cool-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-thin text-4xl lg:text-6xl text-cool-charcoal flex flex-wrap items-center gap-4">
            About{' '}
            <Image
              src="/images/pages/dsc-logo-about.png"
              alt="Data Solutions Consulting"
              width={180}
              height={56}
              className="object-contain"
            />
          </h1>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-cool-charcoal/60 mb-8">
            Company Story
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {companyIntro && (
              <div
                className="font-light text-body-text leading-relaxed"
                dangerouslySetInnerHTML={{ __html: companyIntro }}
              />
            )}
            {companyBody && (
              <div
                className={`font-light text-body-text leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_p:empty]:hidden [&_a]:text-tech-teal [&_a:hover]:underline${!companyIntro ? ' lg:col-span-2' : ''}`}
                dangerouslySetInnerHTML={{ __html: companyBody }}
              />
            )}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 bg-cool-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-cool-charcoal/60 mb-10">
            Leadership Team
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {teamMembers.map(member => (
              <div key={member.name} className="text-center">
                <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-cool-charcoal text-sm leading-snug">
                  {member.name}
                </h3>
                <p
                  className="font-light text-body-text text-xs mt-1 leading-snug"
                  dangerouslySetInnerHTML={{ __html: member.title.replace(/&amp;/g, '&') }}
                />
                <Image
                  src="/images/pages/linked-icon.png"
                  alt=""
                  width={20}
                  height={20}
                  className="mx-auto mt-2"
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-thin text-3xl lg:text-4xl text-cool-charcoal mb-8">
            How We Work
          </h2>
          {hwwIntro && (
            <div
              className="font-light text-body-text leading-relaxed mb-12 max-w-3xl [&_p]:mb-2 [&_p:last-child]:mb-0 [&_br]:hidden"
              dangerouslySetInnerHTML={{ __html: hwwIntro }}
            />
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {workSteps.map(step => (
              <div key={step.title}>
                <h3 className="font-semibold text-cool-charcoal text-xs uppercase tracking-widest mb-3">
                  {step.title}
                </h3>
                <div
                  className="font-light text-body-text text-sm leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: step.html }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
