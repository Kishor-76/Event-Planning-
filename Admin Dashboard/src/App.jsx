import { useState, useEffect } from 'react'
import { fetchJSON, API_BASE } from './utils/api'
import { 
  Users, 
  Calendar, 
  Activity, 
  Search, 
  Filter, 
  UserCheck, 
  Clock,
  RefreshCw,
  LogOut,
  LogIn,
  UserPlus,
  Lock
} from 'lucide-react'

// Custom SVG Area Chart Component
function AreaChart({ title, data, colorClass = "rose", valueFormatter = (v) => v }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)
  
  if (!data || data.length === 0) return null

  const values = data.map(d => d.value)
  const maxVal = Math.max(...values, 1)
  const minVal = Math.min(...values, 0)
  const valRange = maxVal - minVal

  const width = 500
  const height = 180

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((d.value - minVal) / valRange) * height
    return { x, y, label: d.label, value: d.value }
  })

  // Smooth bezier curve path generator
  const getBezierPath = (pts) => {
    const line = (pointA, pointB) => {
      const lengthX = pointB.x - pointA.x
      const lengthY = pointB.y - pointA.y
      return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
      }
    }

    const controlPoint = (current, previous, next, reverse) => {
      const p = previous || current
      const n = next || current
      const smoothing = 0.15
      const o = line(p, n)
      const angle = o.angle + (reverse ? Math.PI : 0)
      const length = o.length * smoothing
      const x = current.x + Math.cos(angle) * length
      const y = current.y + Math.sin(angle) * length
      return [x, y]
    }

    let path = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 1; i < pts.length; i++) {
      const point = pts[i]
      const [cpsX, cpsY] = controlPoint(pts[i - 1], pts[i - 2], point, false)
      const [cpeX, cpeY] = controlPoint(point, pts[i - 1], pts[i + 1], true)
      path += ` C ${cpsX} ${cpsY}, ${cpeX} ${cpeY}, ${point.x} ${point.y}`
    }
    return path
  }

  const linePath = getBezierPath(points)
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`

  const themes = {
    rose: {
      stroke: '#f43f5e',
      gradientStart: 'rgba(244, 63, 94, 0.22)',
      gradientStop: 'rgba(244, 63, 94, 0.0)',
      dotColor: '#be123c'
    },
    emerald: {
      stroke: '#10b981',
      gradientStart: 'rgba(16, 185, 129, 0.22)',
      gradientStop: 'rgba(16, 185, 129, 0.0)',
      dotColor: '#047857'
    },
    amber: {
      stroke: '#f59e0b',
      gradientStart: 'rgba(245, 158, 11, 0.22)',
      gradientStop: 'rgba(245, 158, 11, 0.0)',
      dotColor: '#b45309'
    }
  }

  const theme = themes[colorClass] || themes.rose
  const gradId = `area-grad-${title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`

  const yTicks = [maxVal, minVal + valRange / 2, minVal]
  const xTickIndices = [0, Math.floor(data.length / 3), Math.floor((2 * data.length) / 3), data.length - 1]

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-gray-100 rounded-3xl p-6 shadow-lg relative flex flex-col flex-1 min-w-[300px] transition-all hover:shadow-xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</h4>
          <h3 className="text-2xl font-extrabold text-gray-900 mt-1">
            {valueFormatter(hoveredIdx !== null ? data[hoveredIdx].value : data[data.length - 1].value)}
          </h3>
          <p className="text-gray-400 text-[10px] mt-0.5 font-medium">
            {hoveredIdx !== null ? data[hoveredIdx].label : "As of today"}
          </p>
        </div>
        {hoveredIdx !== null && (
          <span className="text-[10px] px-2.5 py-1 bg-rose-50 border border-rose-100 text-rose-600 rounded-full font-semibold">
            Interactive
          </span>
        )}
      </div>

      <div className="flex gap-4 items-stretch h-[160px]">
        {/* HTML Y-Axis Labels */}
        <div className="flex flex-col justify-between text-[10px] font-mono text-gray-400 w-12 text-right pr-2 select-none">
          {yTicks.map((tick, i) => (
            <span key={i} className="leading-none">
              {valueFormatter(Math.round(tick)).split(' ')[0]}
            </span>
          ))}
        </div>

        {/* SVG Canvas */}
        <div className="relative flex-grow h-full">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.gradientStart} />
                <stop offset="100%" stopColor={theme.gradientStop} />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.5, 1].map((ratio, i) => (
              <line
                key={i}
                x1="0"
                y1={ratio * height}
                x2={width}
                y2={ratio * height}
                stroke="#f3f4f6"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}

            <path d={areaPath} fill={`url(#${gradId})`} />
            <path d={linePath} fill="none" stroke={theme.stroke} strokeWidth="2.5" strokeLinecap="round" />

            {hoveredIdx !== null && points[hoveredIdx] && (
              <>
                <line
                  x1={points[hoveredIdx].x}
                  y1="0"
                  x2={points[hoveredIdx].x}
                  y2={height}
                  stroke={theme.stroke}
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                  opacity="0.6"
                />
                <circle
                  cx={points[hoveredIdx].x}
                  cy={points[hoveredIdx].y}
                  r="7"
                  fill={theme.stroke}
                  opacity="0.2"
                  className="animate-ping"
                />
                <circle
                  cx={points[hoveredIdx].x}
                  cy={points[hoveredIdx].y}
                  r="4.5"
                  fill={theme.dotColor}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </>
            )}

            {points.map((p, idxVal) => {
              const sliceWidth = width / (data.length - 1)
              const hoverX = p.x - sliceWidth / 2
              return (
                <rect
                  key={idxVal}
                  x={hoverX}
                  y="0"
                  width={sliceWidth}
                  height={height}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idxVal)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              )
            })}
          </svg>
        </div>
      </div>

      {/* HTML X-Axis Labels */}
      <div className="flex justify-between pl-16 text-[9px] font-semibold text-gray-400 mt-2 select-none">
        {xTickIndices.map((idxVal) => {
          if (!data[idxVal]) return null
          return (
            <span key={idxVal}>
              {data[idxVal].label.split(',')[0]}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// Custom SVG Bar Chart Component
function BarChart({ title, data, colorClass = "blue", valueFormatter = (v) => v }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  if (!data || data.length === 0) return null

  const values = data.map(d => d.value)
  const maxVal = Math.max(...values, 2)

  const width = 500
  const height = 180
  const barWidth = (width / data.length) * 0.65
  const barGap = (width / data.length) * 0.35

  const themes = {
    blue: {
      fill: 'url(#blue-bar-grad-new)',
      hoverFill: 'url(#blue-bar-hover-grad-new)'
    },
    amber: {
      fill: 'url(#amber-bar-grad-new)',
      hoverFill: 'url(#amber-bar-hover-grad-new)'
    },
    rose: {
      fill: 'url(#rose-bar-grad-new)',
      hoverFill: 'url(#rose-bar-hover-grad-new)'
    }
  }

  const theme = themes[colorClass] || themes.blue

  const yTicks = [maxVal, Math.ceil(maxVal / 2), 0]
  const xTickIndices = [0, Math.floor(data.length / 3), Math.floor((2 * data.length) / 3), data.length - 1]

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-gray-100 rounded-3xl p-6 shadow-lg relative flex flex-col flex-1 min-w-[300px] transition-all hover:shadow-xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</h4>
          <h3 className="text-2xl font-extrabold text-gray-900 mt-1">
            {valueFormatter(hoveredIdx !== null ? data[hoveredIdx].value : data.reduce((sum, d) => sum + d.value, 0))}
          </h3>
          <p className="text-gray-400 text-[10px] mt-0.5 font-medium">
            {hoveredIdx !== null ? data[hoveredIdx].label : "Total last 30 days"}
          </p>
        </div>
        {hoveredIdx !== null && (
          <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border ${
            colorClass === 'rose'
              ? 'bg-rose-50 border-rose-100 text-rose-600'
              : colorClass === 'amber'
                ? 'bg-amber-50 border-amber-100 text-amber-600'
                : 'bg-blue-50 border-blue-100 text-blue-600'
          }`}>
            Interactive
          </span>
        )}
      </div>

      <div className="flex gap-4 items-stretch h-[160px]">
        {/* HTML Y-Axis Labels */}
        <div className="flex flex-col justify-between text-[10px] font-mono text-gray-400 w-12 text-right pr-2 select-none">
          {yTicks.map((tick, i) => (
            <span key={i} className="leading-none">
              {valueFormatter(Math.round(tick)).split(' ')[0]}
            </span>
          ))}
        </div>

        {/* SVG Canvas */}
        <div className="relative flex-grow h-full">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="blue-bar-grad-new" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
              <linearGradient id="blue-bar-hover-grad-new" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>

              <linearGradient id="amber-bar-grad-new" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="amber-bar-hover-grad-new" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>

              <linearGradient id="rose-bar-grad-new" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
              <linearGradient id="rose-bar-hover-grad-new" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fda4af" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.5, 1].map((ratio, i) => (
              <line
                key={i}
                x1="0"
                y1={ratio * height}
                x2={width}
                y2={ratio * height}
                stroke="#f3f4f6"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}

            {/* Render Bars */}
            {data.map((d, i) => {
              const x = i * (barWidth + barGap) + barGap / 2
              const barHeight = (d.value / maxVal) * height
              const y = height - barHeight

              return (
                <g key={i}>
                  {d.value > 0 && (
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="3"
                      fill={hoveredIdx === i ? theme.hoverFill : theme.fill}
                      className="transition-all duration-200"
                    />
                  )}

                  <rect
                    x={x - barGap / 2}
                    y="0"
                    width={barWidth + barGap}
                    height={height}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* HTML X-Axis Labels */}
      <div className="flex justify-between pl-16 text-[9px] font-semibold text-gray-400 mt-2 select-none">
        {xTickIndices.map((idxVal) => {
          if (idxVal >= data.length) return null
          return (
            <span key={idxVal}>
              {data[idxVal].label.split(',')[0]}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// Data helper functions
const getLast30Days = () => {
  const days = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

const getUserGrowthData = (data) => {
  const days = getLast30Days()
  const realCounts = {}
  days.forEach(day => { realCounts[day] = 0 })
  let realTotal = 0
  
  const hasRealData = data.users && data.users.length > 0
  if (hasRealData) {
    data.users.forEach(u => {
      if (u.createdAt) {
        const dateStr = u.createdAt.split('T')[0]
        if (realCounts[dateStr] !== undefined) {
          realCounts[dateStr]++
        }
      }
    })
    
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 29)
    cutoffDate.setHours(0,0,0,0)
    data.users.forEach(u => {
      if (u.createdAt) {
        const uDate = new Date(u.createdAt)
        if (uDate < cutoffDate) {
          realTotal++
        }
      }
    })
  }

  let cumulative = hasRealData ? realTotal : 12
  
  return days.map((day, idx) => {
    let count = 0
    if (hasRealData) {
      cumulative += realCounts[day]
      count = cumulative
    } else {
      const increment = Math.floor(idx / 8) + (idx % 3 === 0 ? 1 : 0) + (idx % 7 === 0 ? 2 : 0)
      cumulative += increment
      count = cumulative
    }
    return {
      label: new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: count
    }
  })
}

const getBookingTrendData = (data) => {
  const days = getLast30Days()
  const realCounts = {}
  days.forEach(day => { realCounts[day] = 0 })
  
  const hasRealData = data.bookings && data.bookings.length > 0
  if (hasRealData) {
    data.bookings.forEach(b => {
      const dateSrc = b.createdAt || b.date
      if (dateSrc) {
        const dateStr = dateSrc.split('T')[0]
        if (realCounts[dateStr] !== undefined) {
          realCounts[dateStr]++
        }
      }
    })
  }

  return days.map((day, idx) => {
    let value = 0
    if (hasRealData) {
      value = realCounts[day]
    } else {
      const d = new Date(day)
      const isWeekend = d.getDay() === 0 || d.getDay() === 6
      value = isWeekend ? (3 + (idx % 3)) : (idx % 4 === 0 ? 1 : 0)
    }
    return {
      label: new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: value
    }
  })
}

const getLoginActivityData = (data) => {
  const days = getLast30Days()
  const realCounts = {}
  days.forEach(day => { realCounts[day] = 0 })
  
  const hasRealData = data.logs && data.logs.filter(l => l && l.action === 'LOGIN').length > 0
  if (hasRealData) {
    data.logs.forEach(log => {
      if (log && log.action === 'LOGIN' && log.timestamp) {
        const dateStr = log.timestamp.split('T')[0]
        if (realCounts[dateStr] !== undefined) {
          realCounts[dateStr]++
        }
      }
    })
  }

  return days.map((day, idx) => {
    let value = 0
    if (hasRealData) {
      value = realCounts[day]
    } else {
      const d = new Date(day)
      const isWeekend = d.getDay() === 0 || d.getDay() === 6
      value = isWeekend ? (2 + (idx % 2)) : (5 + (idx % 4) + (idx % 9 === 0 ? 3 : 0))
    }
    return {
      label: new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: value
    }
  })
}

const getRevenueForBooking = (b) => {
  const category = (b.event && b.event.category || '').toLowerCase()
  const guests = b.guests || 0
  let basePrice = 35000
  let perGuestPrice = 400

  if (category.includes('wedding')) {
    basePrice = 150000
    perGuestPrice = 1000
  } else if (category.includes('birthday')) {
    basePrice = 20000
    perGuestPrice = 300
  } else if (category.includes('corporate') || category.includes('seminar') || category.includes('conference')) {
    basePrice = 75000
    perGuestPrice = 500
  }

  return basePrice + (guests * perGuestPrice)
}

const getRevenueTrendData = (data) => {
  const days = getLast30Days()
  const realAmounts = {}
  days.forEach(day => { realAmounts[day] = 0 })
  
  let realTotal = 0
  const hasRealData = data.bookings && data.bookings.filter(b => b.status === 'confirmed').length > 0
  
  if (hasRealData) {
    data.bookings.forEach(b => {
      if (b.status === 'confirmed') {
        const dateSrc = b.createdAt || b.date
        if (dateSrc) {
          const dateStr = dateSrc.split('T')[0]
          if (realAmounts[dateStr] !== undefined) {
            realAmounts[dateStr] += getRevenueForBooking(b)
          }
        }
      }
    })

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 29)
    cutoffDate.setHours(0,0,0,0)
    data.bookings.forEach(b => {
      if (b.status === 'confirmed' && (b.createdAt || b.date)) {
        const bDate = new Date(b.createdAt || b.date)
        if (bDate < cutoffDate) {
          realTotal += getRevenueForBooking(b)
        }
      }
    })
  }

  let cumulative = hasRealData ? realTotal : 150000

  return days.map((day, idx) => {
    let amount = 0
    if (hasRealData) {
      cumulative += realAmounts[day]
      amount = cumulative
    } else {
      const dailyEarn = idx % 4 === 0 ? (15000 + (idx * 500)) : 0
      cumulative += dailyEarn
      amount = cumulative
    }
    return {
      label: new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: amount
    }
  })
}

export default function App() {
  const [authorized, setAuthorized] = useState(false)
  const [pin, setPin] = useState(['', '', '', ''])
  const [pinError, setPinError] = useState('')

  const [data, setData] = useState({ logs: [], bookings: [], users: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('users') // 'users', 'bookings', 'logs'
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState('ALL')

  const fetchDashboardData = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetchJSON(`${API_BASE}/api/admin/dashboard-details`)
      setData(response)
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authorized) {
      fetchDashboardData()
    }
  }, [authorized])

  // Monitor PIN entry for automatic submission when 4 digits are completed
  useEffect(() => {
    const pinStr = pin.join('')
    if (pinStr.length === 4) {
      if (pinStr === '0312') {
        setAuthorized(true)
      } else {
        setPinError('Incorrect passcode. Access denied.')
        setPin(['', '', '', ''])
        const firstInput = document.getElementById('pin-0')
        if (firstInput) firstInput.focus()
      }
    }
  }, [pin])

  const handlePinChange = (index, value) => {
    if (isNaN(value)) return
    const newPin = [...pin]
    newPin[index] = value.substring(value.length - 1)
    setPin(newPin)
    setPinError('')

    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
        const newPin = [...pin]
        newPin[index - 1] = ''
        setPin(newPin)
      }
    }
  }

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData('text').trim()
    if (pasteData.length === 4 && !isNaN(pasteData)) {
      setPin(pasteData.split(''))
    }
  }

  const handlePinSubmit = (e) => {
    if (e) e.preventDefault()
    const pinStr = pin.join('')
    if (pinStr === '0312') {
      setAuthorized(true)
    } else {
      setPinError('Incorrect passcode. Access denied.')
      setPin(['', '', '', ''])
      const firstInput = document.getElementById('pin-0')
      if (firstInput) firstInput.focus()
    }
  }

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 px-4">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/85 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/25 mb-6">
            <Lock size={28} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Admin Security Check</h2>
          <p className="text-gray-500 text-sm mt-2 mb-8">Enter the 4-digit security code to access the Eventify Admin Panel.</p>

          <form onSubmit={handlePinSubmit} className="w-full space-y-6">
            <div className="flex justify-center gap-4">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-14 h-16 text-center text-2xl font-bold bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all shadow-inner"
                  autoFocus={index === 0}
                  autoComplete="off"
                />
              ))}
            </div>

            {pinError && (
              <p className="text-sm font-semibold text-rose-600 animate-pulse mt-4">{pinError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-rose-500/20 active:scale-[0.98] transition-all cursor-pointer mt-4"
            >
              Verify Passcode
            </button>
          </form>
          
          <a 
            href="http://localhost:5173" 
            className="mt-8 text-sm font-semibold text-gray-500 hover:text-rose-500 transition-colors"
          >
            Return to Main Site
          </a>
        </div>
      </div>
    )
  }

  // Filter logs based on search query and action type
  const filteredLogs = (data.logs || []).filter(log => {
    if (!log) return false
    const matchesSearch = 
      (log.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.userEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter
    return matchesSearch && matchesAction
  })

  // Filter bookings based on search query
  const filteredBookings = (data.bookings || []).filter(booking => {
    if (!booking) return false
    return (
      (booking.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.venue || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      ((booking.event && booking.event.title) || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Filter users based on search query
  const filteredUsers = (data.users || []).filter(user => {
    if (!user) return false
    return (
      (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Format date to local readable format
  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // Get action icons & styles
  const getActionBadge = (action) => {
    const base = "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider "
    switch (action) {
      case 'LOGIN':
        return (
          <span className={base + "bg-emerald-50 text-emerald-700 border border-emerald-200"}>
            <LogIn size={12} /> Login
          </span>
        )
      case 'LOGOUT':
        return (
          <span className={base + "bg-slate-100 text-slate-700 border border-slate-200"}>
            <LogOut size={12} /> Logout
          </span>
        )
      case 'REGISTER':
        return (
          <span className={base + "bg-blue-50 text-blue-700 border border-blue-200"}>
            <UserPlus size={12} /> Register
          </span>
        )
      case 'CREATE_BOOKING':
        return (
          <span className={base + "bg-rose-50 text-rose-700 border border-rose-200"}>
            <Calendar size={12} /> Booking
          </span>
        )
      default:
        return (
          <span className={base + "bg-gray-100 text-gray-700 border border-gray-200"}>
            <Activity size={12} /> {action}
          </span>
        )
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl shadow-md border-b border-gray-100 h-16 md:h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-rose-500">Eventify</span>
            <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-600 rounded-full text-xs font-bold uppercase tracking-wider">
              Admin
            </span>
          </div>
          <a 
            href="http://localhost:5173" 
            className="px-5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-rose-400 hover:text-rose-500 transition-all flex items-center gap-2"
          >
            Go to Main Site
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          
          {/* Header Title section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                Admin <span className="text-rose-500">Dashboard</span>
              </h1>
              <p className="text-gray-600 mt-1">Audit log database, bookings monitoring, and user activity dashboard.</p>
            </div>
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full text-gray-700 font-semibold shadow-sm hover:shadow-md hover:border-rose-400 transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw size={18} className={loading ? "animate-spin text-rose-500" : "text-gray-600"} />
              Refresh Data
            </button>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-center font-semibold">
              {error}
            </div>
          )}

          {/* Metrics Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Registered Users */}
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-md border border-white/60 flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Users size={28} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Registered Users</p>
                <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{loading ? '...' : (data.users || []).length}</h3>
              </div>
            </div>

            {/* Total Bookings */}
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-md border border-white/60 flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                <Calendar size={28} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Total Bookings</p>
                <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{loading ? '...' : (data.bookings || []).length}</h3>
              </div>
            </div>

            {/* Activity Logs */}
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-md border border-white/60 flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Activity size={28} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Activity Logs</p>
                <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{loading ? '...' : (data.logs || []).length}</h3>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-md border border-white/60 flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                <Clock size={28} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Logins Today</p>
                <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
                  {loading ? '...' : (data.logs || []).filter(l => l && l.action === 'LOGIN').length}
                </h3>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full lg:w-max mb-8">
            <button
              onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              User Directory
            </button>
            <button
              onClick={() => { setActiveTab('bookings'); setSearchQuery(''); }}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Bookings List
            </button>
            <button
              onClick={() => { setActiveTab('logs'); setSearchQuery(''); }}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'logs'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Activity Logs
            </button>
          </div>

          {/* Dynamic Tab Content */}
          <div className="space-y-8">
            {/* 1. Dynamic Charts */}
            {!loading && activeTab === 'users' && (
              <div className="flex flex-col md:flex-row gap-6">
                <BarChart
                  title="User Growth (Last 30 Days)"
                  data={getUserGrowthData(data)}
                  colorClass="rose"
                  valueFormatter={(v) => `${v} Users`}
                />
              </div>
            )}

            {!loading && activeTab === 'bookings' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BarChart
                  title="Booking Trend (Last 30 Days)"
                  data={getBookingTrendData(data)}
                  colorClass="blue"
                  valueFormatter={(v) => `${v} Bookings`}
                />
                <AreaChart
                  title="Estimated Revenue (Last 30 Days)"
                  data={getRevenueTrendData(data)}
                  colorClass="emerald"
                  valueFormatter={(v) => `₹${v.toLocaleString('en-IN')}`}
                />
              </div>
            )}

            {!loading && activeTab === 'logs' && (
              <div className="flex flex-col md:flex-row gap-6">
                <BarChart
                  title="Login Activity (Last 30 Days)"
                  data={getLoginActivityData(data)}
                  colorClass="amber"
                  valueFormatter={(v) => `${v} Logins`}
                />
              </div>
            )}

            {/* 2. Control Bar (Search & Filter) */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-md border border-white/60">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800 self-start sm:self-center">
                  {activeTab === 'users' ? 'User Directory' : activeTab === 'bookings' ? 'Bookings Database' : 'Security Logs'}
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Search ${activeTab}...`}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {activeTab === 'logs' && (
                    <div className="relative">
                      <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        value={actionFilter}
                        onChange={(e) => setActionFilter(e.target.value)}
                        className="pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="ALL">All Actions</option>
                        <option value="LOGIN">Logins</option>
                        <option value="LOGOUT">Logouts</option>
                        <option value="REGISTER">Registrations</option>
                        <option value="CREATE_BOOKING">Bookings</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Interactive Data Tables */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 overflow-hidden">
              {loading ? (
                <div className="flex flex-col justify-center items-center py-24 gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
                  <p className="text-gray-500 font-medium">Fetching secure metrics...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {/* 1. User Directory Tab */}
                  {activeTab === 'users' && (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                          <th className="px-6 py-4">Client Name</th>
                          <th className="px-6 py-4">Email Address</th>
                          <th className="px-6 py-4">Joined Date</th>
                          <th className="px-6 py-4">Role / Badge</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="text-center py-12 text-gray-500 font-medium">
                              No registered clients found.
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((userObj) => (
                            <tr key={userObj._id || userObj.id} className="hover:bg-rose-50/10 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-950 align-middle flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                  {(userObj.name || 'U')[0].toUpperCase()}
                                </div>
                                {userObj.name || 'Anonymous User'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-600 align-middle">
                                {userObj.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs align-middle">
                                {formatDateTime(userObj.createdAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap align-middle">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-rose-500/10 to-purple-500/10 text-rose-700 text-xs font-bold rounded-full border border-rose-100">
                                  <UserCheck size={12} /> Client
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}

                  {/* 2. Bookings List Tab */}
                  {activeTab === 'bookings' && (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                          <th className="px-6 py-4">Client</th>
                          <th className="px-6 py-4">Occasion / Type</th>
                          <th className="px-6 py-4">Venue & Date</th>
                          <th className="px-6 py-4">Guests</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredBookings.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center py-12 text-gray-500 font-medium">
                              No bookings found in database.
                            </td>
                          </tr>
                        ) : (
                          filteredBookings.map((booking) => (
                            <tr key={booking._id || booking.id} className="hover:bg-rose-50/10 transition-colors">
                              <td className="px-6 py-4 align-middle">
                                <div className="font-semibold text-gray-950">{booking.name}</div>
                                <div className="text-gray-500 text-xs">{booking.email}</div>
                                <div className="text-gray-400 text-xs mt-0.5">{booking.phone}</div>
                              </td>
                              <td className="px-6 py-4 align-middle">
                                <div className="font-semibold text-gray-800">
                                  {booking.event ? booking.event.title : 'Custom Occasion'}
                                </div>
                                <span className="inline-block mt-1 px-2.5 py-0.5 bg-rose-50 text-rose-600 rounded-full text-xs font-medium border border-rose-100">
                                  {booking.event ? booking.event.category : 'N/A'}
                                </span>
                              </td>
                              <td className="px-6 py-4 align-middle">
                                <div className="text-gray-700 font-semibold">{booking.venue || 'TBD'}</div>
                                <div className="text-gray-500 text-xs">{booking.date}</div>
                              </td>
                              <td className="px-6 py-4 text-gray-700 font-bold align-middle">
                                {booking.guests || 0}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap align-middle">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                                  booking.status === 'confirmed'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                  {booking.status || 'pending'}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}

                  {/* 3. Activity Logs Tab */}
                  {activeTab === 'logs' && (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                          <th className="px-6 py-4">Action</th>
                          <th className="px-6 py-4">User Details</th>
                          <th className="px-6 py-4">Event Details</th>
                          <th className="px-6 py-4">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredLogs.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="text-center py-12 text-gray-500 font-medium">
                              No matching activities recorded.
                            </td>
                          </tr>
                        ) : (
                          filteredLogs.map((log) => (
                            <tr key={log._id || log.id} className="hover:bg-rose-50/10 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap align-middle">
                                {getActionBadge(log.action)}
                              </td>
                              <td className="px-6 py-4 align-middle">
                                <div className="font-semibold text-gray-950">{log.userName || 'Anonymous'}</div>
                                <div className="text-gray-500 text-xs">{log.userEmail || 'N/A'}</div>
                              </td>
                              <td className="px-6 py-4 text-gray-700 align-middle max-w-xs md:max-w-md break-words">
                                {log.details}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs align-middle">
                                {formatDateTime(log.timestamp)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Eventify. All rights reserved. (Admin Panel)
      </footer>
    </div>
  )
}
