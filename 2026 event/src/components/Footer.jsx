import { Link } from 'react-router-dom'
import { Instagram, Facebook, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="text-2xl font-bold text-rose-500">Eventify</Link>
            <p className="mt-3 text-gray-600 text-sm">Premium event planning for unforgettable moments</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Services</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/wedding-planning" className="hover:text-rose-500">Wedding Planning</Link></li>
              <li><Link to="/birthday-party" className="hover:text-rose-500">Birthday Party</Link></li>
              <li><Link to="/corporate-event" className="hover:text-rose-500">Corporate Event</Link></li>
              <li><Link to="/anniversary-celebration" className="hover:text-rose-500">Anniversary</Link></li>
              <li><Link to="/baby-shower" className="hover:text-rose-500">Baby Shower</Link></li>
              <li><Link to="/events" className="hover:text-rose-500">All Events</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/events" className="hover:text-rose-500">Events</Link></li>
              <li><Link to="/booking" className="hover:text-rose-500">Book Now</Link></li>
              <li><Link to="/login" className="hover:text-rose-500">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-rose-500 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-500 hover:text-rose-500 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-500 hover:text-rose-500 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-500 text-sm">
          © 2026 Eventify. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
