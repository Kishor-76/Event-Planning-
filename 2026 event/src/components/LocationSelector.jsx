import { useState, useEffect } from 'react'
import { MapPin, ChevronDown, Check } from 'lucide-react'

// Sample data: 10 Indian states with their respective cities
const INDIA_LOCATIONS = {
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

export default function LocationSelector({ onLocationChange, initialState = '', initialCity = '' }) {
  const [selectedState, setSelectedState] = useState(initialState)
  const [selectedCity, setSelectedCity] = useState(initialCity)
  const [isCityOpen, setIsCityOpen] = useState(false)

  useEffect(() => {
    setSelectedState(initialState)
    setSelectedCity(initialCity)
  }, [initialState, initialCity])

  const matchedKey = Object.keys(INDIA_LOCATIONS).find(
    key => key.toLowerCase() === selectedState.trim().toLowerCase()
  )
  const cities = matchedKey ? INDIA_LOCATIONS[matchedKey] : []

  const handleStateChange = (state) => {
    setSelectedState(state)
    setSelectedCity('') // Reset city when state changes
    onLocationChange?.(state, '')
  }

  const handleCitySelect = (city) => {
    setSelectedCity(city)
    setIsCityOpen(false)
    onLocationChange?.(selectedState, city)
  }

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-4">
        {/* Step 1 */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold transition-all ${
            selectedState.trim()
              ? 'bg-gradient-to-r from-rose-500 to-purple-500 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}>
            {selectedState.trim() ? <Check size={20} /> : '1'}
          </div>
          <span className="text-sm font-medium text-gray-700">State</span>
        </div>

        {/* Connector */}
        <div className={`flex-1 h-1 rounded-full transition-all ${
          selectedState.trim() ? 'bg-gradient-to-r from-rose-500 to-purple-500' : 'bg-gray-200'
        }`} />

        {/* Step 2 */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold transition-all ${
            selectedCity
              ? 'bg-gradient-to-r from-rose-500 to-purple-500 text-white'
              : selectedState.trim()
              ? 'bg-gray-300 text-gray-600'
              : 'bg-gray-200 text-gray-500'
          }`}>
            {selectedCity ? <Check size={20} /> : '2'}
          </div>
          <span className={`text-sm font-medium ${
            selectedState.trim() ? 'text-gray-700' : 'text-gray-400'
          }`}>City</span>
        </div>
      </div>

      {/* State Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <MapPin size={18} className="text-rose-500" />
          Type Your State
        </label>
        <div className="relative">
          <input
            type="text"
            list="states-list"
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            placeholder="Type your state (e.g. Delhi, Maharashtra...)"
            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all font-medium text-gray-900"
          />
          <datalist id="states-list">
            {Object.keys(INDIA_LOCATIONS).map((state) => (
              <option key={state} value={state} />
            ))}
          </datalist>
        </div>
      </div>

      {/* City Selector */}
      {selectedState.trim() && cities.length > 0 && (
        <div className="animate-fade-in">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <MapPin size={18} className="text-purple-500" />
            Select Your City
          </label>
          <div className="relative">
            <button
              onClick={() => setIsCityOpen(!isCityOpen)}
              className={`w-full px-6 py-4 text-left rounded-2xl border-2 transition-all flex items-center justify-between font-medium ${
                isCityOpen
                  ? 'border-purple-500 bg-purple-50'
                  : selectedCity
                  ? 'border-purple-300 bg-white'
                  : 'border-gray-200 bg-white hover:border-purple-200'
              }`}
            >
              <span className={selectedCity ? 'text-gray-900' : 'text-gray-500'}>
                {selectedCity || 'Choose a city...'}
              </span>
              <ChevronDown
                size={20}
                className={`transition-transform ${isCityOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isCityOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-purple-200 rounded-2xl shadow-xl z-10 max-h-60 overflow-y-auto">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    className={`w-full text-left px-6 py-3 transition-all border-b last:border-b-0 hover:bg-purple-50 font-medium ${
                      selectedCity === city
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-700'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedCity && (
            <div className="mt-4 p-4 bg-gradient-to-r from-rose-50 to-purple-50 rounded-2xl border border-rose-200 animate-fade-in">
              <p className="text-sm font-medium text-gray-700">
                ✓ You have selected <span className="font-bold text-rose-600">{selectedCity}, {selectedState}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Display Selected Location */}
      {selectedState.trim() && selectedCity && (
        <div className="p-6 bg-white/40 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-purple-500 flex items-center justify-center shadow-lg">
              <MapPin size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Your Location</p>
              <p className="text-lg font-bold text-gray-900">{selectedCity}, {selectedState}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
