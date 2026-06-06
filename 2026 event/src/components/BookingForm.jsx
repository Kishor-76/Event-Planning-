import { useState, useContext } from 'react'
import { Calendar, MapPin, Users, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { fetchJSON, API_BASE } from '../utils/api'

const STEPS = [
  { id: 1, title: 'Select Date', icon: Calendar },
  { id: 2, title: 'Choose Venue', icon: MapPin },
  { id: 3, title: 'Guest Count', icon: Users },
]

const VENUES = [
  { id: 1, name: 'Grand Hyatt Mumbai', capacity: 500 },
  { id: 2, name: 'Taj Palace Delhi', capacity: 400 },
  { id: 3, name: 'The Oberoi Bangalore', capacity: 300 },
  { id: 4, name: 'Leela Palace Udaipur', capacity: 250 },
]

export default function BookingForm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const eventId = searchParams.get('event')

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    date: '',
    venue: '',
    guests: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateForm = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }))

  const canProceed = () => {
    if (currentStep === 1) return formData.date
    if (currentStep === 2) return formData.venue
    if (currentStep === 3) return formData.guests
    return false
  }

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      setLoading(true)
      setError('')
      try {
        const payload = {
          date: formData.date,
          venue: formData.venue,
          guests: Number(formData.guests),
          name: user?.name || 'Anonymous User',
          email: user?.email || '',
        }

        if (eventId) {
          payload.event = eventId
        }

        await fetchJSON(`${API_BASE}/api/bookings`, {
          method: 'POST',
          body: JSON.stringify(payload),
        })

        alert('Booking submitted successfully!')
        navigate('/profile')
      } catch (err) {
        setError(err.message || 'Failed to submit booking. Make sure the backend server is running.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-12">
        {STEPS.map((step, index) => {
          const Icon = step.icon
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div
                className={`flex flex-col items-center transition-all duration-500 ${
                  isActive ? 'scale-110' : ''
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-rose-500 text-white'
                      : isActive
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? <Check size={24} /> : <Icon size={24} />}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    isActive ? 'text-rose-500' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${
                    isCompleted ? 'bg-rose-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl border border-white/50">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold">
            {error}
          </div>
        )}

        {currentStep === 1 && (
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">When is your event?</h3>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => updateForm('date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose your venue</h3>
            <div className="space-y-3">
              {VENUES.map((venue) => (
                <button
                  key={venue.id}
                  onClick={() => updateForm('venue', venue.name)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    formData.venue === venue.name
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 hover:border-rose-200'
                  }`}
                >
                  <span className="font-medium">{venue.name}</span>
                  <span className="text-sm text-gray-500">Up to {venue.capacity} guests</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">How many guests?</h3>
            <input
              type="number"
              min="10"
              max="1000"
              placeholder="Enter guest count"
              value={formData.guests}
              onChange={(e) => updateForm('guests', e.target.value)}
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-10">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1 || loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-100"
          >
            <ChevronLeft size={20} /> Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed() || loading}
            className="flex items-center gap-2 px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-rose-500/30"
          >
            {loading ? 'Submitting...' : (currentStep === 3 ? 'Submit' : 'Next')} <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
