'use client'

import { cn } from '@/utilities/cn'
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const sortOptions = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'price', label: 'Price (Low–High)' },
  { value: '-price', label: 'Price (High–Low)' },
  { value: '-bedrooms', label: 'Most Bedrooms' },
]

const propertyTypes = ['house', 'apartment', 'villa', 'studio', 'commercial', 'land']

export function ListingToolbar({ resultsText }: { resultsText: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const view = searchParams.get('view') === 'list' ? 'list' : 'grid'

  const commit = (updates: Record<string, string | null>, { resetPage = true } = {}) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === '') params.delete(k)
      else params.set(k, v)
    }
    if (resetPage) params.delete('page')
    router.push(`${pathname}${params.toString() ? `?${params}` : ''}`)
  }

  const onApplyFilters = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    commit({
      listingType: String(fd.get('listingType') || ''),
      propertyType: String(fd.get('propertyType') || ''),
      minPrice: String(fd.get('minPrice') || ''),
      maxPrice: String(fd.get('maxPrice') || ''),
      minBeds: String(fd.get('minBeds') || ''),
      minBaths: String(fd.get('minBaths') || ''),
      city: String(fd.get('city') || '').trim(),
    })
    setShowFilters(false)
  }

  const inputCls =
    'w-full rounded-[12px] border border-line bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-faint focus:border-foreground focus:outline-none'

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-line p-1">
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => commit({ view: null }, { resetPage: false })}
              className={cn(
                'flex size-9 items-center justify-center rounded-full transition-colors',
                view === 'grid' ? 'bg-foreground text-background' : 'text-subtle',
              )}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              aria-label="List view"
              onClick={() => commit({ view: 'list' }, { resetPage: false })}
              className={cn(
                'flex size-9 items-center justify-center rounded-full transition-colors',
                view === 'list' ? 'bg-foreground text-background' : 'text-subtle',
              )}
            >
              <List className="size-4" />
            </button>
          </div>
          <p className="text-sm text-subtle">{resultsText}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            <SlidersHorizontal className="size-4" /> Filter
          </button>
          <select
            aria-label="Sort by"
            defaultValue={searchParams.get('sort') || '-createdAt'}
            onChange={(e) => commit({ sort: e.target.value })}
            className="rounded-full border border-line bg-background px-5 py-2.5 text-sm font-medium text-foreground focus:outline-none"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                Sort: {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showFilters && (
        <form
          onSubmit={onApplyFilters}
          className="grid grid-cols-1 gap-4 rounded-[24px] border border-line p-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <label className="flex flex-col gap-1.5 text-xs font-medium text-subtle">
            Listing Type
            <select name="listingType" defaultValue={searchParams.get('listingType') || ''} className={inputCls}>
              <option value="">Any</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-medium text-subtle">
            Property Type
            <select name="propertyType" defaultValue={searchParams.get('propertyType') || ''} className={`${inputCls} capitalize`}>
              <option value="">Any</option>
              {propertyTypes.map((t) => (
                <option key={t} value={t} className="capitalize">
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-medium text-subtle">
            City
            <input name="city" defaultValue={searchParams.get('city') || ''} placeholder="Any city" className={inputCls} />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-medium text-subtle">
            Min Price
            <input name="minPrice" type="number" min={0} defaultValue={searchParams.get('minPrice') || ''} placeholder="0" className={inputCls} />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-medium text-subtle">
            Max Price
            <input name="maxPrice" type="number" min={0} defaultValue={searchParams.get('maxPrice') || ''} placeholder="Any" className={inputCls} />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5 text-xs font-medium text-subtle">
              Min Beds
              <select name="minBeds" defaultValue={searchParams.get('minBeds') || ''} className={inputCls}>
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}+</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-medium text-subtle">
              Min Baths
              <select name="minBaths" defaultValue={searchParams.get('minBaths') || ''} className={inputCls}>
                <option value="">Any</option>
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n}+</option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex items-end gap-3 sm:col-span-2 lg:col-span-3">
            <button type="submit" className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background">
              Apply Filters
            </button>
            <button
              type="button"
              onClick={() => commit({ listingType: null, propertyType: null, minPrice: null, maxPrice: null, minBeds: null, minBaths: null, city: null })}
              className="rounded-full border border-line px-6 py-2.5 text-sm font-medium text-foreground"
            >
              Clear
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
