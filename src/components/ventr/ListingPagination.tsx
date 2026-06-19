'use client'

import { cn } from '@/utilities/cn'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export function ListingPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const hrefFor = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page <= 1) params.delete('page')
    else params.set('page', String(page))
    return `${pathname}${params.toString() ? `?${params}` : ''}`
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
      {currentPage > 1 && (
        <Link
          href={hrefFor(currentPage - 1)}
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          <ArrowLeft className="size-4" /> Previous
        </Link>
      )}
      <div className="flex items-center gap-1.5">
        {pages.map((p) => (
          <Link
            key={p}
            href={hrefFor(p)}
            aria-current={p === currentPage ? 'page' : undefined}
            className={cn(
              'flex size-10 items-center justify-center rounded-full text-sm font-medium transition-colors',
              p === currentPage
                ? 'bg-foreground text-background'
                : 'border border-line text-foreground hover:bg-foreground hover:text-background',
            )}
          >
            {p}
          </Link>
        ))}
      </div>
      {currentPage < totalPages && (
        <Link
          href={hrefFor(currentPage + 1)}
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          Next <ArrowRight className="size-4" />
        </Link>
      )}
    </nav>
  )
}
