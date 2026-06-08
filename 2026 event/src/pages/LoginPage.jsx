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
      <div 
        className="min-h-screen flex items-center justify-center pt-24 pb-16 bg-cover bg-center relative"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&auto=format&fit=crop')` }}
      >
        {/* Dark translucent overlay for contrast and readability */}
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[4px]" />

        {/* Centered Login Card */}
        <div className="relative z-10 w-full max-w-md mx-4 p-8 sm:p-10 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20">
          <div className="w-full">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-gray-500 mb-8 text-center text-sm font-medium">
              {isLogin ? 'Sign in to continue planning your event' : 'Join Eventify to get started'}
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-semibold shadow-sm text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 pl-1">Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-gray-900"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 pl-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 pl-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all text-gray-900"
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
                  <Link to="#" className="text-xs text-rose-500 hover:text-rose-600 font-semibold transition-colors">
                    Forgot password?
                  </Link>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-purple-650 hover:shadow-lg hover:shadow-rose-500/25 active:scale-[0.99] text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                }}
                className="text-rose-500 font-bold hover:text-rose-600 transition-colors"
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
