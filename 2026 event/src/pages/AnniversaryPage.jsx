import EventTypeLayout from '../components/EventTypeLayout'

const content = {
  title: 'Anniversary Celebration',
  subtitle: 'Honor your journey together with a celebration to remember',
  heroImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920',
  description: 'Whether it\'s your first anniversary or your golden jubilee, we create intimate or grand celebrations that reflect your story. Romantic settings, personalized touches, and flawless execution.',
  features: [
    { title: 'Intimate Dinners', text: 'Private venues and curated menus for a romantic evening.' },
    { title: 'Renewal of Vows', text: 'Meaningful ceremonies with décor and coordination included.' },
    { title: 'Party Celebrations', text: 'Larger gatherings with entertainment and catering.' },
    { title: 'Destination Options', text: 'Beach, garden, or heritage venues for a special backdrop.' },
    { title: 'Photography & Video', text: 'Capture the milestone with professional keepsakes.' },
    { title: 'Custom Touches', text: 'Timeline displays, song playlists, and personalized favors.' },
  ],
}

export default function AnniversaryPage() {
  return <EventTypeLayout {...content} />
}
