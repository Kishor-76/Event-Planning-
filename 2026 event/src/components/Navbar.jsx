import { useState, useEffect, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, User, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, logout } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()

  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    const closeDropdown = () => setDropdownOpen(false)
    window.addEventListener('click', closeDropdown)
    return () => window.removeEventListener('click', closeDropdown)
  }, [])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' },
    { to: '/booking', label: 'Book Now' },
  ]

  const handleLogoutClick = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
      navigate('/login')
    }
  }

  const textColor = (isHome && !scrolled) ? 'text-white' : 'text-gray-700'
  const activeTextColor = (isHome && !scrolled) ? 'text-rose-300 font-semibold' : 'text-rose-500 font-semibold'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? 'bg-white shadow-md border-b border-gray-150 py-3'
          : 'bg-white/10 backdrop-blur-md py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-rose-500 hover:scale-105 transition-transform">
            Eventify
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Primary Nav Links */}
            <div className="flex items-center gap-8 border-r border-gray-200/50 pr-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`font-medium transition-colors duration-300 hover:text-rose-500 ${
                      isActive ? activeTextColor : textColor
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            {/* Profile Dropdown / Login Action */}
            <div className="relative">
              {user ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDropdownOpen(!dropdownOpen)
                    }}
                    className="flex items-center gap-2 focus:outline-none group cursor-pointer"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-rose-500/25 group-hover:border-rose-500 transition-all shadow-sm"
                    />
                    <span className={`text-sm font-semibold max-w-[120px] truncate ${textColor}`}>
                      {user.name}
                    </span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${textColor} ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2.5 z-55 origin-top-right transform scale-100 transition-all"
                    >
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>

                      {/* Dropdown links */}
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50/50 hover:text-rose-500 transition-colors"
                      >
                        <User size={16} />
                        My Profile
                      </Link>

                      <a
                        href="http://localhost:5174"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50/50 hover:text-rose-500 transition-colors"
                      >
                        <LayoutDashboard size={16} />
                        Admin Dashboard
                      </a>

                      <div className="border-t border-gray-50 my-1"></div>

                      <button
                        onClick={() => {
                          setDropdownOpen(false)
                          handleLogoutClick()
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50/50 transition-colors cursor-pointer"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-purple-500 rounded-xl hover:shadow-lg hover:shadow-rose-500/25 active:scale-95 transition-all"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden p-2 rounded-lg hover:bg-gray-100/10 cursor-pointer ${textColor}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-xl border-t border-gray-100 shadow-lg animate-fade-in">
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block font-semibold py-1.5 transition-colors ${
                    isActive ? 'text-rose-500' : 'text-gray-700 hover:text-rose-500'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )
            })}
            
            {user ? (
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex items-center gap-3 px-1 py-1">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-rose-500/20 shadow-sm"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2 text-sm font-semibold text-gray-700 hover:text-rose-500 transition-colors"
                >
                  <User size={16} />
                  My Profile
                </Link>

                <a
                  href="http://localhost:5174"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2 text-sm font-semibold text-gray-700 hover:text-rose-500 transition-colors"
                >
                  <LayoutDashboard size={16} />
                  Admin Dashboard
                </a>

                <button
                  onClick={() => {
                    setMobileOpen(false)
                    handleLogoutClick()
                  }}
                  className="flex items-center gap-3 w-full text-left py-2 text-sm font-semibold text-red-500 transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center py-2.5 text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-purple-500 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
