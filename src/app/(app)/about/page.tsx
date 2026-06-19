import type { Metadata } from 'next'

import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { AgentCard } from '@/components/ventr/AgentCard'
import { Breadcrumbs } from '@/components/ventr/Breadcrumbs'
import { SectionHeading } from '@/components/ventr/SectionHeading'
import { asMedia, asUser } from '@/components/ventr/helpers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

const CONTAINER = 'mx-auto max-w-[1440px] px-5 md:px-[100px]'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const about = await payload.findGlobal({ slug: 'about-page', depth: 1 })
  return {
    title: about?.seo?.metaTitle || 'About Us — Ventr',
    description: about?.seo?.metaDescription || undefined,
  }
}

export default async function AboutPage() {
  const payload = await getPayload({ config: configPromise })
  const about = await payload.findGlobal({ slug: 'about-page', depth: 2 })

  const heroImage = asMedia(about?.hero?.backgroundImage)
  const storyImage = asMedia(about?.storySection?.image)
  const stats = about?.missionSection?.stats || []
  const values = about?.valuesSection?.values || []
  const agents = (about?.featuredAgents || [])
    .map(asUser)
    .filter(Boolean) as NonNullable<ReturnType<typeof asUser>>[]

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[420px] w-full overflow-hidden md:min-h-[520px]">
        {heroImage ? (
          <Media resource={heroImage} fill imgClassName="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-ink" />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className={`relative ${CONTAINER} flex min-h-[420px] flex-col justify-end pb-14 md:min-h-[520px]`}>
          <h1 className="text-4xl font-semibold tracking-[-0.03em] text-white md:text-[64px]">
            {about?.hero?.heading || 'About Us'}
          </h1>
          <div className="mt-4">
            <Breadcrumbs light items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} />
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      {(about?.missionSection?.heading || about?.missionSection?.body) && (
        <section className={`${CONTAINER} py-16 md:py-24`}>
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.02em] text-foreground md:text-[48px]">
              {about?.missionSection?.heading}
            </h2>
            <div className="text-base text-subtle md:text-lg">
              {about?.missionSection?.body && (
                <RichText data={about.missionSection.body as never} enableGutter={false} enableProse={false} />
              )}
            </div>
          </div>
          {stats.length > 0 && (
            <div className="mt-14 grid grid-cols-2 gap-8 border-t border-line pt-10 md:grid-cols-4">
              {stats.map((s, i) => (
                <div key={s.id || i}>
                  <p className="text-4xl font-semibold tracking-[-0.02em] text-foreground md:text-5xl">
                    {s.value}
                  </p>
                  <p className="mt-2 text-sm text-subtle">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Story ── */}
      {(about?.storySection?.heading || storyImage) && (
        <section className={`${CONTAINER} py-16 md:py-24`}>
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            {storyImage && (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] bg-line">
                <Media resource={storyImage} fill imgClassName="object-cover" />
              </div>
            )}
            <div>
              {about?.storySection?.heading && (
                <h2 className="text-3xl font-semibold leading-[1.2] tracking-[-0.02em] text-foreground md:text-[40px]">
                  {about.storySection.heading}
                </h2>
              )}
              {about?.storySection?.body && (
                <div className="mt-6 text-base text-subtle md:text-lg">
                  <RichText data={about.storySection.body as never} enableGutter={false} enableProse={false} />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Values ── */}
      {values.length > 0 && (
        <section className={`${CONTAINER} py-16 md:py-24`}>
          <SectionHeading heading={about?.valuesSection?.heading || 'Our Values'} />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <div key={v.id || i} className="rounded-[24px] border border-line p-7">
                <h3 className="text-xl font-semibold tracking-[-0.01em] text-foreground">{v.title}</h3>
                {v.description && <p className="mt-3 text-sm text-subtle">{v.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Agents ── */}
      {agents.length > 0 && (
        <section className={`${CONTAINER} py-16 md:py-24`}>
          <SectionHeading heading="Meet Our Agents" viewAllLabel="All Agents" viewAllHref="/agents" />
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((a) => (
              <AgentCard key={a.id} agent={a} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
