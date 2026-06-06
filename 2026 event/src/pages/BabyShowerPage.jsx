import EventTypeLayout from '../components/EventTypeLayout'

const content = {
  title: 'Baby Shower',
  subtitle: 'Welcome the little one with a joyful and memorable celebration',
  heroImage: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1920',
  description: 'From gender reveals to traditional baby showers, we create sweet and stylish events that celebrate the expecting parents. Cute themes, games, and treats that make everyone smile.',
  features: [
    { title: 'Theme & Décor', text: 'Adorable themes from classic pastels to modern minimal or gender-reveal style.' },
    { title: 'Venue & Setup', text: 'Cozy indoor or garden setups with photo-worthy backdrops.' },
    { title: 'Games & Activities', text: 'Classic and creative games that keep guests entertained.' },
    { title: 'Cake & Treats', text: 'Baby-themed cakes, dessert tables, and refreshments.' },
    { title: 'Invitations & Favors', text: 'Cute invites and thank-you favors for guests.' },
    { title: 'Gift Table & Registry', text: 'Elegant display and optional registry coordination.' },
  ],
}

export default function BabyShowerPage() {
  return <EventTypeLayout {...content} />
}
