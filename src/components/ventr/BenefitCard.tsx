export function BenefitCard({
  number,
  title,
  description,
}: {
  number?: string | null
  title?: string | null
  description?: string | null
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-line p-7 transition-colors hover:border-foreground">
      {number && (
        <span className="text-4xl font-semibold tracking-[-0.02em] text-faint">{number}</span>
      )}
      {title && (
        <h3 className="text-xl font-semibold tracking-[-0.01em] text-foreground">{title}</h3>
      )}
      {description && <p className="text-sm text-subtle">{description}</p>}
    </div>
  )
}
