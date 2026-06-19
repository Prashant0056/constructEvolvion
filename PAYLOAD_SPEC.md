# Ventr Real Estate Website — Payload CMS Specification

> Generated from: Ventr - Real Estate Website UI Kit (Figma file `JjqHL4OlmwFQOZDwIuHOGW`)
> Covers all 19 pages/screens across desktop, dark, and mobile variants.

---

## Table of Contents

1. [Design System Overview](#design-system-overview)
2. [Collections](#collections)
   - [Users](#1-users)
   - [Media](#2-media)
   - [Properties](#3-properties)
   - [Agents](#4-agents)
   - [BlogPosts](#5-blogposts)
   - [BlogCategories](#6-blogcategories)
   - [BlogComments](#7-blogcomments)
   - [ContactSubmissions](#8-contactsubmissions)
3. [Globals](#globals)
   - [Header](#1-header-global)
   - [Footer](#2-footer-global)
   - [SiteSettings](#3-sitesettings-global)
   - [HomePage](#4-homepage-global)
   - [AboutPage](#5-aboutpage-global)
   - [PrivacyPolicy](#6-privacypolicy-global)
   - [TermsConditions](#7-termsconditions-global)
4. [Reusable Blocks](#reusable-blocks)
5. [Access Control](#access-control)
6. [Hooks](#hooks)
7. [Page Routes Summary](#page-routes-summary)

---

## Design System Overview

| Token | Value |
|-------|-------|
| **Brand color** | `#0d0a04` (dark), `#ffffff` (white) |
| **Gray/500** | `#a1a1a1` |
| **Gray/700** | `#7b7b7b` |
| **Gray/200** | `#dfdfdf` |
| **Light/900** | `#3a3b3f` (dark-mode border) |
| **Font — headings** | Plus Jakarta Sans (SemiBold) |
| **Font — body** | Plus Jakarta Sans (Regular) |
| **Heading XL** | 72px, weight 600, leading 1.2, tracking -1.44px |
| **Heading LG** | 48px, weight 600, leading 1.26, tracking -0.96px |
| **Heading MD** | 36px, weight 600, leading 1.29, tracking -0.72px |
| **Heading SM** | 30px, weight 600, leading 1.5 |
| **Heading XS** | 24px, weight 600, leading 1.32, tracking -0.48px |
| **Body MD** | 16px, weight 400, leading 1.5 |
| **Body SM** | 14px, weight 400, leading 1.4, tracking -0.28px |
| **Border radius XL3** | 32px |
| **Border radius XL2** | 24px |
| **Border radius XL** | 16px |
| **Border radius Full** | 999px |

All pages exist in three variants: **Light**, **Dark**, and **Mobile**.

---

## Collections

---

### 1. Users

**Slug:** `users`  
**Purpose:** Admin panel users, agents, and authenticated site members.  
**Auth:** Payload built-in authentication.

#### Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `text` | required, `useAsTitle` |
| `email` | `email` | built-in auth field |
| `password` | `password` | built-in auth field |
| `role` | `select` | `admin` \| `agent` \| `member`, default `member`, `saveToJWT: true` |
| `phone` | `text` | phone number |
| `avatar` | `upload` | relationTo `media` |
| `bio` | `textarea` | agent bio (visible on agent profile) |

#### Config

```ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Agent', value: 'agent' },
        { label: 'Member', value: 'member' },
      ],
      defaultValue: 'member',
      saveToJWT: true,
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        condition: (data) => data.role === 'agent',
      },
    },
  ],
}
```

#### Auth Config (payload.config.ts)

```ts
// Social sign-in shown in design (Google, Apple)
// Wire up via oauth plugin or custom endpoints
```

---

### 2. Media

**Slug:** `media`  
**Purpose:** All images used across properties, agents, blog posts, hero sections.

#### Config

```ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 604, height: 604, position: 'centre' },
      { name: 'hero', width: 1440, height: 650, position: 'centre' },
      { name: 'agent', width: 392, height: 392, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
```

---

### 3. Properties

**Slug:** `properties`  
**Purpose:** Real estate listings. Displayed on Property Listing pages (Grid / List / Filter views) and Property Detail page.

#### Pages that use this collection
- **07 Property Listing – Grid** (node `844:8443`) — verified ✓
- **08 Property Listing – List** (node `846:10781`) — same data, horizontal layout
- **09 Property Listing – Filter** (node `847:12914`) — sidebar filter panel open
- **Property Detail** — full property with gallery, amenities, map, agent contact

#### Property Listing Page — Layout (verified from node 844:8443)

```
[Header — 1440×96]
[Breadcrumbs — Home > Properties — 1440×52]
[All Properties section — y=148, 1440×2500]
  [Header row — 1240×48]
    LEFT:  [Grid icon btn] [List icon]  "Showing 1–10 of 60 results"
    RIGHT: [Filter btn]  [Sort By btn]
  [Grid — 3 rows × 2 cols, 604×716 per card, 32px gutter]
    Row 1: card 1, card 2
    Row 2: card 3, card 4
    Row 3: card 5, card 6
  [Pagination — centered, 502×48]
    [← Previous]  [1] [2] [3]  [Next →]
[Footer]
```

**Pagination:** 10 items per page ("Showing 1–10 of 60 results"), page buttons + Prev/Next arrows.

**Sort options (Sort By dropdown):** Newest, Price (Low–High), Price (High–Low), Most Bedrooms.

#### Property Card (Grid view) — verified fields (604×716)

```
┌─────────────────────────────┐
│  Hero Image (604×604)       │  ← rounded-rectangle, object-cover
│  border-radius: xl (16px)   │
├─────────────────────────────┤  ← card footer 96px tall
│ Title (32px, semibold)      │  [View btn →]
│ 📍 Display Address (24px)   │
│ 🛏 N bedrooms  🚿 N baths  ⬜ N Sqft │
└─────────────────────────────┘
```

> **Important:** Price is NOT shown on listing cards. It appears only on the Featured Property Spotlight (home page) and on the Property Detail page.

**6 sample properties visible in design:**
| # | Title | Beds | Baths | Area |
|---|-------|------|-------|------|
| 1 | Cascading Waters Villa of Serenity | 5 | 6 | 5320 sqft |
| 2 | Starlit Cove Private Villa Retreat | 6 | 8 | 6740 sqft |
| 3 | Villa of Whispering Winds and Waves | 7 | — | 7910 sqft |
| 4 | Blissful Breeze at Seaside Villa | 4 | — | 4780 sqft |
| 5 | Golden Sands Haven by the Bay | — | 5 | 4800 sqft |
| 6 | Enchanted Garden View Villa Retreat | 5 | — | 5500 sqft |

#### Fields

| Field | Type | Notes | Card? |
|-------|------|-------|-------|
| `title` | `text` | required, `useAsTitle` | ✓ |
| `slug` | `text` | unique, index, auto-generated | — |
| `status` | `select` | `draft` \| `published` \| `sold` \| `rented` | — |
| `listingType` | `select` | `sale` \| `rent`, required, **indexed** | filter |
| `price` | `number` | required, **indexed** | detail only |
| `currency` | `select` | `USD` \| `EUR` \| `GBP`, default `USD` | detail only |
| `propertyType` | `select` | `house` \| `apartment` \| `villa` \| `studio` \| `commercial` \| `land`, **indexed** | filter |
| `bedrooms` | `number` | integer, **indexed** | ✓ |
| `bathrooms` | `number` | integer, **indexed** | ✓ |
| `area` | `number` | sqft/m², **indexed** | ✓ |
| `areaUnit` | `select` | `sqft` \| `sqm`, default `sqft` | ✓ |
| `yearBuilt` | `number` | 4-digit year | detail only |
| `featured` | `checkbox` | pins to home page spotlight | — |
| `heroImage` | `upload` | relationTo `media`, required | ✓ (604×604) |
| `gallery` | `array` | `{ image, caption }` | detail only |
| `description` | `richText` | full property description | detail only |
| `amenities` | `array` | `{ label }` — pool, gym, parking… | detail only |
| `address` | `group` | street, city, state, zip, country, displayAddress | ✓ (displayAddress) |
| `location` | `point` | `[longitude, latitude]` for map queries | map view |
| `agent` | `relationship` | relationTo `users` (role=agent), required | detail only |
| `tags` | `array` | `{ tag }` — for search | filter |
| `videoUrl` | `text` | YouTube/Vimeo embed | detail only |
| `virtualTourUrl` | `text` | Matterport or similar | detail only |
| `createdAt` | `date` | auto (timestamps) | sort |
| `updatedAt` | `date` | auto (timestamps) | — |

**Address sub-fields (group):**

| Field | Type | Notes |
|-------|------|-------|
| `street` | `text` | e.g. "3891 Ranchview Dr." |
| `city` | `text` | e.g. "Richardson" |
| `state` | `text` | e.g. "California" |
| `zip` | `text` | |
| `country` | `text` | default `"USA"` |
| `displayAddress` | `text` | full formatted string shown on card, e.g. "3891 Ranchview Dr. Richardson, California" |

#### Config

```ts
import type { CollectionConfig } from 'payload'

export const Properties: CollectionConfig = {
  slug: 'properties',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'listingType', 'propertyType', 'price', 'status', 'agent'],
    livePreview: {
      url: ({ data }) => `${process.env.NEXT_PUBLIC_SITE_URL}/properties/${data.slug}`,
    },
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
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
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
      admin: { description: 'Price shown on detail page and featured spotlight only — not on listing cards' },
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
          admin: { description: 'Full formatted string shown on listing cards, e.g. "3891 Ranchview Dr. Richardson, California"' },
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
      filterOptions: { role: { equals: 'agent' } },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
    },
    { name: 'videoUrl', type: 'text' },
    { name: 'virtualTourUrl', type: 'text' },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' && !data.slug) {
          data.slug = data.title
            ?.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '')
        }
        return data
      },
    ],
  },
}
```

#### Frontend Query — Property Listing Page

```ts
// app/(frontend)/properties/page.tsx
const { docs, totalDocs, totalPages } = await payload.find({
  collection: 'properties',
  where: {
    status: { equals: 'published' },
    // applied from URL search params:
    ...(listingType && { listingType: { equals: listingType } }),
    ...(propertyType && { propertyType: { equals: propertyType } }),
    ...(minBedrooms && { bedrooms: { greater_than_equal: Number(minBedrooms) } }),
    ...(minBathrooms && { bathrooms: { greater_than_equal: Number(minBathrooms) } }),
    ...(minPrice && { price: { greater_than_equal: Number(minPrice) } }),
    ...(maxPrice && { price: { less_than_equal: Number(maxPrice) } }),
  },
  sort: sortParam ?? '-createdAt',  // Newest | price | -price | -bedrooms
  limit: 10,                         // "Showing 1–10 of 60 results"
  page: Number(page ?? 1),
  depth: 1,
  select: {
    // Only fetch fields needed for listing cards
    title: true,
    slug: true,
    heroImage: true,
    bedrooms: true,
    bathrooms: true,
    area: true,
    areaUnit: true,
    'address.displayAddress': true,
    listingType: true,
    status: true,
  },
})
```

#### Filter Panel Fields (from Page 09, node 847:12914)

The filter sidebar exposes these filterable dimensions:
- **Price range** — min/max number inputs → `price: { greater_than_equal, less_than_equal }`
- **Property type** — select (house, apartment, villa…) → `propertyType: { equals }`
- **Listing type** — For Sale / For Rent → `listingType: { equals }`
- **Bedrooms** — 1+, 2+, 3+, 4+ → `bedrooms: { greater_than_equal }`
- **Bathrooms** — 1+, 2+, 3+ → `bathrooms: { greater_than_equal }`
- **Area** — min/max sqft → `area: { greater_than_equal, less_than_equal }`
- **Location / City** — text → `address.city: { like }`

Map view requires the `location` `point` field with Payload's `near` operator.

---

### 4. Agents

**Slug:** `agents`  
**Purpose:** Public-facing agent profiles for the **Our Agents** page (node `849:20536`). Built from users with `role: 'agent'` plus supplementary profile data.

> **Note:** Instead of a separate `agents` collection you can extend `Users` with agent-specific fields. A separate collection is recommended only if agents need richer profiles beyond what users need for auth.

**Design shows:** 3-column grid, 2 rows = 6 agents visible per view. Each card shows: square (392×392) rounded photo, name (24px semibold), title/role (16px gray).

#### Option A — Use Users collection (recommended)

Filter users by `role: 'agent'` on the frontend. Add the fields below to `Users`:

| Field | Type | Notes |
|-------|------|-------|
| `title` | `text` | "Real Estate Agent", "Senior Agent", etc. |
| `specializations` | `array` | `{ label: text }` |
| `languages` | `array` | `{ language: text }` |
| `totalSales` | `number` | stats |
| `totalListings` | `number` | stats |
| `rating` | `number` | e.g. 4.8 |
| `reviewCount` | `number` | |
| `socialLinks` | `group` | `{ linkedin, facebook, instagram, twitter }` |
| `featuredOnHomepage` | `checkbox` | |

#### Option B — Separate Agents Collection

```ts
export const Agents: CollectionConfig = {
  slug: 'agents',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'rating'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'title', type: 'text', defaultValue: 'Real Estate Agent' },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    { name: 'bio', type: 'textarea' },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'rating', type: 'number', min: 0, max: 5 },
    { name: 'reviewCount', type: 'number' },
    {
      name: 'specializations',
      type: 'array',
      fields: [{ name: 'label', type: 'text' }],
    },
    {
      name: 'languages',
      type: 'array',
      fields: [{ name: 'language', type: 'text' }],
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'linkedin', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'instagram', type: 'text' },
      ],
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      unique: true,
    },
  ],
}
```

---

### 5. BlogPosts

**Slug:** `posts`  
**Purpose:** Blog articles. Used on **Blog listing page** (node `851:21975`) and **Blog Details page** (node `852:23020`).

#### Blog Listing Page (Page 13) sections
- Hero section with hero image, "Blog" heading, breadcrumbs
- All Blogs grid: 3 rows × 2 columns = 6 posts per page
- Each card: full image (604×604), title, excerpt, "Read More" button + arrow
- Pagination

#### Blog Details Page (Page 14) sections
- Breadcrumbs: Home > Blog > Post Title
- Hero banner image (1240×500)
- **Main column** (784px wide):
  - Post title (H2)
  - Body text (multi-paragraph richText)
  - Blockquote section
  - Additional body text
  - Comments section (count, list of comments with avatar/name/date/text)
  - Leave a Reply form (Name, Email inputs + Message textarea + Submit)
- **Sidebar** (392px wide):
  - Search input
  - Latest Posts (thumbnail + title + date, 3 posts)
  - Categories list (6 categories with counts)

#### Fields

| Field | Type | Notes |
|-------|------|-------|
| `title` | `text` | required, `useAsTitle` |
| `slug` | `text` | unique, index, auto-generated |
| `status` | `select` | `draft` \| `published` |
| `publishedAt` | `date` | |
| `heroImage` | `upload` | relationTo `media`, required |
| `excerpt` | `textarea` | short description for listing cards |
| `content` | `richText` | full article body |
| `categories` | `relationship` | relationTo `blog-categories`, hasMany |
| `author` | `relationship` | relationTo `users` |
| `readTime` | `number` | minutes, auto-computed |
| `featured` | `checkbox` | pin to top of listing |
| `seo` | `group` | `{ metaTitle, metaDescription, ogImage }` |

#### Config

```ts
export const BlogPosts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'categories', 'publishedAt'],
    livePreview: {
      url: ({ data }) => `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${data.slug}`,
    },
  },
  versions: {
    drafts: true,
  },
  timestamps: true,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, index: true, admin: { position: 'sidebar' } },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'published'],
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
    },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    { name: 'excerpt', type: 'textarea', maxLength: 300 },
    { name: 'content', type: 'richText' },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'blog-categories',
      hasMany: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
    },
    { name: 'readTime', type: 'number', admin: { readOnly: true } },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea', maxLength: 160 },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' && !data.slug) {
          data.slug = data.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
        }
        if (data.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
}
```

**Known blog titles from the design:**
- "Building Gains Into Housing Stocks and How to Trade The Sector"
- "92% of Millennial Homebuyers Say Inflation Has Impacted Their Plans"
- "The Art of Staging: How to Sell Your Home Quickly at a High Price."
- "Key Real Estate Trends to Watch in 2024"
- "Expert Tips for Profitable Real Estate Investments."
- "10 Things Your Competitors Can Teach You About Real Estate"

---

### 6. BlogCategories

**Slug:** `blog-categories`  
**Purpose:** Categories for filtering blog posts. Sidebar shows 6 categories.

**Known categories from design:**
- Investment Insights
- Modern Bungalows
- Real Estate
- Properties
- Legal Guidance
- Community Spotlight

#### Config

```ts
export const BlogCategories: CollectionConfig = {
  slug: 'blog-categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, index: true },
    { name: 'description', type: 'textarea' },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (!data.slug) {
          data.slug = data.name?.toLowerCase().replace(/\s+/g, '-')
        }
        return data
      },
    ],
  },
}
```

---

### 7. BlogComments

**Slug:** `blog-comments`  
**Purpose:** Reader comments on blog posts. Page 14 (Blog Details) shows a comment thread with author avatar, name, date, and text. Includes a "Leave a Reply" form.

**Design shows:** 2 comments visible (Robert Fox, Willions John), each with avatar ellipse, name, date, body text.

#### Fields

| Field | Type | Notes |
|-------|------|-------|
| `post` | `relationship` | relationTo `posts`, required |
| `authorName` | `text` | required |
| `authorEmail` | `email` | required, not displayed publicly |
| `authorAvatar` | `upload` | relationTo `media` |
| `body` | `textarea` | required |
| `approved` | `checkbox` | moderation gate, default `false` |
| `publishedAt` | `date` | auto on approve |

#### Config

```ts
export const BlogComments: CollectionConfig = {
  slug: 'blog-comments',
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'post', 'approved', 'createdAt'],
  },
  timestamps: true,
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
    },
    { name: 'authorName', type: 'text', required: true },
    { name: 'authorEmail', type: 'email', required: true },
    { name: 'authorAvatar', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'textarea', required: true },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    { name: 'publishedAt', type: 'date', admin: { readOnly: true } },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (data.approved && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
  access: {
    // Anyone can create a comment (submit form)
    create: () => true,
    // Only approved comments are publicly readable
    read: ({ req }) => {
      const user = req.user
      if (user?.role === 'admin') return true
      return { approved: { equals: true } }
    },
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
}
```

---

### 8. ContactSubmissions

**Slug:** `contact-submissions`  
**Purpose:** Stores messages submitted via the Contact Us form (Page 15, node `854:24397`) and the Footer contact form on most pages.

**Design form fields visible:**
- Name
- Email Address
- Mobile Number
- Message (textarea)

Also from footer: **Rating/Reviews section** (4.8 / 12K Reviews, 3 avatar thumbnails) — this is display-only, not a form field.

#### Config

```ts
export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'createdAt', 'status'],
  },
  timestamps: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'source',
      type: 'select',
      options: ['contact-page', 'footer', 'property-detail', 'agent-profile'],
      defaultValue: 'contact-page',
    },
    {
      name: 'relatedProperty',
      type: 'relationship',
      relationTo: 'properties',
      admin: {
        condition: (data) => data.source === 'property-detail',
      },
    },
    {
      name: 'relatedAgent',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        condition: (data) => data.source === 'agent-profile',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: ['new', 'in-progress', 'resolved'],
      defaultValue: 'new',
      admin: { position: 'sidebar' },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Internal notes (not visible to submitter)' },
    },
  ],
  access: {
    create: () => true,
    read: ({ req }) => !!req.user,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
}
```

---

## Globals

---

### 1. Header Global

**Slug:** `header`  
**Purpose:** Site navigation. Visible on all public pages. Design (node `815:11455`) shows:
- Logo (VENTR wordmark)
- Nav links: Home, About Us, Properties, Agents, Blog, Contact Us
- CTA button: "Login" (outlined pill) + user icon button (rounded)

Mobile variant: Logo left, hamburger menu icon right.

```ts
import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: { group: 'Navigation' },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'logoText',
      type: 'text',
      defaultValue: 'VENTR',
    },
    {
      name: 'navLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
      defaultValue: [
        { label: 'Home', href: '/' },
        { label: 'About Us', href: '/about' },
        { label: 'Properties', href: '/properties' },
        { label: 'Agents', href: '/agents' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact Us', href: '/contact' },
      ],
    },
    {
      name: 'ctaButton',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Login' },
        { name: 'href', type: 'text', defaultValue: '/login' },
      ],
    },
  ],
}
```

---

### 2. Footer Global

**Slug:** `footer`  
**Purpose:** Footer with contact-us CTA form section + links + social + copyright. Visible at the bottom of all public pages (node `831:5942`).

**Design sections:**
1. **Contact Us Form block** (dark bg #0d0a04):
   - Left: Heading "Still Not Sure Where to Start? Contact Us and Fill Out the Form"
   - Sub-text, rating (star + "4.8 (12K Reviews)"), 3 overlapping avatar thumbnails
   - Right: white card with Name, Email Address, Mobile Number, Message textarea, Send button
2. **Footer bar** (large VENTR wordmark watermark background image):
   - Navigation links: About Us, Properties, Agents, Blog, Contact Us
   - Social links: Facebook, Instagram, LinkedIn
   - Copyright: ©2024 VENTR. All Rights are reserved.
   - Legal links: Privacy Policy, Terms & Conditions

```ts
export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Navigation' },
  fields: [
    // Contact Us CTA Section
    {
      name: 'ctaSection',
      type: 'group',
      label: 'Contact CTA Section',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Still Not Sure Where to Start? Contact Us and Fill Out the Form',
        },
        { name: 'subText', type: 'text' },
        {
          name: 'ratingValue',
          type: 'text',
          defaultValue: '4.8',
        },
        { name: 'reviewCount', type: 'text', defaultValue: '12K Reviews' },
        {
          name: 'reviewerAvatars',
          type: 'array',
          maxRows: 5,
          fields: [{ name: 'avatar', type: 'upload', relationTo: 'media' }],
        },
      ],
    },
    // Footer Links
    {
      name: 'footerLinks',
      type: 'array',
      label: 'Navigation Links',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
      defaultValue: [
        { label: 'About Us', href: '/about' },
        { label: 'Properties', href: '/properties' },
        { label: 'Agents', href: '/agents' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact Us', href: '/contact' },
      ],
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'twitter', type: 'text' },
      ],
    },
    {
      name: 'legalLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
      defaultValue: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms & Conditions', href: '/terms' },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      defaultValue: '©2024 VENTR. All Rights are reserved.',
    },
    {
      name: 'footerBgImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Large background image with VENTR watermark' },
    },
  ],
}
```

---

### 3. SiteSettings Global

**Slug:** `site-settings`  
**Purpose:** Brand-level settings shared across all pages.

```ts
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings' },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'Ventr' },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Primary logo (light backgrounds)' },
    },
    {
      name: 'logoDark',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Logo for dark backgrounds' },
    },
    { name: 'favicon', type: 'upload', relationTo: 'media' },
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        { name: 'address', type: 'text', defaultValue: '2118 Thornridge Cir. Syracuse, Connecticut 35624' },
        { name: 'phone', type: 'text', defaultValue: '(671) 555-0110' },
        { name: 'email', type: 'email', defaultValue: 'ventr@demo.com' },
      ],
    },
    {
      name: 'defaultSeo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text', defaultValue: 'Ventr - Real Estate' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'colorMode',
      type: 'select',
      options: ['light', 'dark', 'system'],
      defaultValue: 'light',
      admin: { description: 'Default color mode for the site' },
    },
  ],
}
```

---

### 4. HomePage Global

**Slug:** `home-page`  
**Purpose:** Controls the content of the landing/home page. Verified against Figma node `833:4964` ("06 Home Page") — Light, Dark, and Mobile variants.

**Confirmed sections from design (in order):**

1. **Hero Section** (1440×900) — full-width background image, headline, sub-text, 3-field inline search bar (location / property type / listing type) + search button
2. **About Us Section** — left "About Us" label, right body paragraph, CTA button → `/about`
3. **Featured Property Spotlight** — single property card highlighted with image, name, address, beds/baths/sqft, price
4. **Benefits Section** ("Benefits You Get When You Use Our Services") — section heading, sub-text, 4 numbered benefit cards (01 Best Platform, 02 Comfort & Space, 03 24/7 Support, 04 Best Market Price), "All Services" link
5. **Latest Properties Section** ("Explore Our Latest Properties") — heading, sub-text, 2×2 grid of 4 property cards, "All Properties" button
6. **Our Agents Section** ("Our Agents") — heading, sub-text, 3 agent cards (Wade Warren, Jenny Wilson, Devon Lane), "All Agents" button
7. **Testimonials Section** ("What's Our Client's Says") — heading, sub-text, client quote card (name + title + quote), carousel arrows
8. **FAQ Section** ("Frequently Ask Questions") — heading, sub-text, 4 accordion items, "All FAQs" button
9. **Footer CTA + Footer** (controlled by Footer global)

**Search bar fields (3 inputs):**
- Input 1: Location (text/city)
- Input 2: Property Type (select: house, apartment, villa…)
- Input 3: Listing Type (For Sale / For Rent)

```ts
export const HomePage: GlobalConfig = {
  slug: 'home-page',
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
          admin: { description: 'Single highlighted property shown prominently on the home page' },
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
          filterOptions: { role: { equals: 'agent' } },
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
          defaultValue: [
            { question: 'How Does Our Platform Work?' },
            { question: 'Make a plan according to the concept' },
            { question: 'How Can I Find A Property To Buy or Sell' },
            { question: 'What Information is Included in Property Listings?' },
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
```

---

### 5. AboutPage Global

**Slug:** `about-page`  
**Purpose:** Controls the About Us page (node `849:19015`).

**Design sections from Page 11 (About Us):**
1. **Hero** — full-width hero image, "About Us" heading, Home > About Us breadcrumbs
2. **Mission section** — heading "We Are on A Mission to Change View of Real Estate Field", body text, key stats
3. **Team/values section** — image + body
4. **Agent grid** — subset of agents (same component as Our Agents page)
5. **Testimonials/reviews**
6. **Footer CTA + Footer**

```ts
export const AboutPage: GlobalConfig = {
  slug: 'about-page',
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
```

---

### 6. PrivacyPolicy Global

**Slug:** `privacy-policy`  
**Purpose:** Privacy Policy page (node `856:26564`).

**Design:** Hero with "Privacy Policy" heading, breadcrumbs (Home > Privacy Policy), then rich text content divided by section headings and body paragraphs.

```ts
export const PrivacyPolicy: GlobalConfig = {
  slug: 'privacy-policy',
  admin: { group: 'Legal' },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
        { name: 'heading', type: 'text', defaultValue: 'Privacy Policy' },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      admin: {
        description: 'Full privacy policy content with section headings',
      },
    },
    {
      name: 'lastUpdated',
      type: 'date',
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text', defaultValue: 'Privacy Policy - Ventr' },
        { name: 'metaDescription', type: 'textarea' },
      ],
    },
  ],
}
```

---

### 7. TermsConditions Global

**Slug:** `terms-conditions`  
**Purpose:** Terms & Conditions page (linked in footer and privacy policy). Same layout pattern as Privacy Policy.

```ts
export const TermsConditions: GlobalConfig = {
  slug: 'terms-conditions',
  admin: { group: 'Legal' },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
        { name: 'heading', type: 'text', defaultValue: 'Terms & Conditions' },
      ],
    },
    {
      name: 'content',
      type: 'richText',
    },
    { name: 'lastUpdated', type: 'date' },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text', defaultValue: 'Terms & Conditions - Ventr' },
        { name: 'metaDescription', type: 'textarea' },
      ],
    },
  ],
}
```

---

## Reusable Blocks

Blocks are used where flexible page content is needed (e.g., property detail extra sections, homepage sections).

```ts
// blocks/HeroBlock.ts
export const HeroBlock = {
  slug: 'hero',
  fields: [
    { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
    { name: 'heading', type: 'text' },
    { name: 'subText', type: 'textarea' },
    {
      name: 'breadcrumbs',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
  ],
}

// blocks/PropertyCardBlock.ts — used in listing grids
export const PropertyCardBlock = {
  slug: 'property-card',
  fields: [
    { name: 'property', type: 'relationship', relationTo: 'properties' },
  ],
}

// blocks/CTABlock.ts
export const CTABlock = {
  slug: 'cta',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'subText', type: 'text' },
    { name: 'buttonLabel', type: 'text' },
    { name: 'buttonHref', type: 'text' },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
  ],
}

// blocks/AgentCardBlock.ts
export const AgentCardBlock = {
  slug: 'agent-card',
  fields: [
    { name: 'agent', type: 'relationship', relationTo: 'users' },
  ],
}

// blocks/TestimonialBlock.ts
export const TestimonialBlock = {
  slug: 'testimonial',
  fields: [
    { name: 'quote', type: 'textarea' },
    { name: 'authorName', type: 'text' },
    { name: 'authorTitle', type: 'text' },
    { name: 'authorAvatar', type: 'upload', relationTo: 'media' },
    { name: 'rating', type: 'number', min: 1, max: 5 },
  ],
}

// blocks/RichTextBlock.ts
export const RichTextBlock = {
  slug: 'rich-text',
  fields: [
    { name: 'content', type: 'richText' },
  ],
}

// blocks/ContactFormBlock.ts — footer variant
export const ContactFormBlock = {
  slug: 'contact-form',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'subText', type: 'text' },
    { name: 'showRating', type: 'checkbox', defaultValue: true },
  ],
}
```

---

## Access Control

```ts
// access/index.ts

import type { Access } from 'payload'

// Public read, admin write
export const publicRead: Access = () => true

// Authenticated users only
export const authenticated: Access = ({ req }) => !!req.user

// Admin only
export const adminOnly: Access = ({ req }) => {
  return req.user?.role === 'admin'
}

// Admin or agent
export const adminOrAgent: Access = ({ req }) => {
  const role = req.user?.role
  return role === 'admin' || role === 'agent'
}

// Own records only (for users editing their own profile)
export const selfOrAdmin: Access = ({ req, id }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  return req.user.id === id
}

// Published content or admin
export const publishedOrAdmin: Access = ({ req }) => {
  if (req.user?.role === 'admin') return true
  return { status: { equals: 'published' } }
}
```

**Applied per collection:**

| Collection | create | read | update | delete |
|-----------|--------|------|--------|--------|
| `users` | `adminOnly` | `selfOrAdmin` | `selfOrAdmin` | `adminOnly` |
| `media` | `adminOrAgent` | `publicRead` | `adminOrAgent` | `adminOnly` |
| `properties` | `adminOrAgent` | `publishedOrAdmin` | `adminOrAgent` | `adminOnly` |
| `posts` | `adminOrAgent` | `publishedOrAdmin` | `adminOrAgent` | `adminOnly` |
| `blog-categories` | `adminOnly` | `publicRead` | `adminOnly` | `adminOnly` |
| `blog-comments` | `publicRead` (for form) | approved filter | `adminOnly` | `adminOnly` |
| `contact-submissions` | `publicRead` | `adminOnly` | `adminOnly` | `adminOnly` |

---

## Hooks

### Slug Auto-generation

```ts
// hooks/slugify.ts
export const slugifyHook = async ({ data, operation }: { data: any; operation: string }) => {
  if (operation === 'create' && !data.slug && data.title) {
    data.slug = data.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
  }
  return data
}
```

### Published Date Auto-set

```ts
export const publishedAtHook = async ({ data }: { data: any }) => {
  if (data._status === 'published' && !data.publishedAt) {
    data.publishedAt = new Date().toISOString()
  }
  return data
}
```

### Next.js ISR Revalidation

```ts
// hooks/revalidate.ts
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidatePropertiesHook = async ({ doc, operation, req }: any) => {
  if (req.context.revalidated) return
  req.context.revalidated = true

  if (operation === 'update' || operation === 'delete') {
    revalidatePath('/properties')
    revalidatePath(`/properties/${doc.slug}`)
    revalidateTag('properties')
  }
}

export const revalidatePostsHook = async ({ doc, operation, req }: any) => {
  if (req.context.revalidated) return
  req.context.revalidated = true

  revalidatePath('/blog')
  revalidatePath(`/blog/${doc.slug}`)
  revalidateTag('posts')
}
```

### Contact Form Email Hook (optional)

```ts
export const sendContactEmailHook = async ({ doc, req }: any) => {
  await req.payload.sendEmail({
    to: process.env.CONTACT_EMAIL,
    from: process.env.FROM_EMAIL,
    subject: `New Contact Form Submission from ${doc.name}`,
    html: `<p>Name: ${doc.name}</p><p>Email: ${doc.email}</p><p>Message: ${doc.message}</p>`,
  })
}
```

---

## Page Routes Summary

| # | Page | Route | Source Node | Key Data |
|---|------|--------|-------------|----------|
| 00 | Home | `/` | `833:4964` | HomePage global — Hero, About, Featured Property spotlight, Benefits (4), Latest Properties (2×2), Agents (3), Testimonials, FAQ accordion |
| 01 | Login | `/login` | `834:6096` | Auth page — split layout, Google/Apple social |
| 02 | Sign Up | `/signup` | `834:6184` | Auth page — split layout, T&C checkbox |
| 03 | Forgot Password | `/forgot-password` | `834:6251` | Auth flow — email input, Send OTP |
| 04 | Enter OTP | `/enter-otp` | `834:6294` | Auth flow — 6-digit OTP boxes, resend timer |
| 05 | Reset Password | `/reset-password` | `834:6379` | Auth flow — new + confirm password fields |
| 07 | Property Listing – Grid | `/properties` | `844:8443` | Properties — 3×2 card grid, 10/page, Prev/Next pagination, view toggle, Filter btn, Sort By btn — **verified ✓** |
| 08 | Property Listing – List | `/properties?view=list` | `846:10781` | Same query/pagination, horizontal card layout |
| 09 | Property Listing – Filter | `/properties?filter=open` | `847:12914` | Left sidebar filter panel (price range, type, beds, baths, area, city) + same grid |
| 10 | Property Listing – Map | `/properties?view=map` | (inferred) | Properties with `location` point field, map embed |
| 11 | About Us | `/about` | `849:19015` | AboutPage global, agents subset |
| 12 | Our Agents | `/agents` | `849:20536` | Users (role=agent), 3×2 card grid |
| 13 | Blog | `/blog` | `851:21975` | Posts collection, 2-col card grid, 6 per page |
| 14 | Blog Details | `/blog/[slug]` | `852:23020` | Single Post + BlogComments + sidebar posts/categories |
| 15 | Contact Us | `/contact` | `854:24397` | ContactSubmissions, contact info, form |
| 16 | Terms & Conditions | `/terms` | (inferred) | TermsConditions global |
| 17 | Privacy Policy | `/privacy-policy` | `856:26564` | PrivacyPolicy global |
| — | Header | (component) | `815:11455` | Header global |
| — | Footer | (component) | `831:5942` | Footer global |

---

## payload.config.ts — Full Config

```ts
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Properties } from './collections/Properties'
import { BlogPosts } from './collections/BlogPosts'
import { BlogCategories } from './collections/BlogCategories'
import { BlogComments } from './collections/BlogComments'
import { ContactSubmissions } from './collections/ContactSubmissions'

// Globals
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { SiteSettings } from './globals/SiteSettings'
import { HomePage } from './globals/HomePage'
import { AboutPage } from './globals/AboutPage'
import { PrivacyPolicy } from './globals/PrivacyPolicy'
import { TermsConditions } from './globals/TermsConditions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Properties,
    BlogPosts,
    BlogCategories,
    BlogComments,
    ContactSubmissions,
  ],
  globals: [
    Header,
    Footer,
    SiteSettings,
    HomePage,
    AboutPage,
    PrivacyPolicy,
    TermsConditions,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  // Point fields require MongoDB replica set or PostgreSQL
  // SQLite does NOT support point fields
})
```

---

## Project File Structure

```
src/
├── app/
│   ├── (frontend)/
│   │   ├── page.tsx                     # Home
│   │   ├── about/page.tsx               # About Us
│   │   ├── agents/page.tsx              # Our Agents
│   │   ├── blog/
│   │   │   ├── page.tsx                 # Blog listing
│   │   │   └── [slug]/page.tsx          # Blog detail
│   │   ├── properties/
│   │   │   ├── page.tsx                 # Property listing
│   │   │   └── [slug]/page.tsx          # Property detail
│   │   ├── contact/page.tsx             # Contact Us
│   │   ├── privacy-policy/page.tsx      # Privacy Policy
│   │   ├── terms/page.tsx               # Terms & Conditions
│   │   ├── login/page.tsx               # Login
│   │   ├── signup/page.tsx              # Sign Up
│   │   ├── forgot-password/page.tsx     # Forgot Password
│   │   ├── enter-otp/page.tsx           # Enter OTP
│   │   └── reset-password/page.tsx      # Reset Password
│   └── (payload)/
│       └── admin/[[...segments]]/page.tsx
├── collections/
│   ├── Users.ts
│   ├── Media.ts
│   ├── Properties.ts
│   ├── BlogPosts.ts
│   ├── BlogCategories.ts
│   ├── BlogComments.ts
│   └── ContactSubmissions.ts
├── globals/
│   ├── Header.ts
│   ├── Footer.ts
│   ├── SiteSettings.ts
│   ├── HomePage.ts
│   ├── AboutPage.ts
│   ├── PrivacyPolicy.ts
│   └── TermsConditions.ts
├── blocks/
│   ├── HeroBlock.ts
│   ├── CTABlock.ts
│   ├── RichTextBlock.ts
│   ├── ContactFormBlock.ts
│   ├── AgentCardBlock.ts
│   └── TestimonialBlock.ts
├── access/
│   └── index.ts
├── hooks/
│   ├── slugify.ts
│   ├── revalidate.ts
│   └── sendContactEmail.ts
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── PropertyCard.tsx
│   ├── AgentCard.tsx
│   ├── BlogCard.tsx
│   └── ContactForm.tsx
└── payload.config.ts
```

---

## Implementation Notes

### Authentication Pages (01–05)

All auth pages use a **split-screen layout**: left panel (550px) holds the form, right panel (890px) is a large property image with rounded corners and padding. The right image panel has a subtle rotate-180 flip animation class in the design.

- **Social sign-in** (Google, Apple) buttons appear on Login page — implement with a custom OAuth endpoint or next-auth adapter.
- **OTP flow**: Generate a 6-character OTP, store it server-side with expiry (e.g., Redis or a `otp-tokens` collection), validate on submission, then redirect to Reset Password.
- **Remember Me** checkbox: Extend JWT expiry when checked (Payload supports `tokenExpiration` per-user).

### Property Listing Variants (07–09)

Three views use the same data, different layouts:
- **Grid**: 3-col card grid, each card 392×392 image
- **List**: horizontal card rows, thumbnail left + details right
- **Filter**: side panel (filter inputs) + results area

Toggle state (`?view=list|grid|map`) is frontend-only; all three query the same `properties` collection with the same filters.

The header row shows: view toggle icons, "Showing 1–10 of 60 results", sort dropdown ("Sort By: Newest"), filter button.

### Map View (Page 10)

Requires the `location` `point` field on Properties. Use Payload's `near` operator for proximity searches:

```ts
const nearbyProperties = await payload.find({
  collection: 'properties',
  where: {
    location: {
      near: [longitude, latitude, maxDistanceMeters],
    },
  },
})
```

Frontend: embed Mapbox or Google Maps, plot markers from results.

### Blog Sidebar — Latest Posts

The sidebar on the Blog Detail page (Page 14) shows the 3 most recent published posts as thumbnails. Fetch dynamically:

```ts
const latest = await payload.find({
  collection: 'posts',
  where: { status: { equals: 'published' } },
  sort: '-publishedAt',
  limit: 3,
  select: { title: true, heroImage: true, publishedAt: true, slug: true },
})
```

### Contact Form API Route

Create a custom Next.js route handler that:
1. Validates inputs (name, email required)
2. Creates a `ContactSubmissions` document via Local API
3. Optionally sends notification email
4. Returns success/error JSON

```ts
// app/api/contact/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: Request) {
  const payload = await getPayload({ config })
  const body = await req.json()

  const submission = await payload.create({
    collection: 'contact-submissions',
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
      source: body.source ?? 'contact-page',
    },
    overrideAccess: true,
  })

  return Response.json({ success: true, id: submission.id })
}
```

### Color Mode (Light/Dark)

Every page in the design kit ships as Light, Dark, and Mobile variants. Implement via:
- CSS variables for all color tokens
- `data-theme="dark"` attribute on `<html>`
- User preference stored in localStorage or a cookie
- The SiteSettings global has a `colorMode` field for the default

---

*End of specification. Run `pnpm payload generate:types` after implementing all collections and globals to regenerate `payload-types.ts`.*
