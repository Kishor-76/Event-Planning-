import EventTypeLayout from '../components/EventTypeLayout'

const content = {
  title: 'Birthday Party',
  subtitle: 'Celebrate life\'s milestones with joy and style',
  heroImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1920',
  description: 'Whether it\'s a first birthday, sweet sixteen, or a milestone celebration, we create parties that are as unique as you are. Themes, entertainment, and every detail tailored to make the guest of honor feel special.',
  features: [
    { title: 'Theme & Styling', text: 'From princess parties to retro bashes – we bring your theme to life.' },
    { title: 'Venue & Setup', text: 'Indoor or outdoor spaces with décor that wows.' },
    { title: 'Cake & Desserts', text: 'Custom cakes, dessert bars, and sweet tables.' },
    { title: 'Entertainment', text: 'Magicians, DJs, photo booths, and activity stations.' },
    { title: 'Catering', text: 'Kid-friendly and adult menus to please everyone.' },
    { title: 'Invitations & Goodies', text: 'Fun invites and party favors guests will love.' },
  ],
}

export default function BirthdayPartyPage() {
  return <EventTypeLayout {...content} />
}
