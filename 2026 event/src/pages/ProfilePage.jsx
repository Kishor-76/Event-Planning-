import { useState, useRef, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LocationSelector from '../components/LocationSelector'
import EventCountdown from '../components/EventCountdown'
import PlanningProgressRing from '../components/PlanningProgressRing'
import BudgetTracker from '../components/BudgetTracker'
import WeatherWidget from '../components/WeatherWidget'
import { Upload, MapPin, Calendar, CheckCircle, Heart, Settings, X, Plus, LogOut } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

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

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)

  const [userProfile, setUserProfile] = useState({
    name: user?.name || 'John Doe',
    badge: 'Member',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    state: 'Maharashtra',
    city: 'Mumbai',
    bio: 'Event enthusiast and planner',
  })

  const [selectedPreferences, setSelectedPreferences] = useState(['Weddings', 'Corporate Events'])
  const [gallery, setGallery] = useState([
    'https://images.unsplash.com/photo-1519671482677-504be0271101?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1551510519-df6f9dd95814?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1574158622147-e121b37d7d48?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1567427282903-cd8c1a73b59e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1516417032154-ef48e5ee48b1?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1542200188-7ad90151afd4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1465014260857-11205520acde?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1519671867637-269862aba59a?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1508020849624-e6bd2ae3e858?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1503803548695-659e1591dcab?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1519671867637-269862aba59a?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1511674159375-cd50f7c4d3a3?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1519778520786-b63be92b675a?w=400&h=300&fit=crop',
  ])

  const [stats] = useState({
    upcomingEvents: 5,
    completedBookings: 12,
    savedVenues: 8,
  })

  // Sample upcoming event - set to 7 days from now
  const upcomingEventDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editForm, setEditForm] = useState(userProfile)
  const fileInputRef = useRef(null)
  const galleryInputRef = useRef(null)

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
      reader.onloadend = () => {
        setUserProfile((prev) => ({ ...prev, avatar: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryUpload = (e) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setGallery((prev) => [...prev, reader.result])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleProfileSave = () => {
    setUserProfile(editForm)
    setIsEditingProfile(false)
  }

  const handlePreferenceToggle = (pref) => {
    setSelectedPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    )
  }

  const removeGalleryImage = (index) => {
    setGallery((prev) => prev.filter((_, i) => i !== index))
  }

  const cities = INDIA_DATA[editForm.state] || []

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 pt-24 pb-16">
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
          <div className="mb-8">
            <EventCountdown 
              eventDate={upcomingEventDate}
              eventTitle="Sunset Garden Wedding"
            />
          </div>

          {/* Planning Progress Ring */}
          <div className="mb-8">
            <PlanningProgressRing completionPercentage={65} eventType="Wedding" />
          </div>

          {/* Dynamic Location Section */}
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 mb-8 shadow-xl border border-white/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin size={28} className="text-rose-500" />
              Select Your Location
            </h2>
            <LocationSelector 
              initialState={userProfile.state}
              initialCity={userProfile.city}
              onLocationChange={(state, city) => {
                setUserProfile(prev => ({ ...prev, state, city }))
              }}
            />
          </div>

          {/* Event Preferences */}
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 mb-8 shadow-xl border border-white/50">
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

          {/* Event Gallery */}
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Event Gallery</h2>
              <button
                onClick={() => galleryInputRef.current?.click()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-500 hover:shadow-lg hover:shadow-rose-500/40 text-white font-semibold rounded-xl transition-all"
              >
                <Plus size={20} /> Add Photos
              </button>
              <input
                ref={galleryInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryUpload}
                className="hidden"
              />
            </div>

            {gallery.length === 0 ? (
              <div className="text-center py-12">
                <Upload size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No photos yet. Upload your first event photo!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((image, idx) => (
                  <div
                    key={idx}
                    className="group relative overflow-hidden rounded-2xl aspect-square shadow-lg hover:shadow-2xl transition-all"
                  >
                    <img
                      src={image}
                      alt={`Event ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <button
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute bottom-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Visual Budget Tracker */}
          <div className="mt-8">
            <BudgetTracker />
          </div>

          {/* Weather Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Weather Forecast</h2>
            <WeatherWidget 
              city={userProfile.city}
              eventDate={upcomingEventDate}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
