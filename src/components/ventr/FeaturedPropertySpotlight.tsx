import type { Property } from '@/payload-types'

import { Media } from '@/components/Media'
import { ArrowUpRight, Bath, BedDouble, Maximize } from 'lucide-react'
import Link from 'next/link'

import { asMedia, formatArea, formatPrice } from './helpers'

export function FeaturedPropertySpotlight({ property }: { property: Property }) {
  const image = asMedia(property.heroImage)

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-ink text-white">
      <div className="grid lg:grid-cols-2">
        <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:min-h-[520px]">
          {image && <Media resource={image} fill imgClassName="object-cover" />}
        </div>
        <div className="flex flex-col justify-between gap-8 p-8 md:p-12">
          <div>
            <span className="text-sm uppercase tracking-widest text-white/60">
              Featured Property
            </span>
            <h3 className="mt-4 text-3xl font-semibold tracking-[-0.02em] md:text-[40px] md:leading-tight">
              {property.title}
            </h3>
            {property.address?.displayAddress && (
              <p className="mt-3 text-lg text-white/70">{property.address.displayAddress}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/80">
            {property.bedrooms != null && (
              <span className="flex items-center gap-2">
                <BedDouble className="size-5" /> {property.bedrooms} Bedrooms
              </span>
            )}
            {property.bathrooms != null && (
              <span className="flex items-center gap-2">
                <Bath className="size-5" /> {property.bathrooms} Bathrooms
              </span>
            )}
            {property.area != null && (
              <span className="flex items-center gap-2">
                <Maximize className="size-5" /> {formatArea(property.area, property.areaUnit)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-white/15 pt-6">
            <div>
              <p className="text-sm text-white/60">Price</p>
              <p className="text-2xl font-semibold md:text-3xl">
                {formatPrice(property.price, property.currency)}
              </p>
            </div>
            <Link
              href={`/properties/${property.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90"
            >
              View Details <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
