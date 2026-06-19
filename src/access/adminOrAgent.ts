import type { Access } from 'payload'

import { checkRole } from '@/access/utilities'

export const adminOrAgent: Access = ({ req: { user } }) => {
  if (user) return checkRole(['admin', 'agent'], user)

  return false
}
