import type { File, Payload, PayloadRequest } from 'payload'

/**
 * Seeds Ventr real-estate demo content: media, agent users, properties, and
 * the home-page / about-page globals. Idempotent — wipes previously seeded
 * properties and agent users first. Admin-gated by the calling route.
 */

// Minimal Lexical rich-text from plain paragraphs.
const rt = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
      textFormat: 0,
      children: [
        { type: 'text', text, detail: 0, format: 0, mode: 'normal', style: '', version: 1 },
      ],
    })),
  },
})

const unsplash = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`

const picsum = (seed: string, w: number, h: number) => `https://picsum.photos/seed/${seed}/${w}/${h}`

/** Fetch the primary image; on any failure fall back so the seed never breaks. */
async function fetchImage(primary: string, fallback: string, name: string): Promise<File> {
  for (const url of [primary, fallback]) {
    try {
      const res = await fetch(url, { method: 'GET' })
      if (!res.ok) continue
      const data = await res.arrayBuffer()
      if (!data.byteLength) continue
      return { name, data: Buffer.from(data), mimetype: 'image/jpeg', size: data.byteLength }
    } catch {
      // try the next source
    }
  }
  throw new Error(`Failed to fetch image for ${name}`)
}

// Curated real-estate photography (Unsplash photo IDs).
const HERO_ID = '1600596542815-ffad4c1539a9' // modern villa exterior
const ABOUT_HERO_ID = '1545324418-cc1a3fa10c00' // architecture
const STORY_ID = '1600210492493-0946911123ea' // interior
const PROPERTY_EXTERIOR_IDS = [
  '1600585154340-be6161a56a0c',
  '1512917774080-9991f1c4c750',
  '1564013799919-ab600027ffc6',
  '1570129477492-45c003edd2be',
  '1580587771525-78b9dba3b914',
  '1613490493576-7fde63acd811',
]
const PROPERTY_INTERIOR_IDS = [
  '1618221195710-dd6b41faaea6',
  '1586023492125-27b2c045efd7',
  '1505691938895-1758d7feb511',
  '1502005229762-cf1b2da7c5d6',
  '1560448204-e02f11c3d0e2',
  '1493809842364-78817add7ffb',
]
const AGENT_PORTRAIT_IDS = [
  '1507003211169-0a1dd7228f2d',
  '1494790108377-be9c29b29330',
  '1500648767791-00dcc994a43e',
  '1438761681033-6461ffad8d80',
  '1472099645785-5658abf4ff4e',
  '1519085360753-af0119f7cbe7',
]

type AgentSeed = { name: string; bio: string; phone: string; featured: boolean }
const AGENTS: AgentSeed[] = [
  { name: 'Wade Warren', bio: 'Luxury villa specialist with 12 years of coastal market experience.', phone: '(671) 555-0110', featured: true },
  { name: 'Jenny Wilson', bio: 'Helping families find their forever home across the bay area.', phone: '(671) 555-0114', featured: true },
  { name: 'Devon Lane', bio: 'Investment property advisor focused on high-yield residences.', phone: '(671) 555-0117', featured: true },
  { name: 'Kristin Jenifar', bio: 'Boutique residential agent with an eye for architectural gems.', phone: '(671) 555-0121', featured: false },
  { name: 'Johnson Watson', bio: 'Waterfront and new-build expert serving the western shoreline.', phone: '(671) 555-0125', featured: false },
  { name: 'Leasie Willions', bio: 'Relocation and first-time buyer specialist.', phone: '(671) 555-0129', featured: false },
]

type PropSeed = {
  title: string
  beds: number
  baths: number
  area: number
  price: number
  listingType: 'sale' | 'rent'
  city: string
  state: string
  street: string
  featured?: boolean
}
const PROPERTIES: PropSeed[] = [
  { title: 'Cascading Waters Villa of Serenity', beds: 5, baths: 6, area: 5320, price: 2450000, listingType: 'sale', city: 'Richardson', state: 'California', street: '3891 Ranchview Dr.', featured: true },
  { title: 'Starlit Cove Private Villa Retreat', beds: 6, baths: 8, area: 6740, price: 3900000, listingType: 'sale', city: 'Pasadena', state: 'California', street: '2715 Ash Dr.' },
  { title: 'Villa of Whispering Winds and Waves', beds: 7, baths: 6, area: 7910, price: 12000, listingType: 'rent', city: 'Santa Ana', state: 'Illinois', street: '4140 Parker Rd.' },
  { title: 'Blissful Breeze at Seaside Villa', beds: 4, baths: 3, area: 4780, price: 1680000, listingType: 'sale', city: 'Syracuse', state: 'Connecticut', street: '2118 Thornridge Cir.' },
  { title: 'Golden Sands Haven by the Bay', beds: 4, baths: 5, area: 4800, price: 9500, listingType: 'rent', city: 'Fairfield', state: 'New Jersey', street: '1901 Thornridge Cir.' },
  { title: 'Enchanted Garden View Villa Retreat', beds: 5, baths: 4, area: 5500, price: 2100000, listingType: 'sale', city: 'Lansing', state: 'Illinois', street: '8502 Preston Rd.' },
]

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')

export const seedVentr = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('— Ventr seed: clearing previous demo data…')
  await payload.delete({ collection: 'properties', where: { id: { exists: true } }, req })
  await payload.delete({ collection: 'users', where: { roles: { in: ['agent'] } }, req })

  payload.logger.info('— Ventr seed: uploading media…')
  const heroFile = await fetchImage(
    unsplash(HERO_ID, 1920, 1080),
    picsum('ventr-hero', 1920, 1080),
    'ventr-hero.jpg',
  )
  const aboutHeroFile = await fetchImage(
    unsplash(ABOUT_HERO_ID, 1920, 1080),
    picsum('ventr-about', 1920, 1080),
    'ventr-about.jpg',
  )
  const storyFile = await fetchImage(
    unsplash(STORY_ID, 1200, 900),
    picsum('ventr-story', 1200, 900),
    'ventr-story.jpg',
  )

  const heroMedia = await payload.create({
    collection: 'media',
    data: { alt: 'Modern luxury residence at dusk' },
    file: heroFile,
    req,
  })
  const aboutHeroMedia = await payload.create({
    collection: 'media',
    data: { alt: 'Ventr team and offices' },
    file: aboutHeroFile,
    req,
  })
  const storyMedia = await payload.create({
    collection: 'media',
    data: { alt: 'Our story' },
    file: storyFile,
    req,
  })

  // Agents (+ avatars)
  payload.logger.info('— Ventr seed: creating agents…')
  const agentIds: number[] = []
  for (let i = 0; i < AGENTS.length; i++) {
    const a = AGENTS[i]
    const avatarFile = await fetchImage(
      unsplash(AGENT_PORTRAIT_IDS[i % AGENT_PORTRAIT_IDS.length], 800, 800),
      picsum(`ventr-agent-${i}`, 800, 800),
      `agent-${i}.jpg`,
    )
    const avatar = await payload.create({
      collection: 'media',
      data: { alt: a.name },
      file: avatarFile,
      req,
    })
    const user = await payload.create({
      collection: 'users',
      data: {
        name: a.name,
        email: `${slugify(a.name)}@ventr.demo`,
        password: 'password',
        roles: ['agent'],
        title: 'Real Estate Agent',
        bio: a.bio,
        phone: a.phone,
        avatar: avatar.id,
        featuredOnHomepage: a.featured,
        rating: 4.8,
        reviewCount: 120 + i * 7,
      },
      req,
    })
    agentIds.push(user.id)
  }

  // Properties (+ hero & gallery images)
  payload.logger.info('— Ventr seed: creating properties…')
  const propertyIds: number[] = []
  for (let i = 0; i < PROPERTIES.length; i++) {
    const p = PROPERTIES[i]
    const heroImgFile = await fetchImage(
      unsplash(PROPERTY_EXTERIOR_IDS[i % PROPERTY_EXTERIOR_IDS.length], 1200, 1200),
      picsum(`ventr-prop-${i}`, 1200, 1200),
      `prop-${i}.jpg`,
    )
    const galleryFile = await fetchImage(
      unsplash(PROPERTY_INTERIOR_IDS[i % PROPERTY_INTERIOR_IDS.length], 1200, 900),
      picsum(`ventr-prop-${i}-g`, 1200, 900),
      `prop-${i}-g.jpg`,
    )
    const heroImage = await payload.create({
      collection: 'media',
      data: { alt: p.title },
      file: heroImgFile,
      req,
    })
    const galleryImage = await payload.create({
      collection: 'media',
      data: { alt: `${p.title} interior` },
      file: galleryFile,
      req,
    })
    const created = await payload.create({
      collection: 'properties',
      data: {
        title: p.title,
        generateSlug: false,
        slug: slugify(p.title),
        status: 'published',
        _status: 'published',
        featured: Boolean(p.featured),
        listingType: p.listingType,
        price: p.price,
        currency: 'USD',
        propertyType: 'villa',
        bedrooms: p.beds,
        bathrooms: p.baths,
        area: p.area,
        areaUnit: 'sqft',
        yearBuilt: 2021,
        heroImage: heroImage.id,
        gallery: [{ image: galleryImage.id, caption: 'Living area' }],
        description: rt([
          `${p.title} offers a rare blend of architectural elegance and everyday comfort.`,
          'Floor-to-ceiling glazing frames the surrounding landscape while open living spaces flow effortlessly onto private terraces.',
        ]),
        amenities: [
          { label: 'Private Pool' },
          { label: 'Smart Home' },
          { label: 'Parking' },
          { label: 'Garden' },
        ],
        address: {
          street: p.street,
          city: p.city,
          state: p.state,
          country: 'USA',
          displayAddress: `${p.street} ${p.city}, ${p.state}`,
        },
        agent: agentIds[i % agentIds.length],
        tags: [{ tag: 'villa' }, { tag: 'luxury' }],
      },
      req,
    })
    propertyIds.push(created.id)
  }

  const featuredProperty = propertyIds[0]

  // Home page global
  payload.logger.info('— Ventr seed: populating home-page global…')
  await payload.updateGlobal({
    slug: 'home-page',
    req,
    data: {
      hero: {
        backgroundImage: heroMedia.id,
        heading: 'Select Best Residence That Aligns With Your Lifestyle',
        subHeading:
          'Embarking on the journey to find a new home is exciting. Selecting the right residence is crucial for a harmonious match with your unique lifestyle.',
        searchLocationPlaceholder: 'Location',
        searchButtonLabel: 'Search',
      },
      aboutSection: {
        label: 'About Us',
        body: 'Our company specialise in transacting all type of properties in united state and making sure our clients enjoy a smooth and straightforward process that is tailored to their needs.',
        ctaLabel: 'Learn More',
        ctaHref: '/about',
      },
      featuredPropertySection: { property: featuredProperty },
      benefitsSection: {
        heading: 'Benefits You Get When You Use Our Services',
        subText: 'We make finding and owning your next home effortless from first search to final signature.',
        benefits: [
          { number: '01', title: 'Best Platform', description: 'Browse curated listings with rich detail and honest pricing.' },
          { number: '02', title: 'Comfort & Space', description: 'Homes selected for livability, light and generous space.' },
          { number: '03', title: '24/7 Support', description: 'Our agents are always one message away.' },
          { number: '04', title: 'Best Market Price', description: 'Fair, transparent valuations backed by local data.' },
        ],
        viewAllLabel: 'All Services',
        viewAllHref: '/about',
      },
      latestPropertiesSection: {
        heading: 'Explore Our Latest Properties',
        subText: 'A hand-picked selection of our newest residences on the market.',
        properties: propertyIds.slice(0, 4),
        viewAllLabel: 'All Properties',
        viewAllHref: '/properties',
      },
      agentsSection: {
        heading: 'Our Agents',
        subText: 'Meet the specialists who will guide you home.',
        featuredAgents: agentIds.slice(0, 3),
        viewAllLabel: 'All Agents',
        viewAllHref: '/agents',
      },
      testimonialsSection: {
        heading: "What's Our Client's Says",
        subText: 'Real stories from people who found their home with Ventr.',
        testimonials: [
          { quote: 'Ventr made the whole process calm and clear. We found our villa in under a month.', authorName: 'Marvin McKinney', authorTitle: 'Buyer', rating: 5 },
          { quote: 'The most professional agents we have ever worked with. Highly recommended.', authorName: 'Jane Cooper', authorTitle: 'Founder', rating: 5 },
        ],
      },
      faqSection: {
        heading: 'Frequently Ask Questions',
        subText: 'Everything you need to know before getting started.',
        faqs: [
          { question: 'How Does Our Platform Work?', answer: rt(['Search, shortlist and connect with an agent — all in one place.']) },
          { question: 'How Can I Find A Property To Buy or Sell?', answer: rt(['Use the search and filters on the Properties page, or contact an agent directly.']) },
          { question: 'What Information is Included in Property Listings?', answer: rt(['Each listing includes photos, key stats, amenities, location and an assigned agent.']) },
          { question: 'Make a plan according to the concept', answer: rt(['Our agents help you plan budget, financing and timeline from day one.']) },
        ],
        viewAllLabel: 'All FAQs',
        viewAllHref: '/faq',
      },
      seo: {
        metaTitle: 'Ventr — Find Your Dream Home',
        metaDescription: 'Discover luxury villas and residences that align with your lifestyle.',
      },
    },
  })

  // About page global
  payload.logger.info('— Ventr seed: populating about-page global…')
  await payload.updateGlobal({
    slug: 'about-page',
    req,
    data: {
      hero: { backgroundImage: aboutHeroMedia.id, heading: 'About Us' },
      missionSection: {
        heading: 'We Are on A Mission to Change View of Real Estate Field',
        body: rt([
          'Ventr was founded on a simple belief: finding a home should feel exciting, not exhausting.',
          'We pair local expertise with honest guidance so every client moves forward with confidence.',
        ]),
        stats: [
          { value: '12K+', label: 'Happy Clients' },
          { value: '8K+', label: 'Properties Sold' },
          { value: '50+', label: 'Expert Agents' },
          { value: '15', label: 'Years of Service' },
        ],
      },
      storySection: {
        heading: 'Built Around People, Not Just Properties',
        body: rt([
          'From our first listing to today, our focus has never changed — the people we serve.',
          'That human-first approach shapes every recommendation we make.',
        ]),
        image: storyMedia.id,
      },
      valuesSection: {
        heading: 'Our Values',
        values: [
          { title: 'Transparency', description: 'Clear pricing and honest advice at every step.' },
          { title: 'Care', description: 'We treat every client like our only client.' },
          { title: 'Excellence', description: 'A relentless standard for quality and detail.' },
        ],
      },
      featuredAgents: agentIds.slice(0, 3),
      seo: {
        metaTitle: 'About Us — Ventr',
        metaDescription: 'Learn about the team and mission behind Ventr real estate.',
      },
    },
  })

  payload.logger.info('✓ Ventr seed complete.')
}
