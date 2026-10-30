/**
 * All static site copy lives here so it can be tweaked in one place.
 * (The old Express admin edited these values in a database; now they are
 * plain constants — update this file to change the site's text.)
 */

export const site = {
  name: 'JCROWN DIGITALS',
  owner: 'Jediah Akeredolu',
  tagline:
    'Discover my world of ideas, digital publications, and resources created to share knowledge, inspire growth, and make useful information accessible.',
  quote: 'Knowledge, well shared, is a crown anyone can wear.',
}

export const about = {
  title: 'Meet Jediah Akeredolu',
  bio: [
    'Jediah Akeredolu is the person behind JCROWN DIGITALS, a digital platform created to share ideas, publications, and valuable resources with readers. Through his work, he aims to make knowledge easier to access and give people an opportunity to discover useful perspectives through digital content.',
    'JCROWN DIGITALS represents his commitment to bringing his work together in one accessible space, where readers can explore his publications, discover available resources, and stay informed about new releases.',
    'Whether you are visiting to discover a book, explore a free resource, or learn more about his work, JCROWN DIGITALS is designed to make that experience simple, welcoming, and accessible.',
  ],
  portrait: null, // e.g. '/portrait.jpg' once you drop a photo into the public/ folder
}

export const offers = {
  title: 'Knowledge Worth Discovering',
  description:
    "Explore Jediah's digital books and access available resources through the website.",
  features: [
    {
      title: 'Digital Publications',
      description:
        'Explore books published by Jediah — written with care and delivered in clean, readable digital formats.',
      icon: 'book',
    },
    {
      title: 'Free Resources',
      description:
        'Access publications and resources specifically made available for free — no account required.',
      icon: 'gift',
    },
    {
      title: 'New Releases & Updates',
      description:
        'Stay informed about new books, resources, and other updates from JCROWN DIGITALS.',
      icon: 'sparkles',
    },
  ],
}

export const books = {
  title: 'Explore & Download My Books',
  description:
    'Discover the publications available through JCROWN DIGITALS. Choose a book to view its details and access the available download.',
}

export const newsletter = {
  title: 'Stay Connected with JCROWN DIGITALS',
  description:
    'Get updates when new books, publications, and resources become available.',
}

export const contact = {
  title: 'Contact Jediah',
  description: 'Have a question or want to get in touch? Send me a message.',
  email: '', // e.g. 'hello@jcrowndigitals.com' — shown in the contact panel when set
}

export const socials = [
  // { name: 'Instagram', url: 'https://instagram.com/...' },
  // { name: 'Twitter', url: 'https://x.com/...' },
  // { name: 'LinkedIn', url: 'https://linkedin.com/in/...' },
  // { name: 'Facebook', url: 'https://facebook.com/...' },
]
