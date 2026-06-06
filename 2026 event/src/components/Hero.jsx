import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-couple-getting-married-4246-large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 animate-fade-in">
          Create Memories That
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">
            Last Forever
          </span>
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-10 font-light">
          From intimate weddings to grand corporate celebrations – we turn your vision into extraordinary experiences
        </p>
        <Link
          to="/booking"
          className="group px-10 py-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-full text-lg shadow-lg shadow-rose-500/40 hover:shadow-rose-600/50 hover:scale-105 transition-all duration-300"
        >
          Plan Your Dream Event
        </Link>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
        </div>
      </div>
    </section>
  )
}
