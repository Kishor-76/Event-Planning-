import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import ServiceCards from '../components/ServiceCards'
import LogoCarousel from '../components/LogoCarousel'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import EventCard from '../components/EventCard'
import { fetchJSON, API_BASE } from '../utils/api'

export default function HomePage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const fetchEvents = async () => {
      try {
        const data = await fetchJSON(`${API_BASE}/api/events`)
        if (active) {
          // Limit to 3 upcoming events for homepage
          setEvents(data.slice(0, 3))
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load events.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }
    fetchEvents()
    return () => {
      active = false
    }
  }, [])

  return (
    <>
      <Navbar />
      <Hero />
      <ServiceCards />
      
      {/* Featured/Upcoming Events Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Upcoming <span className="text-rose-500">Events</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl">
                Explore our curated list of upcoming occasions and join us for unforgettable experiences
              </p>
            </div>
            <Link
              to="/events"
              className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-full shadow-lg shadow-rose-500/20 hover:shadow-rose-600/30 hover:scale-105 transition-all duration-300"
            >
              View All Events
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500" />
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center font-semibold">
              {error}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No upcoming events found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard key={event._id || event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      <LogoCarousel />
      <Footer />
    </>
  )
}
