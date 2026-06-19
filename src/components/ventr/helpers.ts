import type { Media, Property, User } from '@/payload-types'

/** Narrow a populated upload/relationship value to its object form, else undefined. */
export const asMedia = (v: unknown): Media | undefined =>
  v && typeof v === 'object' ? (v as Media) : undefined

export const asProperty = (v: unknown): Property | undefined =>
  v && typeof v === 'object' ? (v as Property) : undefined

export const asUser = (v: unknown): User | undefined =>
  v && typeof v === 'object' ? (v as User) : undefined

export const formatPrice = (price?: number | null, currency?: string | null): string => {
  if (price == null) return ''
  const code = currency || 'USD'
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 0,
    }).format(price)
  } catch {
    return `$${price.toLocaleString()}`
  }
}

export const formatArea = (area?: number | null, unit?: string | null): string =>
  area == null ? '' : `${area.toLocaleString()} ${unit || 'sqft'}`
