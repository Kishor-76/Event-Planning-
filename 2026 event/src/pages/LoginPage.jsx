import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Mail, Lock, Eye, EyeOff, User as UserIcon } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { fetchJSON, API_BASE } from '../utils/api'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        // 1. Get Authentication token from backend login
        const loginRes = await fetchJSON(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        })

        const token = loginRes.token

        // 2. Fetch authenticated user data using the token
        const userRes = await fetchJSON(`${API_BASE}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        // 3. Update application context with user state and token
        login(userRes, token)
        navigate('/profile')
      } else {
        // Register API call
        await fetchJSON(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          body: JSON.stringify({ email, password, name }),
        })

        alert('Registration successful! Please login with your credentials.')
        setIsLogin(true)
        setError('')
        setName('')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex pt-20">
        {/* Left - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
            alt="Event celebration"
            className="w-full h-[calc(100vh-5rem)] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/30 to-transparent" />
          <div className="absolute bottom-12 left-12 text-white">
            <p className="text-2xl font-bold">Your dream event starts here</p>
            <p className="text-white/80 mt-1">Join thousands of satisfied clients</p>
          </div>
        </div>

        {/* Right - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F5F5F5]">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-gray-600 mb-8">
              {isLogin ? 'Sign in to continue planning your event' : 'Join Eventify to get started'}
            </p>

            {/* Social Login */}
            <div className="flex gap-4 mb-6">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-rose-200 transition-all duration-300 shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#1877F2] text-white rounded-xl hover:bg-[#166FE5] transition-all duration-300 shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#F5F5F5] text-gray-500">or continue with email</span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold shadow-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {isLogin && (
                <div className="flex justify-end">
                  <Link to="#" className="text-sm text-rose-500 hover:text-rose-600 font-medium">
                    Forgot password?
                  </Link>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-400 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/30 hover:shadow-rose-600/40 transition-all duration-300 flex items-center justify-center"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <p className="mt-6 text-center text-gray-600">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                }}
                className="text-rose-500 font-semibold hover:text-rose-600"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
