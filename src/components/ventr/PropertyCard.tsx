import type { Property } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/cn'
import { ArrowUpRight, Bath, BedDouble, Maximize } from 'lucide-react'
import Link from 'next/link'

import { asMedia, formatArea } from './helpers'

export function PropertyCard({ property, className }: { property: Property; className?: string }) {
  const image = asMedia(property.heroImage)
  const address = property.address?.displayAddress

  return (
    <article className={cn('group flex flex-col', className)}>
      <Link
        href={`/properties/${property.slug}`}
        className="relative block aspect-square w-full overflow-hidden rounded-[16px] bg-line"
      >
        {image && (
          <Media
            resource={image}
            fill
            imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </Link>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-2xl font-semibold tracking-[-0.02em] text-foreground">
            {property.title}
          </h3>
          {address && (
            <p className="mt-1 truncate text-base text-subtle">{address}</p>
          )}
        </div>
        <Link
          href={`/properties/${property.slug}`}
          aria-label={`View ${property.title}`}
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-foreground transition-colors group-hover:bg-foreground group-hover:text-background"
        >
          <ArrowUpRight className="size-5" />
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-subtle">
        {property.bedrooms != null && (
          <span className="flex items-center gap-1.5">
            <BedDouble className="size-4" /> {property.bedrooms} Beds
          </span>
        )}
        {property.bathrooms != null && (
          <span className="flex items-center gap-1.5">
            <Bath className="size-4" /> {property.bathrooms} Baths
          </span>
        )}
        {property.area != null && (
          <span className="flex items-center gap-1.5">
            <Maximize className="size-4" /> {formatArea(property.area, property.areaUnit)}
          </span>
        )}
      </div>
    </article>
  )
}
