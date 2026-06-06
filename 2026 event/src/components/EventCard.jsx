import { Link } from 'react-router-dom'
import { Calendar, MapPin } from 'lucide-react'

export default function EventCard({ event }) {
  return (
    <Link
      to={`/booking?event=${event._id || event.id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <span className="inline-block px-6 py-3 bg-rose-500 text-white font-semibold rounded-full hover:bg-rose-600 transition-colors">
            Book Now
          </span>
        </div>
        <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800">
          {event.category}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-rose-500 transition-colors">
          {event.title}
        </h3>
        <div className="flex items-center gap-4 text-gray-600 text-sm">
          <span className="flex items-center gap-1">
            <Calendar size={16} /> {event.date}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={16} /> {event.venue}
          </span>
        </div>
        <p className="mt-3 text-gray-600 line-clamp-2">{event.description}</p>
      </div>
    </Link>
  )
}
