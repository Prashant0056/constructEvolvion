import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  access: {
    read: () => true,
    update: adminOnly,
  },
  admin: { group: 'Pages' },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
        { name: 'heading', type: 'text', defaultValue: 'About Us' },
      ],
    },
    {
      name: 'missionSection',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'We Are on A Mission to Change View of Real Estate Field',
        },
        { name: 'body', type: 'richText' },
        {
          name: 'stats',
          type: 'array',
          fields: [
            { name: 'value', type: 'text' },
            { name: 'label', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'storySection',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'body', type: 'richText' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'valuesSection',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        {
          name: 'values',
          type: 'array',
          fields: [
            { name: 'title', type: 'text' },
            { name: 'description', type: 'textarea' },
            { name: 'icon', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
    {
      name: 'featuredAgents',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      filterOptions: { roles: { contains: 'agent' } },
      admin: { description: 'Agents shown on About Us page' },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
      ],
    },
  ],
}
