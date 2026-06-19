import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  access: {
    read: () => true,
    update: adminOnly,
  },
  admin: { group: 'Pages' },
  fields: [
    // ─── 1. Hero ───────────────────────────────────────────────────────
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'backgroundImage', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Select Best Residence That Aligns With Your Lifestyle',
        },
        {
          name: 'subHeading',
          type: 'textarea',
          defaultValue:
            'Embarking on the journey to find a new home is exciting. Selecting the right residence is crucial for a harmonious match with your unique lifestyle.',
        },
        {
          name: 'searchLocationPlaceholder',
          type: 'text',
          defaultValue: 'Location',
        },
        {
          name: 'searchButtonLabel',
          type: 'text',
          defaultValue: 'Search',
        },
      ],
    },

    // ─── 2. About Us ───────────────────────────────────────────────────
    {
      name: 'aboutSection',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'About Us' },
        {
          name: 'body',
          type: 'textarea',
          defaultValue:
            'Our company specialise in transacting all type of properties in united state and making sure our clients enjoy a smooth and straightforward process that is tailored to their needs.',
        },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Learn More' },
        { name: 'ctaHref', type: 'text', defaultValue: '/about' },
      ],
    },

    // ─── 3. Featured Property Spotlight ───────────────────────────────
    {
      name: 'featuredPropertySection',
      type: 'group',
      label: 'Featured Property Spotlight',
      fields: [
        {
          name: 'property',
          type: 'relationship',
          relationTo: 'properties',
          filterOptions: { featured: { equals: true } },
          admin: {
            description: 'Single highlighted property shown prominently on the home page',
          },
        },
      ],
    },

    // ─── 4. Benefits ───────────────────────────────────────────────────
    {
      name: 'benefitsSection',
      type: 'group',
      label: 'Benefits Section',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Benefits You Get When You Use Our Services',
        },
        { name: 'subText', type: 'textarea' },
        {
          name: 'benefits',
          type: 'array',
          maxRows: 4,
          fields: [
            { name: 'number', type: 'text', admin: { description: 'e.g. 01, 02, 03, 04' } },
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
            { name: 'icon', type: 'upload', relationTo: 'media' },
          ],
          defaultValue: [
            { number: '01', title: 'Best Platform', description: 'With lots of unique' },
            { number: '02', title: 'Comfort & Space', description: 'With lots of unique' },
            { number: '03', title: '24/7 Support', description: 'With lots of unique' },
            { number: '04', title: 'Best Market Price', description: 'With lots of unique' },
          ],
        },
        { name: 'viewAllLabel', type: 'text', defaultValue: 'All Services' },
        { name: 'viewAllHref', type: 'text', defaultValue: '/about' },
      ],
    },

    // ─── 5. Latest Properties (2×2 grid) ──────────────────────────────
    {
      name: 'latestPropertiesSection',
      type: 'group',
      label: 'Latest Properties Section',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Explore Our Latest Properties',
        },
        { name: 'subText', type: 'textarea' },
        {
          name: 'properties',
          type: 'relationship',
          relationTo: 'properties',
          hasMany: true,
          maxRows: 4,
          admin: { description: '2×2 grid — select exactly 4 properties' },
        },
        { name: 'viewAllLabel', type: 'text', defaultValue: 'All Properties' },
        { name: 'viewAllHref', type: 'text', defaultValue: '/properties' },
      ],
    },

    // ─── 6. Our Agents (3 cards) ───────────────────────────────────────
    {
      name: 'agentsSection',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Our Agents' },
        { name: 'subText', type: 'textarea' },
        {
          name: 'featuredAgents',
          type: 'relationship',
          relationTo: 'users',
          hasMany: true,
          maxRows: 3,
          filterOptions: { roles: { contains: 'agent' } },
          admin: { description: '3 agent cards displayed on home page' },
        },
        { name: 'viewAllLabel', type: 'text', defaultValue: 'All Agents' },
        { name: 'viewAllHref', type: 'text', defaultValue: '/agents' },
      ],
    },

    // ─── 7. Testimonials (carousel) ────────────────────────────────────
    {
      name: 'testimonialsSection',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: "What's Our Client's Says" },
        { name: 'subText', type: 'textarea' },
        {
          name: 'testimonials',
          type: 'array',
          fields: [
            { name: 'quote', type: 'textarea', required: true },
            { name: 'authorName', type: 'text', required: true },
            { name: 'authorTitle', type: 'text', admin: { description: 'e.g. Founder, Buyer' } },
            { name: 'authorAvatar', type: 'upload', relationTo: 'media' },
            { name: 'rating', type: 'number', min: 1, max: 5 },
          ],
        },
      ],
    },

    // ─── 8. FAQ Accordion ──────────────────────────────────────────────
    {
      name: 'faqSection',
      type: 'group',
      label: 'FAQ Section',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Frequently Ask Questions' },
        { name: 'subText', type: 'textarea' },
        {
          name: 'faqs',
          type: 'array',
          fields: [
            { name: 'question', type: 'text', required: true },
            { name: 'answer', type: 'richText', required: true },
          ],
        },
        { name: 'viewAllLabel', type: 'text', defaultValue: 'All FAQs' },
        { name: 'viewAllHref', type: 'text', defaultValue: '/faq' },
      ],
    },

    // ─── SEO ───────────────────────────────────────────────────────────
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text', defaultValue: 'Ventr - Find Your Dream Home' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
