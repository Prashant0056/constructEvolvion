import type { Metadata } from 'next'
import type { Where } from 'payload'

import { Breadcrumbs } from '@/components/ventr/Breadcrumbs'
import { ListingPagination } from '@/components/ventr/ListingPagination'
import { ListingToolbar } from '@/components/ventr/ListingToolbar'
import { PropertyCard } from '@/components/ventr/PropertyCard'
import { PropertyListItem } from '@/components/ventr/PropertyListItem'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Properties — Ventr',
  description: 'Browse our latest real estate listings.',
}

const CONTAINER = 'mx-auto max-w-[1440px] px-5 md:px-[100px]'
const PER_PAGE = 10
const ALLOWED_SORT = new Set(['-createdAt', 'price', '-price', '-bedrooms'])

type SearchParams = Record<string, string | string[] | undefined>

const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)
const num = (v: string | string[] | undefined) => {
  const n = Number(str(v))
  return Number.isFinite(n) ? n : undefined
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const payload = await getPayload({ config: configPromise })

  const page = Math.max(1, num(sp.page) ?? 1)
  const sortParam = str(sp.sort)
  const sort = sortParam && ALLOWED_SORT.has(sortParam) ? sortParam : '-createdAt'
  const view = str(sp.view) === 'list' ? 'list' : 'grid'

  // Build query from filters
  const and: Where[] = [{ _status: { equals: 'published' } }]
  const listingType = str(sp.listingType)
  const propertyType = str(sp.propertyType)
  const city = str(sp.city)
  const minPrice = num(sp.minPrice)
  const maxPrice = num(sp.maxPrice)
  const minBeds = num(sp.minBeds)
  const minBaths = num(sp.minBaths)

  if (listingType === 'sale' || listingType === 'rent') and.push({ listingType: { equals: listingType } })
  if (propertyType) and.push({ propertyType: { equals: propertyType } })
  if (city) and.push({ 'address.city': { like: city } })
  if (minPrice != null) and.push({ price: { greater_than_equal: minPrice } })
  if (maxPrice != null) and.push({ price: { less_than_equal: maxPrice } })
  if (minBeds != null) and.push({ bedrooms: { greater_than_equal: minBeds } })
  if (minBaths != null) and.push({ bathrooms: { greater_than_equal: minBaths } })

  const result = await payload.find({
    collection: 'properties',
    where: { and },
    sort,
    limit: PER_PAGE,
    page,
    depth: 1,
  })

  const { docs, totalDocs, totalPages, page: currentPage = 1 } = result
  const from = totalDocs === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1
  const to = Math.min(currentPage * PER_PAGE, totalDocs)
  const resultsText = `Showing ${from}–${to} of ${totalDocs} results`

  return (
    <>
      {/* Page header */}
      <section className={`${CONTAINER} pb-2 pt-10`}>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Properties' }]} />
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[48px]">
          All Properties
        </h1>
      </section>

      <section className={`${CONTAINER} py-10`}>
        <ListingToolbar resultsText={resultsText} />

        {docs.length === 0 ? (
          <div className="mt-16 rounded-[24px] border border-dashed border-line py-20 text-center">
            <p className="text-lg font-medium text-foreground">No properties match your filters.</p>
            <p className="mt-2 text-sm text-subtle">Try adjusting or clearing the filters above.</p>
          </div>
        ) : view === 'list' ? (
          <div className="mt-10 flex flex-col gap-8">
            {docs.map((p) => (
              <PropertyListItem key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
            {docs.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}

        <ListingPagination currentPage={currentPage} totalPages={totalPages} />
      </section>
    </>
  )
}
