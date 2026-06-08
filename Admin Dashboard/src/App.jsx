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
  Sparkles,
  RefreshCw,
  LogOut,
  LogIn,
  UserPlus,
  Lock
} from 'lucide-react'

export default function App() {
  const [authorized, setAuthorized] = useState(() => {
    return sessionStorage.getItem('admin_authorized') === 'true'
  })
  const [pin, setPin] = useState(['', '', '', ''])
  const [pinError, setPinError] = useState('')

  const [data, setData] = useState({ logs: [], bookings: [], users: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('logs') // 'logs', 'bookings', 'users'
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
        sessionStorage.setItem('admin_authorized', 'true')
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
      sessionStorage.setItem('admin_authorized', 'true')
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
                <Sparkles className="text-amber-500 animate-pulse" />
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

          {/* Search, Filter & Tabs Panel */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60 mb-8">
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
              {/* Tabs */}
              <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full lg:w-auto">
                <button
                  onClick={() => { setActiveTab('logs'); setSearchQuery(''); }}
                  className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'logs'
                      ? 'bg-white text-gray-900 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Activity Logs
                </button>
                <button
                  onClick={() => { setActiveTab('bookings'); setSearchQuery(''); }}
                  className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'bookings'
                      ? 'bg-white text-gray-900 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Bookings List
                </button>
                <button
                  onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
                  className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'users'
                      ? 'bg-white text-gray-900 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  User Directory
                </button>
              </div>

              {/* Search and Action Filter */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
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

          {/* Interactive Lists */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 overflow-hidden">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-24 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
                <p className="text-gray-500 font-medium">Fetching secure metrics...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* 1. Activity Logs Tab */}
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

                {/* 3. User Directory Tab */}
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
              </div>
            )}
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
