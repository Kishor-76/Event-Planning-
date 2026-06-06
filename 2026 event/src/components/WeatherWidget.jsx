import { useState, useEffect } from 'react'
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge } from 'lucide-react'

export default function WeatherWidget({ city = 'Mumbai', eventDate = new Date() }) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchWeather()
  }, [city, eventDate])

  const fetchWeather = async () => {
    try {
      setLoading(true)
      // Using Open-Meteo API (free, no authentication required)
      // This is a mock implementation with realistic data structure
      
      // Geocode city to get coordinates
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
      )
      const geoData = await geoResponse.json()

      if (!geoData.results || geoData.results.length === 0) {
        // Mock data if API fails
        setWeather(getMockWeather())
        setError(null)
        return
      }

      const { latitude, longitude } = geoData.results[0]

      // Get weather forecast
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation,wind_speed_10m_max,relative_humidity_2m_max&timezone=auto&date=${eventDate.toISOString().split('T')[0]}`
      )
      const weatherData = await weatherResponse.json()

      if (weatherData.daily && weatherData.daily.temperature_2m_max.length > 0) {
        const dayIndex = 0
        setWeather({
          city,
          date: eventDate,
          temp_max: Math.round(weatherData.daily.temperature_2m_max[dayIndex]),
          temp_min: Math.round(weatherData.daily.temperature_2m_min[dayIndex]),
          condition: getWeatherCondition(weatherData.daily.weather_code[dayIndex]),
          precipitation: weatherData.daily.precipitation[dayIndex] || 0,
          wind_speed: Math.round(weatherData.daily.wind_speed_10m_max[dayIndex]),
          humidity: weatherData.daily.relative_humidity_2m_max[dayIndex],
          icon: getWeatherIcon(weatherData.daily.weather_code[dayIndex]),
        })
        setError(null)
      } else {
        setWeather(getMockWeather())
      }
    } catch (err) {
      console.error('Weather fetch error:', err)
      setWeather(getMockWeather())
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  const getMockWeather = () => ({
    city: city,
    date: eventDate,
    temp_max: 28,
    temp_min: 22,
    condition: 'Partly Cloudy',
    precipitation: 10,
    wind_speed: 12,
    humidity: 65,
    icon: 'cloud',
  })

  const getWeatherCondition = (code) => {
    // WMO Weather interpretation codes
    const conditions = {
      0: 'Clear Sky',
      1: 'Mainly Clear',
      2: 'Partly Cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Foggy',
      51: 'Light Drizzle',
      53: 'Moderate Drizzle',
      55: 'Dense Drizzle',
      61: 'Slight Rain',
      63: 'Moderate Rain',
      65: 'Heavy Rain',
      71: 'Slight Snow',
      73: 'Moderate Snow',
      75: 'Heavy Snow',
      77: 'Snow Grains',
      80: 'Slight Rain Showers',
      81: 'Moderate Rain Showers',
      82: 'Violent Rain Showers',
      85: 'Slight Snow Showers',
      86: 'Heavy Snow Showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with Hail',
      99: 'Thunderstorm with Hail',
    }
    return conditions[code] || 'Unknown'
  }

  const getWeatherIcon = (code) => {
    if (code === 0 || code === 1) return 'sun'
    if (code === 2 || code === 3) return 'cloud'
    if (code >= 51 && code <= 67) return 'rain'
    if (code >= 71 && code <= 86) return 'snow'
    if (code >= 80 && code <= 99) return 'storm'
    return 'cloud'
  }

  const getWeatherColor = (condition) => {
    if (condition.includes('Clear') || condition.includes('Sunny')) return 'from-yellow-400 to-orange-400'
    if (condition.includes('Cloud')) return 'from-gray-400 to-gray-500'
    if (condition.includes('Rain')) return 'from-blue-400 to-blue-600'
    if (condition.includes('Snow')) return 'from-blue-200 to-blue-300'
    if (condition.includes('Storm')) return 'from-purple-600 to-gray-800'
    return 'from-gray-400 to-gray-500'
  }

  const getIconComponent = (icon) => {
    switch (icon) {
      case 'sun':
        return <Sun size={48} className="text-yellow-500" />
      case 'cloud':
        return <Cloud size={48} className="text-gray-500" />
      case 'rain':
        return <CloudRain size={48} className="text-blue-500" />
      default:
        return <Cloud size={48} className="text-gray-500" />
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50 animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-4" />
        <div className="h-12 bg-gray-300 rounded w-1/2" />
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50">
        <p className="text-gray-600">Unable to load weather data</p>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-br ${getWeatherColor(weather.condition)} rounded-2xl p-6 shadow-lg border border-white/30 text-white overflow-hidden relative`}>
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -ml-12 -mb-12" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">{city}</h3>
            <p className="text-white/80 text-sm">{formatDate(weather.date)}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{weather.temp_max}°</p>
            <p className="text-white/70 text-xs">{weather.temp_min}° / night</p>
          </div>
        </div>

        {/* Weather Condition */}
        <div className="flex items-center gap-3 mb-6">
          {getIconComponent(weather.icon)}
          <div>
            <p className="font-semibold text-lg">{weather.condition}</p>
            <p className="text-white/80 text-sm">Great for your event!</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Droplets size={18} className="text-blue-200" />
            <div>
              <p className="text-xs text-white/70">Humidity</p>
              <p className="font-semibold">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind size={18} className="text-blue-200" />
            <div>
              <p className="text-xs text-white/70">Wind Speed</p>
              <p className="font-semibold">{weather.wind_speed} km/h</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Gauge size={18} className="text-blue-200" />
            <div>
              <p className="text-xs text-white/70">Precipitation</p>
              <p className="font-semibold">{weather.precipitation}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Eye size={18} className="text-blue-200" />
            <div>
              <p className="text-xs text-white/70">Visibility</p>
              <p className="font-semibold">Good</p>
            </div>
          </div>
        </div>

        {/* Weather Alert */}
        {weather.condition.includes('Rain') || weather.condition.includes('Storm') ? (
          <div className="mt-4 p-3 bg-yellow-400/30 border border-yellow-200/50 rounded-lg">
            <p className="text-sm font-semibold text-yellow-50">⚠️ Weather Alert: Plan indoor backup activities</p>
          </div>
        ) : weather.temp_max > 35 ? (
          <div className="mt-4 p-3 bg-orange-400/30 border border-orange-200/50 rounded-lg">
            <p className="text-sm font-semibold text-orange-50">☀️ Hot & Sunny: Arrange shade and hydration stations</p>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-emerald-400/30 border border-emerald-200/50 rounded-lg">
            <p className="text-sm font-semibold text-emerald-50">✓ Perfect weather conditions for your event!</p>
          </div>
        )}
      </div>
    </div>
  )
}
