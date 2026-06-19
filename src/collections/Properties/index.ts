import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { adminOrAgent } from '@/access/adminOrAgent'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'

export const Properties: CollectionConfig = {
  slug: 'properties',
  access: {
    create: adminOrAgent,
    delete: adminOnly,
    read: adminOrPublishedStatus,
    update: adminOrAgent,
  },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'listingType', 'propertyType', 'price', 'status', 'agent'],
  },
  versions: {
    drafts: true,
  },
  timestamps: true,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Sold', value: 'sold' },
        { label: 'Rented', value: 'rented' },
      ],
      defaultValue: 'draft',
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Pin as the Featured Property spotlight on the home page',
      },
    },
    {
      name: 'listingType',
      type: 'select',
      options: [
        { label: 'For Sale', value: 'sale' },
        { label: 'For Rent', value: 'rent' },
      ],
      required: true,
      index: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      index: true,
      admin: {
        description: 'Price shown on detail page and featured spotlight only — not on listing cards',
      },
    },
    {
      name: 'currency',
      type: 'select',
      options: ['USD', 'EUR', 'GBP'],
      defaultValue: 'USD',
    },
    {
      name: 'propertyType',
      type: 'select',
      options: [
        { label: 'House', value: 'house' },
        { label: 'Apartment', value: 'apartment' },
        { label: 'Villa', value: 'villa' },
        { label: 'Studio', value: 'studio' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'Land', value: 'land' },
      ],
      index: true,
    },
    {
      type: 'row',
      fields: [
        { name: 'bedrooms', type: 'number', min: 0, index: true },
        { name: 'bathrooms', type: 'number', min: 0, index: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'area', type: 'number', min: 0, index: true },
        {
          name: 'areaUnit',
          type: 'select',
          options: ['sqft', 'sqm'],
          defaultValue: 'sqft',
        },
      ],
    },
    { name: 'yearBuilt', type: 'number' },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Primary image — rendered at 604×604 on listing cards' },
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'amenities',
      type: 'array',
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        { name: 'street', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'state', type: 'text' },
        { name: 'zip', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'USA' },
        {
          name: 'displayAddress',
          type: 'text',
          admin: {
            description:
              'Full formatted string shown on listing cards, e.g. "3891 Ranchview Dr. Richardson, California"',
          },
        },
      ],
    },
    {
      name: 'location',
      type: 'point',
      // [longitude, latitude] — used for map view proximity queries
    },
    {
      name: 'agent',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      filterOptions: { roles: { contains: 'agent' } },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
    },
    { name: 'videoUrl', type: 'text' },
    { name: 'virtualTourUrl', type: 'text' },
    slugField(),
  ],
}
