import { Link } from 'react-router-dom'
import { Heart, Briefcase, Cake, Music, Gift, Baby } from 'lucide-react'

const services = [
  {
    id: 1,
    title: 'Wedding Planning',
    description: 'Romantic ceremonies and receptions crafted with love and precision',
    icon: Heart,
    gradient: 'from-rose-400 to-pink-500',
    link: '/wedding-planning',
  },
  {
    id: 2,
    title: 'Birthday Party',
    description: 'Celebrate life\'s milestones with joy and style',
    icon: Cake,
    gradient: 'from-amber-400 to-orange-500',
    link: '/birthday-party',
  },
  {
    id: 3,
    title: 'Corporate Event',
    description: 'Professional gatherings that inspire and connect your team',
    icon: Briefcase,
    gradient: 'from-slate-600 to-slate-800',
    link: '/corporate-event',
  },
  {
    id: 4,
    title: 'Anniversary Celebration',
    description: 'Honor your journey together with a celebration to remember',
    icon: Gift,
    gradient: 'from-emerald-400 to-teal-600',
    link: '/anniversary-celebration',
  },
  {
    id: 5,
    title: 'Baby Shower',
    description: 'Welcome the little one with a joyful and memorable celebration',
    icon: Baby,
    gradient: 'from-sky-400 to-blue-500',
    link: '/baby-shower',
  },
  {
    id: 6,
    title: 'Concerts',
    description: 'Unforgettable live experiences and entertainment',
    icon: Music,
    gradient: 'from-violet-500 to-purple-700',
    link: '/events?category=Concert',
  },
]

export default function ServiceCards() {
  return (
    <section className="py-24 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-rose-500">Services</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Whatever the occasion, we bring your vision to life with excellence
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Link
                key={service.id}
                to={service.link}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-3 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-rose-500 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors">
                  {service.description}
                </p>
                <span className="inline-block mt-4 text-rose-500 font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Explore →
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
