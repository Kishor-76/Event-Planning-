import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import EventCard from '../components/EventCard'
import { Search, Filter } from 'lucide-react'
import { fetchJSON, API_BASE } from '../utils/api'

const CATEGORIES = ['All', 'Wedding', 'Corporate', 'Birthday', 'Concert']

export default function EventListingPage() {
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const initialCategory = ['Wedding', 'Corporate', 'Birthday', 'Concert'].includes(categoryParam || '') ? categoryParam : 'All'
  const [category, setCategory] = useState(initialCategory)
  const [search, setSearch] = useState('')
  
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (categoryParam && ['Wedding', 'Corporate', 'Birthday', 'Concert'].includes(categoryParam)) {
      setCategory(categoryParam)
    }
  }, [categoryParam])

  useEffect(() => {
    let active = true
    const fetchEvents = async () => {
      setLoading(true)
      setError('')
      try {
        const queryParams = new URLSearchParams()
        if (category && category !== 'All') {
          queryParams.append('category', category)
        }
        if (search) {
          queryParams.append('search', search)
        }

        const url = `${API_BASE}/api/events?${queryParams.toString()}`
        const data = await fetchJSON(url)
        if (active) {
          setEvents(data)
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load events. Make sure the backend server is running.')
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
  }, [category, search])

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F5F5F5] pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Upcoming <span className="text-rose-500">Events</span>
            </h1>
            <p className="text-gray-600">Discover and book your perfect event experience</p>
          </div>

          {/* Filters */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg mb-12 border border-white/50">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F5F5] rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Category:</span>
                </div>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      category === cat
                        ? 'bg-rose-500 text-white'
                        : 'bg-[#F5F5F5] text-gray-700 hover:bg-rose-100 hover:text-rose-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center font-semibold">
              {error}
            </div>
          )}

          {/* Loading Indicator */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
            </div>
          ) : (
            <>
              {/* Event Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                  <EventCard key={event._id || event.id} event={event} />
                ))}
              </div>
              {events.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  No events found. Try adjusting your filters.
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
