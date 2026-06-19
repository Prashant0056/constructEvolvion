import type { User } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/cn'

import { asMedia } from './helpers'

export function AgentCard({ agent, className }: { agent: User; className?: string }) {
  const photo = asMedia(agent.avatar)

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="relative aspect-square w-full overflow-hidden rounded-[32px] bg-line">
        {photo && <Media resource={photo} fill imgClassName="object-cover" />}
      </div>
      <h3 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-foreground">
        {agent.name}
      </h3>
      <p className="mt-1 text-base text-subtle opacity-80">{agent.title || 'Real Estate Agent'}</p>
    </div>
  )
}
