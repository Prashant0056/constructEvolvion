import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Fragment } from 'react'

export function Breadcrumbs({
  items,
  light = false,
}: {
  items: { label: string; href?: string }[]
  light?: boolean
}) {
  const base = light ? 'text-white/70' : 'text-subtle'
  const current = light ? 'text-white' : 'text-foreground'

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <Fragment key={i}>
            {item.href && !isLast ? (
              <Link href={item.href} className={`${base} transition-colors hover:opacity-80`}>
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? current : base}>{item.label}</span>
            )}
            {!isLast && <ChevronRight className={`size-4 ${base}`} />}
          </Fragment>
        )
      })}
    </nav>
  )
}
