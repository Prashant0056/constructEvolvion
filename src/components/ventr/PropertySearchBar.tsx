'use client'

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

const propertyTypes = ['house', 'apartment', 'villa', 'studio', 'commercial', 'land']

export function PropertySearchBar({ locationPlaceholder = 'Location', buttonLabel = 'Search' }) {
  const router = useRouter()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const params = new URLSearchParams()
    const city = String(fd.get('city') || '').trim()
    const propertyType = String(fd.get('propertyType') || '')
    const listingType = String(fd.get('listingType') || '')
    if (city) params.set('city', city)
    if (propertyType) params.set('propertyType', propertyType)
    if (listingType) params.set('listingType', listingType)
    router.push(`/properties${params.toString() ? `?${params}` : ''}`)
  }

  const fieldCls = 'w-full bg-transparent text-sm text-foreground placeholder:text-faint focus:outline-none'

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-3xl flex-col gap-3 rounded-[24px] bg-background p-3 shadow-lg sm:flex-row sm:items-center sm:rounded-full sm:p-2 sm:pl-6"
    >
      <div className="flex-1 sm:border-r sm:border-line sm:pr-4">
        <label className="block text-xs font-medium text-subtle">Location</label>
        <input name="city" placeholder={locationPlaceholder} className={fieldCls} />
      </div>
      <div className="flex-1 sm:border-r sm:border-line sm:px-4">
        <label className="block text-xs font-medium text-subtle">Property Type</label>
        <select name="propertyType" defaultValue="" className={`${fieldCls} capitalize`}>
          <option value="">Any</option>
          {propertyTypes.map((t) => (
            <option key={t} value={t} className="capitalize">
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 sm:px-4">
        <label className="block text-xs font-medium text-subtle">Listing Type</label>
        <select name="listingType" defaultValue="" className={fieldCls}>
          <option value="">Buy or Rent</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>
      </div>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        <Search className="size-4" /> {buttonLabel}
      </button>
    </form>
  )
}
