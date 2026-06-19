import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { publicAccess } from '@/access/publicAccess'
import { adminOrSelf } from '@/access/adminOrSelf'
import { checkRole } from '@/access/utilities'

import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req: { user } }) => checkRole(['admin'], user),
    create: publicAccess,
    delete: adminOnly,
    read: adminOrSelf,
    unlock: adminOnly,
    update: adminOrSelf,
  },
  admin: {
    group: 'Users',
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
  },
  auth: {
    tokenExpiration: 1209600,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      defaultValue: ['customer'],
      hasMany: true,
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'agent',
          value: 'agent',
        },
        {
          label: 'customer',
          value: 'customer',
        },
      ],
    },
    // ─── Agent profile (real-estate) ──────────────────────────────────
    // Visible only for users with the `agent` role. Powers the agent
    // cards on the Home and About pages and the Our Agents grid.
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Real Estate Agent',
      admin: {
        condition: (data) => Boolean(data?.roles?.includes('agent')),
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => Boolean(data?.roles?.includes('agent')),
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        condition: (data) => Boolean(data?.roles?.includes('agent')),
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        condition: (data) => Boolean(data?.roles?.includes('agent')),
      },
    },
    {
      type: 'row',
      admin: {
        condition: (data) => Boolean(data?.roles?.includes('agent')),
      },
      fields: [
        { name: 'rating', type: 'number', min: 0, max: 5 },
        { name: 'reviewCount', type: 'number', min: 0 },
      ],
    },
    {
      type: 'row',
      admin: {
        condition: (data) => Boolean(data?.roles?.includes('agent')),
      },
      fields: [
        { name: 'totalSales', type: 'number', min: 0 },
        { name: 'totalListings', type: 'number', min: 0 },
      ],
    },
    {
      name: 'specializations',
      type: 'array',
      admin: {
        condition: (data) => Boolean(data?.roles?.includes('agent')),
      },
      fields: [{ name: 'label', type: 'text' }],
    },
    {
      name: 'languages',
      type: 'array',
      admin: {
        condition: (data) => Boolean(data?.roles?.includes('agent')),
      },
      fields: [{ name: 'language', type: 'text' }],
    },
    {
      name: 'socialLinks',
      type: 'group',
      admin: {
        condition: (data) => Boolean(data?.roles?.includes('agent')),
      },
      fields: [
        { name: 'linkedin', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'twitter', type: 'text' },
      ],
    },
    {
      name: 'featuredOnHomepage',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        condition: (data) => Boolean(data?.roles?.includes('agent')),
      },
    },
    {
      name: 'orders',
      type: 'join',
      collection: 'orders',
      on: 'customer',
      admin: {
        allowCreate: false,
        defaultColumns: ['id', 'createdAt', 'total', 'currency', 'items'],
      },
    },
    {
      name: 'cart',
      type: 'join',
      collection: 'carts',
      on: 'customer',
      admin: {
        allowCreate: false,
        defaultColumns: ['id', 'createdAt', 'total', 'currency', 'items'],
      },
    },
    {
      name: 'addresses',
      type: 'join',
      collection: 'addresses',
      on: 'customer',
      admin: {
        allowCreate: false,
        defaultColumns: ['id'],
      },
    },
  ],
}
