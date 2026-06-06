import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { CheckCircle2 } from 'lucide-react'

export default function EventTypeLayout({ title, subtitle, heroImage, features, description }) {
  return (
    <>
      <Navbar />
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={heroImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">{subtitle}</p>
        </div>
      </section>
      {/* Content */}
      <section className="py-20 bg-[#F5F5F5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-gray-600 text-center mb-16 leading-relaxed">
            {description}
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg border border-white/50"
              >
                <CheckCircle2 className="w-8 h-8 text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{feature.title}</h3>
                  <p className="text-gray-600">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/booking"
              className="inline-block px-10 py-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-full text-lg shadow-lg shadow-rose-500/40 hover:scale-105 transition-all duration-300"
            >
              Book Now
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
