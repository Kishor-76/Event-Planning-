import { useState, useRef, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LocationSelector from '../components/LocationSelector'
import EventCountdown from '../components/EventCountdown'
import PlanningProgressRing from '../components/PlanningProgressRing'
import BudgetTracker from '../components/BudgetTracker'
import WeatherWidget from '../components/WeatherWidget'
import { Upload, MapPin, Calendar, CheckCircle, Heart, Settings, X, Plus, LogOut, Users, Play, Video, Image, Trash2, Maximize2 } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { fetchJSON, API_BASE } from '../utils/api'

// India States and Cities data
const INDIA_DATA = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Aurangabad', 'Nashik'],
  'Delhi': ['New Delhi', 'Old Delhi'],
  'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi'],
  'West Bengal': ['Kolkata', 'Darjeeling', 'Durgapur'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
  'Rajasthan': ['Jaipur', 'Udaipur', 'Jodhpur', 'Ajmer'],
  'Punjab': ['Chandigarh', 'Amritsar', 'Ludhiana'],
}

const EVENT_PREFERENCES = [
  'Weddings',
  'Corporate Events',
  'Birthday Parties',
  'Baby Showers',
  'Anniversary',
  'Concerts',
  'Festivals',
  'Product Launch',
  'Conferences',
  'Networking',
]

const DEFAULT_PHOTOS = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&h=450&fit=crop'
]

const DEFAULT_VIDEOS = [
  'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-dancing-under-lights-40019-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-champagne-glasses-toast-at-a-celebration-40003-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-dj-playing-music-at-a-club-42526-large.mp4'
]

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useContext(AuthContext)

  const [userProfile, setUserProfile] = useState({
    name: user?.name || 'John Doe',
    badge: 'Member',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    state: user?.state || 'Maharashtra',
    city: user?.city || 'Mumbai',
    bio: user?.bio || 'Event enthusiast and planner',
  })

  const [selectedPreferences, setSelectedPreferences] = useState(user?.preferences || [])
  const [gallery, setGallery] = useState(user?.gallery && user.gallery.length > 0 ? user.gallery : DEFAULT_PHOTOS)
  const [videos, setVideos] = useState(user?.videos && user.videos.length > 0 ? user.videos : DEFAULT_VIDEOS)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [galleryTab, setGalleryTab] = useState('photos')
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [activeVideoUrl, setActiveVideoUrl] = useState(null)

  // Sync user profile with AuthContext user when user loads
  useEffect(() => {
    if (user) {
      setUserProfile(prev => ({
        ...prev,
        name: user.name || prev.name,
        avatar: user.avatar || prev.avatar,
        state: user.state || prev.state,
        city: user.city || prev.city,
        bio: user.bio || prev.bio,
      }))
      setSelectedPreferences(user.preferences || [])
      setGallery(user.gallery && user.gallery.length > 0 ? user.gallery : DEFAULT_PHOTOS)
      setVideos(user.videos && user.videos.length > 0 ? user.videos : DEFAULT_VIDEOS)
    }
  }, [user])

  const [userBookings, setUserBookings] = useState([])
  const [bookingsLoading, setBookingsLoading] = useState(true)

  useEffect(() => {
    let active = true
    const fetchMyBookings = async () => {
      if (!user?.email) return
      try {
        const data = await fetchJSON(`${API_BASE}/api/bookings?email=${user.email}`)
        if (active) {
          setUserBookings(data)
        }
      } catch (err) {
        console.error('Failed to load bookings:', err)
      } finally {
        if (active) {
          setBookingsLoading(false)
        }
      }
    }
    fetchMyBookings()
    return () => {
      active = false
    }
  }, [user])

  // Compute real stats from bookings
  const upcomingCount = userBookings.filter(b => {
    const bookingDate = new Date(b.date)
    return bookingDate >= new Date().setHours(0,0,0,0)
  }).length

  const completedCount = userBookings.filter(b => {
    const bookingDate = new Date(b.date)
    return bookingDate < new Date().setHours(0,0,0,0)
  }).length

  const uniqueVenues = [...new Set(userBookings.map(b => b.venue))].filter(Boolean).length

  const stats = {
    upcomingEvents: upcomingCount,
    completedBookings: completedCount,
    savedVenues: uniqueVenues || 0
  }

  // Find next upcoming booking
  const upcomingBookings = userBookings
    .filter(b => {
      const bookingDate = new Date(b.date)
      return bookingDate >= new Date().setHours(0,0,0,0)
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const nextBooking = upcomingBookings[0]
  
  const upcomingEventDate = nextBooking 
    ? new Date(nextBooking.date).toISOString() 
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  const upcomingEventTitle = nextBooking 
    ? (nextBooking.event ? nextBooking.event.title : `Event at ${nextBooking.venue}`)
    : "Sunset Garden Wedding"

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editForm, setEditForm] = useState(userProfile)
  const fileInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  const videoInputRef = useRef(null)

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
      navigate('/login')
    }
  }

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const newAvatar = reader.result
        setUserProfile((prev) => ({ ...prev, avatar: newAvatar }))
        try {
          const updatedUser = await fetchJSON(`${API_BASE}/api/auth/profile`, {
            method: 'PUT',
            body: JSON.stringify({
              name: userProfile.name,
              bio: userProfile.bio,
              state: userProfile.state,
              city: userProfile.city,
              avatar: newAvatar,
              preferences: selectedPreferences,
              gallery,
              videos,
            })
          })
          updateUser(updatedUser)
        } catch (err) {
          console.error('Failed to save avatar:', err)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryUpload = (e) => {
    const files = e.target.files
    if (files) {
      const fileList = Array.from(files)
      const readers = fileList.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(file)
        })
      })

      Promise.all(readers).then(async (newImages) => {
        const nextGallery = [...gallery, ...newImages]
        setGallery(nextGallery)
        try {
          const updatedUser = await fetchJSON(`${API_BASE}/api/auth/profile`, {
            method: 'PUT',
            body: JSON.stringify({
              name: userProfile.name,
              bio: userProfile.bio,
              state: userProfile.state,
              city: userProfile.city,
              avatar: userProfile.avatar,
              preferences: selectedPreferences,
              gallery: nextGallery,
              videos,
            })
          })
          updateUser(updatedUser)
        } catch (err) {
          console.error('Failed to save gallery changes:', err)
        }
      })
    }
  }

  const handleVideoUpload = (e) => {
    const files = e.target.files
    if (files) {
      const fileList = Array.from(files)
      const readers = fileList.map((file) => {
        if (file.size > 15 * 1024 * 1024) {
          alert(`Video size should be less than 15MB: ${file.name}`)
          return null
        }
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(file)
        })
      }).filter(Boolean)

      Promise.all(readers).then(async (newVideos) => {
        const nextVideos = [...videos, ...newVideos]
        setVideos(nextVideos)
        try {
          const updatedUser = await fetchJSON(`${API_BASE}/api/auth/profile`, {
            method: 'PUT',
            body: JSON.stringify({
              name: userProfile.name,
              bio: userProfile.bio,
              state: userProfile.state,
              city: userProfile.city,
              avatar: userProfile.avatar,
              preferences: selectedPreferences,
              gallery,
              videos: nextVideos,
            })
          })
          updateUser(updatedUser)
        } catch (err) {
          console.error('Failed to save video changes:', err)
        }
      })
    }
  }

  const handleProfileSave = async () => {
    try {
      const updatedUser = await fetchJSON(`${API_BASE}/api/auth/profile`, {
        method: 'PUT',
        body: JSON.stringify({
          name: editForm.name,
          bio: editForm.bio,
          state: editForm.state,
          city: editForm.city,
          avatar: userProfile.avatar,
          preferences: selectedPreferences,
          gallery,
          videos,
        })
      })
      updateUser(updatedUser)
      setIsEditingProfile(false)
    } catch (err) {
      alert('Failed to update profile: ' + err.message)
    }
  }

  const handlePreferenceToggle = async (pref) => {
    const nextPrefs = selectedPreferences.includes(pref)
      ? selectedPreferences.filter((p) => p !== pref)
      : [...selectedPreferences, pref]
    setSelectedPreferences(nextPrefs)
    try {
      const updatedUser = await fetchJSON(`${API_BASE}/api/auth/profile`, {
        method: 'PUT',
        body: JSON.stringify({
          name: userProfile.name,
          bio: userProfile.bio,
          state: userProfile.state,
          city: userProfile.city,
          avatar: userProfile.avatar,
          preferences: nextPrefs,
          gallery,
          videos,
        })
      })
      updateUser(updatedUser)
    } catch (err) {
      console.error('Failed to update event preferences:', err)
    }
  }

  const removeGalleryImage = async (index) => {
    const nextGallery = gallery.filter((_, i) => i !== index)
    setGallery(nextGallery)
    try {
      const updatedUser = await fetchJSON(`${API_BASE}/api/auth/profile`, {
        method: 'PUT',
        body: JSON.stringify({
          name: userProfile.name,
          bio: userProfile.bio,
          state: userProfile.state,
          city: userProfile.city,
          avatar: userProfile.avatar,
          preferences: selectedPreferences,
          gallery: nextGallery,
          videos,
        })
      })
      updateUser(updatedUser)
    } catch (err) {
      console.error('Failed to delete image:', err)
    }
  }

  const removeGalleryVideo = async (index) => {
    const nextVideos = videos.filter((_, i) => i !== index)
    setVideos(nextVideos)
    try {
      const updatedUser = await fetchJSON(`${API_BASE}/api/auth/profile`, {
        method: 'PUT',
        body: JSON.stringify({
          name: userProfile.name,
          bio: userProfile.bio,
          state: userProfile.state,
          city: userProfile.city,
          avatar: userProfile.avatar,
          preferences: selectedPreferences,
          gallery,
          videos: nextVideos,
        })
      })
      updateUser(updatedUser)
    } catch (err) {
      console.error('Failed to delete video:', err)
    }
  }

  const cities = INDIA_DATA[editForm.state] || []

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* Avatar Section */}
              <div className="relative flex-shrink-0 group">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-rose-500/30 shadow-lg group-hover:shadow-rose-500/40 transition-all"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-lg transition-all hover:scale-110"
                >
                  <Upload size={20} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-4xl font-bold text-gray-900">{userProfile.name}</h1>
                  <span className="px-4 py-1 bg-gradient-to-r from-rose-500 to-purple-500 text-white text-sm font-semibold rounded-full">
                    {userProfile.badge}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin size={18} className="text-rose-500" />
                  <span>{userProfile.city}, {userProfile.state}</span>
                </div>
                <p className="text-gray-700 mb-6">{userProfile.bio}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsEditingProfile(true)
                      setEditForm(userProfile)
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-rose-500/30 hover:shadow-rose-600/40"
                  >
                    <Settings size={18} /> Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all shadow-lg"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Modal */}
          {isEditingProfile && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <X size={24} className="text-gray-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <select
                      value={editForm.state}
                      onChange={(e) => setEditForm({ ...editForm, state: e.target.value, city: '' })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                    >
                      {Object.keys(INDIA_DATA).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <select
                      value={editForm.city}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleProfileSave}
                      className="flex-1 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: Calendar, label: 'Upcoming Events', value: stats.upcomingEvents, color: 'rose' },
              { icon: CheckCircle, label: 'Completed Bookings', value: stats.completedBookings, color: 'emerald' },
              { icon: Heart, label: 'Saved Venues', value: stats.savedVenues, color: 'purple' },
            ].map((stat, idx) => {
              const Icon = stat.icon
              const colorClass = {
                rose: 'from-rose-500 to-red-500',
                emerald: 'from-emerald-500 to-green-500',
                purple: 'from-purple-500 to-indigo-500',
              }[stat.color]
              return (
                <div
                  key={idx}
                  className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all hover:scale-105"
                >
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                </div>
              )
            })}
          </div>

          {/* Live Event Countdown */}
          {!bookingsLoading && userBookings.length > 0 && (
            <div className="mb-8">
              <EventCountdown 
                eventDate={upcomingEventDate}
                eventTitle={upcomingEventTitle}
              />
            </div>
          )}

          {/* My Booked Events Section */}
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 mb-8 shadow-xl border border-white/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar size={28} className="text-rose-500" />
              My Booked Events
            </h2>
            {bookingsLoading ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
              </div>
            ) : userBookings.length === 0 ? (
              <div className="text-center py-10 bg-white/20 rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg mb-4">You have not booked any events yet.</p>
                <Link
                  to="/events"
                  className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  Discover Events
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userBookings.map((booking) => (
                  <div
                    key={booking._id || booking.id}
                    className="bg-white/80 rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {booking.event ? booking.event.title : 'Custom Occasion'}
                        </h3>
                        <span className="inline-block mt-1 px-2.5 py-0.5 bg-rose-50 text-rose-600 rounded-full text-xs font-medium border border-rose-100">
                          {booking.event ? booking.event.category : 'Custom'}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                        booking.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {booking.status || 'pending'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-gray-600 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span>{booking.venue || 'To Be Confirmed'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        <span>{booking.guests} Guests</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Planning Progress Ring */}
          {!bookingsLoading && userBookings.length > 0 && (
            <div className="mb-8">
              <PlanningProgressRing completionPercentage={65} eventType="Wedding" />
            </div>
          )}

          {/* Dynamic Location Section */}
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 mb-8 shadow-xl border border-white/50 relative z-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin size={28} className="text-rose-500" />
              Select Your Location
            </h2>
            <LocationSelector 
              initialState={userProfile.state}
              initialCity={userProfile.city}
              onLocationChange={async (state, city) => {
                setUserProfile(prev => ({ ...prev, state, city }))
                try {
                  const updatedUser = await fetchJSON(`${API_BASE}/api/auth/profile`, {
                    method: 'PUT',
                    body: JSON.stringify({
                      name: userProfile.name,
                      bio: userProfile.bio,
                      state,
                      city,
                      avatar: userProfile.avatar,
                      preferences: selectedPreferences,
                      gallery,
                      videos,
                    })
                  })
                  updateUser(updatedUser)
                } catch (err) {
                  console.error('Failed to save location change:', err)
                }
              }}
            />
          </div>

          {/* Event Preferences */}
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 mb-8 shadow-xl border border-white/50 relative z-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Preferences</h2>
            <div className="flex flex-wrap gap-3">
              {EVENT_PREFERENCES.map((pref) => (
                <button
                  key={pref}
                  onClick={() => handlePreferenceToggle(pref)}
                  className={`px-5 py-2 rounded-full font-medium transition-all transform hover:scale-110 ${
                    selectedPreferences.includes(pref)
                      ? 'bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-lg shadow-rose-500/40'
                      : 'bg-white/60 text-gray-700 border border-gray-200 hover:border-rose-300'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          {/* Event Gallery Preview */}
          <div 
            onClick={() => setIsGalleryOpen(true)}
            className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Event Gallery</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {gallery.length} Photos • {videos.length} Videos
                </p>
              </div>
              <span className="px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-500 text-white font-semibold rounded-xl text-sm opacity-90 group-hover:opacity-100 transition-opacity">
                Open Gallery
              </span>
            </div>

            {gallery.length === 0 && videos.length === 0 ? (
              <div className="text-center py-12 bg-white/20 rounded-2xl border border-dashed border-gray-300">
                <Upload size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No photos or videos yet. Click to start building your gallery!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {[
                  ...gallery.slice(0, 4).map((src, idx) => ({ type: 'image', src, originalIndex: idx })),
                  ...videos.slice(0, 2).map((src, idx) => ({ type: 'video', src, originalIndex: idx }))
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-all border border-white/30"
                  >
                    {item.type === 'image' ? (
                      <img 
                        src={item.src} 
                        alt="Preview" 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-950 flex items-center justify-center relative">
                        <video 
                          src={item.src} 
                          className="w-full h-full object-cover opacity-60" 
                          muted 
                          playsInline 
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Play size={24} className="text-white fill-white drop-shadow-lg" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen Interactive Gallery Modal */}
          {isGalleryOpen && (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-0 md:p-6 transition-all duration-300">
              <div className="bg-white/95 backdrop-blur-xl w-full h-full md:max-w-6xl md:h-[85vh] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-white/70">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Event Media Gallery</h2>
                    <p className="text-sm text-gray-500">Manage and browse your wedding & corporate event memories</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsGalleryOpen(false);
                    }}
                    className="p-2 hover:bg-gray-150 rounded-full transition-all text-gray-600 hover:text-gray-950"
                  >
                    <X size={26} />
                  </button>
                </div>

                {/* Tab Controls and Actions */}
                <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                  {/* Two Separate Sections Tabs */}
                  <div className="flex bg-gray-200/60 p-1 rounded-xl w-full sm:w-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setGalleryTab('photos');
                      }}
                      className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        galleryTab === 'photos' 
                          ? 'bg-white text-gray-900 shadow-md' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Image size={18} /> Photos ({gallery.length})
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setGalleryTab('videos');
                      }}
                      className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        galleryTab === 'videos' 
                          ? 'bg-white text-gray-900 shadow-md' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Video size={18} /> Videos ({videos.length})
                    </button>
                  </div>

                  {/* Upload Actions */}
                  <div onClick={(e) => e.stopPropagation()}>
                    {galleryTab === 'photos' ? (
                      <>
                        <button
                          onClick={() => galleryInputRef.current?.click()}
                          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-purple-500 hover:shadow-md text-white font-semibold rounded-xl text-sm transition-all"
                        >
                          <Plus size={18} /> Add Photos
                        </button>
                        <input
                          ref={galleryInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleGalleryUpload}
                          className="hidden"
                        />
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => videoInputRef.current?.click()}
                          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-purple-500 hover:shadow-md text-white font-semibold rounded-xl text-sm transition-all"
                        >
                          <Plus size={18} /> Add Videos
                        </button>
                        <input
                          ref={videoInputRef}
                          type="file"
                          multiple
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Gallery Content Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-white" onClick={(e) => e.stopPropagation()}>
                  {galleryTab === 'photos' ? (
                    gallery.length === 0 ? (
                      <div className="text-center py-20">
                        <Upload size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">No photos uploaded yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {gallery.map((image, idx) => (
                          <div
                            key={idx}
                            className="group relative overflow-hidden rounded-2xl aspect-square shadow-md hover:shadow-xl transition-all border border-gray-100 cursor-pointer"
                          >
                            <img
                              src={image}
                              alt={`Event Photo ${idx + 1}`}
                              onClick={() => setLightboxIndex(idx)}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            
                            {/* Zoom button */}
                            <button
                              onClick={() => setLightboxIndex(idx)}
                              className="absolute top-4 left-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Maximize2 size={16} />
                            </button>

                            {/* Delete button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (window.confirm("Are you sure you want to delete this photo?")) {
                                  removeGalleryImage(idx)
                                }
                              }}
                              className="absolute bottom-4 right-4 p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    videos.length === 0 ? (
                      <div className="text-center py-20">
                        <Upload size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">No videos uploaded yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video, idx) => (
                          <div
                            key={idx}
                            className="group relative overflow-hidden rounded-2xl aspect-video bg-gray-950 shadow-md hover:shadow-xl transition-all border border-gray-900 cursor-pointer"
                            onClick={() => setActiveVideoUrl(video)}
                          >
                            <video
                              src={video}
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-350 animate-fade-in"
                              muted
                              playsInline
                            />
                            
                            {/* Play overlay button */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-14 h-14 bg-rose-500/90 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                                <Play size={26} className="fill-white translate-x-0.5" />
                              </div>
                            </div>

                            {/* Delete button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (window.confirm("Are you sure you want to delete this video?")) {
                                  removeGalleryVideo(idx)
                                }
                              }}
                              className="absolute bottom-4 right-4 p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>

              </div>
            </div>
          )}

          {/* Lightbox for Photos */}
          {lightboxIndex !== null && (
            <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center" onClick={() => setLightboxIndex(null)}>
              <button 
                onClick={() => setLightboxIndex(null)}
                className="absolute top-6 right-6 text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={32} />
              </button>
              
              {/* Prev Button */}
              {lightboxIndex > 0 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(lightboxIndex - 1);
                  }}
                  className="absolute left-6 text-white/70 hover:text-white p-3 hover:bg-white/10 rounded-full transition-all text-3xl font-bold"
                >
                  &#10094;
                </button>
              )}

              <img 
                src={gallery[lightboxIndex]} 
                alt={`Lightbox image`} 
                onClick={(e) => e.stopPropagation()}
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
              />

              {/* Next Button */}
              {lightboxIndex < gallery.length - 1 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(lightboxIndex + 1);
                  }}
                  className="absolute right-6 text-white/70 hover:text-white p-3 hover:bg-white/10 rounded-full transition-all text-3xl font-bold"
                >
                  &#10095;
                </button>
              )}
            </div>
          )}

          {/* Video Player Modal */}
          {activeVideoUrl !== null && (
            <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4" onClick={() => setActiveVideoUrl(null)}>
              <button 
                onClick={() => setActiveVideoUrl(null)}
                className="absolute top-6 right-6 text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={32} />
              </button>
              
              <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black" onClick={(e) => e.stopPropagation()}>
                <video 
                  src={activeVideoUrl} 
                  controls 
                  autoPlay 
                  className="w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Visual Budget Tracker and Weather Forecast */}
          {!bookingsLoading && userBookings.length > 0 && (
            <>
              <div className="mt-8">
                <BudgetTracker />
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Weather Forecast</h2>
                <WeatherWidget 
                  city={userProfile.city}
                  eventDate={upcomingEventDate}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
