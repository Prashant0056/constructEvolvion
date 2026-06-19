import type { Access } from 'payload'

import { checkRole } from '@/access/utilities'

/**
 * Users read access for a site that exposes public agent profiles.
 *
 * - Admins can read every user.
 * - Anyone (including anonymous visitors) can read users with the `agent`
 *   role — this powers the public Our Agents page (`/agents`).
 * - Logged-in non-admins can additionally read their own record.
 *
 * The `roles` field keeps its own admin-only field access, so the role
 * list is never exposed to the public even when an agent row is readable.
 */
export const adminSelfOrPublicAgent: Access = ({ req: { user } }) => {
  if (user && checkRole(['admin'], user)) {
    return true
  }

  if (user) {
    return {
      or: [{ roles: { in: ['agent'] } }, { id: { equals: user.id } }],
    }
  }

  return {
    roles: { in: ['agent'] },
  }
}
