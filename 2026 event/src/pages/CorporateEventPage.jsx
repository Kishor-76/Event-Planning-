import EventTypeLayout from '../components/EventTypeLayout'

const content = {
  title: 'Corporate Event',
  subtitle: 'Professional gatherings that inspire and connect your team',
  heroImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920',
  description: 'From conferences and product launches to team offsites and award nights, we deliver corporate events that align with your brand and goals. Professional execution with every detail taken care of.',
  features: [
    { title: 'Conferences & Seminars', text: 'AV setup, stage design, and seamless flow for business events.' },
    { title: 'Product Launches', text: 'Buzz-worthy launches that get media and clients talking.' },
    { title: 'Team Building', text: 'Engaging activities and venues that bring teams together.' },
    { title: 'Gala & Award Nights', text: 'Elegant evenings that recognize and celebrate success.' },
    { title: 'Catering & Networking', text: 'Premium F&B and spaces designed for meaningful connections.' },
    { title: 'Branding & Collateral', text: 'Consistent branding across invites, signage, and swag.' },
  ],
}

export default function CorporateEventPage() {
  return <EventTypeLayout {...content} />
}
