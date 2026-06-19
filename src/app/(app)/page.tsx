import type { Metadata } from 'next'

import { Media } from '@/components/Media'
import { AgentCard } from '@/components/ventr/AgentCard'
import { BenefitCard } from '@/components/ventr/BenefitCard'
import { FaqAccordion } from '@/components/ventr/FaqAccordion'
import { FeaturedPropertySpotlight } from '@/components/ventr/FeaturedPropertySpotlight'
import { PropertyCard } from '@/components/ventr/PropertyCard'
import { PropertySearchBar } from '@/components/ventr/PropertySearchBar'
import { SectionHeading } from '@/components/ventr/SectionHeading'
import { TestimonialCarousel } from '@/components/ventr/TestimonialCarousel'
import { asMedia, asProperty, asUser } from '@/components/ventr/helpers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const CONTAINER = 'mx-auto max-w-[1440px] px-5 md:px-[100px]'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const home = await payload.findGlobal({ slug: 'home-page', depth: 1 })
  return {
    title: home?.seo?.metaTitle || 'Ventr — Find Your Dream Home',
    description: home?.seo?.metaDescription || undefined,
  }
}

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  const home = await payload.findGlobal({ slug: 'home-page', depth: 2 })

  const heroImage = asMedia(home?.hero?.backgroundImage)
  const featured = asProperty(home?.featuredPropertySection?.property)
  const latest = (home?.latestPropertiesSection?.properties || [])
    .map(asProperty)
    .filter(Boolean) as NonNullable<ReturnType<typeof asProperty>>[]
  const agents = (home?.agentsSection?.featuredAgents || [])
    .map(asUser)
    .filter(Boolean) as NonNullable<ReturnType<typeof asUser>>[]
  const benefits = home?.benefitsSection?.benefits || []
  const testimonials = home?.testimonialsSection?.testimonials || []
  const faqs = home?.faqSection?.faqs || []

  return (
    <>
      {/* ── 1. Hero ── */}
      <section className="relative">
        <div className="relative min-h-[560px] w-full overflow-hidden md:min-h-[680px]">
          {heroImage ? (
            <Media resource={heroImage} fill imgClassName="object-cover" priority />
          ) : (
            <div className="absolute inset-0 bg-ink" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40" />
          <div className={`relative ${CONTAINER} flex min-h-[560px] flex-col justify-center py-20 md:min-h-[680px]`}>
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold leading-[1.1] tracking-[-0.03em] text-white md:text-[64px]">
                {home?.hero?.heading || 'Select Best Residence That Aligns With Your Lifestyle'}
              </h1>
              {home?.hero?.subHeading && (
                <p className="mt-6 max-w-xl text-base text-white/80 md:text-lg">
                  {home.hero.subHeading}
                </p>
              )}
            </div>
            <div className="mt-10">
              <PropertySearchBar
                locationPlaceholder={home?.hero?.searchLocationPlaceholder || 'Location'}
                buttonLabel={home?.hero?.searchButtonLabel || 'Search'}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. About ── */}
      {home?.aboutSection?.body && (
        <section className={`${CONTAINER} py-16 md:py-24`}>
          <div className="grid gap-8 md:grid-cols-[280px_1fr] md:gap-16">
            <span className="text-sm font-medium uppercase tracking-widest text-subtle">
              {home.aboutSection.label || 'About Us'}
            </span>
            <div>
              <p className="text-2xl font-medium leading-snug tracking-[-0.01em] text-foreground md:text-[32px] md:leading-[1.3]">
                {home.aboutSection.body}
              </p>
              {home.aboutSection.ctaLabel && home.aboutSection.ctaHref && (
                <Link
                  href={home.aboutSection.ctaHref}
                  className="mt-8 inline-flex rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  {home.aboutSection.ctaLabel}
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── 3. Featured Property Spotlight ── */}
      {featured && (
        <section className={`${CONTAINER} py-8 md:py-12`}>
          <FeaturedPropertySpotlight property={featured} />
        </section>
      )}

      {/* ── 4. Benefits ── */}
      {benefits.length > 0 && (
        <section className={`${CONTAINER} py-16 md:py-24`}>
          <SectionHeading
            heading={home?.benefitsSection?.heading}
            subText={home?.benefitsSection?.subText}
            viewAllLabel={home?.benefitsSection?.viewAllLabel}
            viewAllHref={home?.benefitsSection?.viewAllHref}
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <BenefitCard key={b.id || i} number={b.number} title={b.title} description={b.description} />
            ))}
          </div>
        </section>
      )}

      {/* ── 5. Latest Properties ── */}
      {latest.length > 0 && (
        <section className={`${CONTAINER} py-16 md:py-24`}>
          <SectionHeading
            heading={home?.latestPropertiesSection?.heading}
            subText={home?.latestPropertiesSection?.subText}
            viewAllLabel={home?.latestPropertiesSection?.viewAllLabel}
            viewAllHref={home?.latestPropertiesSection?.viewAllHref}
          />
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
            {latest.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── 6. Our Agents ── */}
      {agents.length > 0 && (
        <section className={`${CONTAINER} py-16 md:py-24`}>
          <SectionHeading
            heading={home?.agentsSection?.heading}
            subText={home?.agentsSection?.subText}
            viewAllLabel={home?.agentsSection?.viewAllLabel}
            viewAllHref={home?.agentsSection?.viewAllHref}
          />
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((a) => (
              <AgentCard key={a.id} agent={a} />
            ))}
          </div>
        </section>
      )}

      {/* ── 7. Testimonials ── */}
      {testimonials.length > 0 && (
        <section className={`${CONTAINER} py-16 md:py-24`}>
          <SectionHeading
            heading={home?.testimonialsSection?.heading}
            subText={home?.testimonialsSection?.subText}
          />
          <div className="mt-12">
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>
      )}

      {/* ── 8. FAQ ── */}
      {faqs.length > 0 && (
        <section className={`${CONTAINER} py-16 md:py-24`}>
          <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
            <SectionHeading
              heading={home?.faqSection?.heading}
              subText={home?.faqSection?.subText}
              viewAllLabel={home?.faqSection?.viewAllLabel}
              viewAllHref={home?.faqSection?.viewAllHref}
            />
            <FaqAccordion faqs={faqs} />
          </div>
        </section>
      )}
    </>
  )
}
