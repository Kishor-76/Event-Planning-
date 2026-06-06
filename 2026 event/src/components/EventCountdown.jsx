import { useState, useEffect } from 'react'
import { Calendar, Clock, Zap } from 'lucide-react'

export default function EventCountdown({ eventDate, eventTitle = 'Upcoming Event' }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date(eventDate).getTime()
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        })
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          isExpired: false,
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [eventDate])

  const CountdownBox = ({ value, label, isActive }) => (
    <div className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all transform ${
      isActive
        ? 'bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-500/50 scale-105'
        : 'bg-gradient-to-br from-gray-200 to-gray-300'
    }`}>
      <span className={`text-3xl md:text-4xl font-bold transition-all ${
        isActive ? 'text-white' : 'text-gray-600'
      }`}>
        {String(value).padStart(2, '0')}
      </span>
      <span className={`text-xs md:text-sm font-semibold mt-1 transition-all ${
        isActive ? 'text-white/90' : 'text-gray-600'
      }`}>
        {label}
      </span>
    </div>
  )

  if (timeLeft.isExpired) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 shadow-xl border-2 border-amber-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
            <Calendar size={32} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-amber-900">Event is Live!</h3>
            <p className="text-amber-700 font-medium">Your event has started. Enjoy the celebration!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-purple-500 flex items-center justify-center shadow-lg animate-pulse">
            <Zap size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">{eventTitle}</h3>
            <p className="text-sm text-gray-600">Countdown to your event</p>
          </div>
        </div>
      </div>

      {/* Main Countdown Card */}
      <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60 overflow-hidden relative">
        {/* Animated Background Effect */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Countdown Boxes */}
        <div className="grid grid-cols-4 gap-2 md:gap-4 mb-8">
          <CountdownBox value={timeLeft.days} label="Days" isActive={timeLeft.days > 0} />
          <CountdownBox value={timeLeft.hours} label="Hours" isActive={timeLeft.hours > 0 || timeLeft.days > 0} />
          <CountdownBox value={timeLeft.minutes} label="Minutes" isActive={timeLeft.minutes > 0 || timeLeft.hours > 0} />
          <CountdownBox value={timeLeft.seconds} label="Seconds" isActive={true} />
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Time Remaining</p>
            <p className="text-xs font-medium text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 shadow-lg"
              style={{
                width: `${Math.max(1, ((24 * 60 - (timeLeft.days * 24 * 60 + timeLeft.hours * 60 + timeLeft.minutes)) / (24 * 60)) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-4 border border-white/50">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={20} className="text-rose-500" />
            <span className="text-sm font-semibold text-gray-700">Event Date</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {new Date(eventDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-4 border border-white/50">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={20} className="text-purple-500" />
            <span className="text-sm font-semibold text-gray-700">Event Time</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {new Date(eventDate).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </p>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-rose-100 to-purple-100 rounded-2xl p-4 border border-rose-200">
        <p className="text-sm font-medium text-rose-900">
          ✨ Get ready! Your event is coming soon. Make sure everything is prepared.
        </p>
      </div>
    </div>
  )
}
