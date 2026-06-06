require('dotenv').config()
const connectDB = require('../config/db')
const Event = require('../models/Event')

const MOCK_EVENTS = [
  {
    title: 'Sunset Garden Wedding',
    category: 'Wedding',
    date: 'Mar 15, 2026',
    venue: 'Grand Hyatt, Mumbai',
    description: "A romantic garden wedding with sunset views and premium catering.",
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
  },
  {
    title: 'Corporate Annual Gala',
    category: 'Corporate',
    date: 'Mar 20, 2026',
    venue: 'Taj Palace, Delhi',
    description: 'Celebrate your company achievements with style and sophistication.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
  },
  {
    title: 'Milestone Birthday Bash',
    category: 'Birthday',
    date: 'Mar 25, 2026',
    venue: 'The Oberoi, Bangalore',
    description: 'Make turning 30 memorable with an exclusive rooftop celebration.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600',
  },
  {
    title: 'Live Jazz Night',
    category: 'Concert',
    date: 'Apr 1, 2026',
    venue: 'JW Marriott, Pune',
    description: 'An evening of soulful jazz under the stars with premium bar.',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600',
  },
  {
    title: 'Traditional Wedding Ceremony',
    category: 'Wedding',
    date: 'Apr 10, 2026',
    venue: 'Leela Palace, Udaipur',
    description: 'A grand traditional wedding with royal treatment and heritage charm.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600',
  },
  {
    title: 'Product Launch Party',
    category: 'Corporate',
    date: 'Apr 15, 2026',
    venue: 'Four Seasons, Mumbai',
    description: 'Launch your product with a buzz-worthy event for media and clients.',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600',
  },
]

const run = async () => {
  await connectDB()
  await Event.deleteMany({})
  await Event.insertMany(MOCK_EVENTS)
  console.log('Seeded events')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
