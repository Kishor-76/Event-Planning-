import EventTypeLayout from '../components/EventTypeLayout'

const content = {
  title: 'Wedding Planning',
  subtitle: 'Romantic ceremonies and receptions crafted with love and precision',
  heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920',
  description: 'From intimate garden weddings to grand ballroom receptions, we handle every detail so you can focus on your special day. Our wedding planning team brings years of experience and a passion for creating unforgettable moments.',
  features: [
    { title: 'Venue & Décor', text: 'Handpicked venues and stunning floral arrangements that match your vision.' },
    { title: 'Catering & Cake', text: 'Custom menus and designer cakes to delight your guests.' },
    { title: 'Photography & Video', text: 'Professional capture of every precious moment.' },
    { title: 'Entertainment', text: 'DJs, live bands, and choreography for the perfect celebration.' },
    { title: 'Invitations & Favors', text: 'Elegant stationery and thoughtful guest favors.' },
    { title: 'Day-of Coordination', text: 'Dedicated coordinator so everything runs smoothly.' },
  ],
}

export default function WeddingPlanningPage() {
  return <EventTypeLayout {...content} />
}
