'use client'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Star } from 'lucide-react'

import { asMedia } from './helpers'

type Testimonial = {
  quote: string
  authorName: string
  authorTitle?: string | null
  authorAvatar?: number | MediaType | null
  rating?: number | null
  id?: string | null
}

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials?.length) return null

  return (
    <Carousel opts={{ align: 'start', loop: true }} className="w-full">
      <CarouselContent>
        {testimonials.map((t, i) => {
          const avatar = asMedia(t.authorAvatar)
          return (
            <CarouselItem key={t.id || i} className="md:basis-1/2">
              <figure className="flex h-full flex-col gap-6 rounded-[24px] border border-line p-8">
                {t.rating != null && (
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className={
                          s < (t.rating ?? 0)
                            ? 'size-4 fill-foreground text-foreground'
                            : 'size-4 text-line'
                        }
                      />
                    ))}
                  </div>
                )}
                <blockquote className="flex-1 text-lg leading-relaxed text-foreground">
                  “{t.quote}”
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <div className="relative size-12 overflow-hidden rounded-full bg-line">
                    {avatar && <Media resource={avatar} fill imgClassName="object-cover" />}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.authorName}</p>
                    {t.authorTitle && <p className="text-sm text-subtle">{t.authorTitle}</p>}
                  </div>
                </figcaption>
              </figure>
            </CarouselItem>
          )
        })}
      </CarouselContent>
      <div className="mt-8 flex justify-end gap-3">
        <CarouselPrevious className="static translate-y-0" />
        <CarouselNext className="static translate-y-0" />
      </div>
    </Carousel>
  )
}
