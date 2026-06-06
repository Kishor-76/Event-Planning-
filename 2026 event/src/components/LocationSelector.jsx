import { useState } from 'react'
import { MapPin, ChevronDown, Check } from 'lucide-react'

// Sample data: 4 Indian states with their respective cities
const INDIA_LOCATIONS = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Aurangabad', 'Nashik', 'Kolhapur'],
  'Delhi': ['New Delhi', 'Old Delhi', 'Dwarka', 'Rohini'],
  'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum', 'Udupi'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Trichy', 'Kanyakumari'],
}

export default function LocationSelector({ onLocationChange, initialState = '', initialCity = '' }) {
  const [selectedState, setSelectedState] = useState(initialState)
  const [selectedCity, setSelectedCity] = useState(initialCity)
  const [isStateOpen, setIsStateOpen] = useState(false)
  const [isCityOpen, setIsCityOpen] = useState(false)

  const states = Object.keys(INDIA_LOCATIONS)
  const cities = selectedState ? INDIA_LOCATIONS[selectedState] : []

  const handleStateSelect = (state) => {
    setSelectedState(state)
    setSelectedCity('') // Reset city when state changes
    setIsStateOpen(false)
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
            selectedState
              ? 'bg-gradient-to-r from-rose-500 to-purple-500 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}>
            {selectedState ? <Check size={20} /> : '1'}
          </div>
          <span className="text-sm font-medium text-gray-700">State</span>
        </div>

        {/* Connector */}
        <div className={`flex-1 h-1 rounded-full transition-all ${
          selectedState ? 'bg-gradient-to-r from-rose-500 to-purple-500' : 'bg-gray-200'
        }`} />

        {/* Step 2 */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold transition-all ${
            selectedCity
              ? 'bg-gradient-to-r from-rose-500 to-purple-500 text-white'
              : selectedState
              ? 'bg-gray-300 text-gray-600'
              : 'bg-gray-200 text-gray-500'
          }`}>
            {selectedCity ? <Check size={20} /> : '2'}
          </div>
          <span className={`text-sm font-medium ${
            selectedState ? 'text-gray-700' : 'text-gray-400'
          }`}>City</span>
        </div>
      </div>

      {/* State Selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <MapPin size={18} className="text-rose-500" />
          Select Your State
        </label>
        <div className="relative">
          <button
            onClick={() => setIsStateOpen(!isStateOpen)}
            className={`w-full px-6 py-4 text-left rounded-2xl border-2 transition-all flex items-center justify-between font-medium ${
              isStateOpen
                ? 'border-rose-500 bg-rose-50'
                : selectedState
                ? 'border-rose-300 bg-white'
                : 'border-gray-200 bg-white hover:border-rose-200'
            }`}
          >
            <span className={selectedState ? 'text-gray-900' : 'text-gray-500'}>
              {selectedState || 'Choose a state...'}
            </span>
            <ChevronDown
              size={20}
              className={`transition-transform ${isStateOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isStateOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-rose-200 rounded-2xl shadow-xl z-10">
              {states.map((state) => (
                <button
                  key={state}
                  onClick={() => handleStateSelect(state)}
                  className={`w-full text-left px-6 py-3 transition-all border-b last:border-b-0 hover:bg-rose-50 font-medium ${
                    selectedState === state
                      ? 'bg-rose-100 text-rose-700'
                      : 'text-gray-700'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* City Selector */}
      {selectedState && (
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
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-purple-200 rounded-2xl shadow-xl z-10">
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
      {selectedState && selectedCity && (
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
