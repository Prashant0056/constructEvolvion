import { cn } from '@/utilities/cn'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function SectionHeading({
  heading,
  subText,
  viewAllLabel,
  viewAllHref,
  align = 'left',
  className,
}: {
  heading?: string | null
  subText?: string | null
  viewAllLabel?: string | null
  viewAllHref?: string | null
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'md:flex-col md:items-center md:text-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {heading && (
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[48px] md:leading-[1.15]">
            {heading}
          </h2>
        )}
        {subText && <p className="mt-4 text-base text-subtle md:text-lg">{subText}</p>}
      </div>
      {viewAllLabel && viewAllHref && (
        <Link
          href={viewAllHref}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          {viewAllLabel} <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  )
}
