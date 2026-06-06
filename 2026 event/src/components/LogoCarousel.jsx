const logos = [
  'Grand Hyatt',
  'Taj Palace',
  'The Oberoi',
  'Marriott',
  'Leela Palace',
  'ITC Hotels',
  'Four Seasons',
  'JW Marriott',
  'Hyatt Regency',
  'Ritz Carlton',
]

export default function LogoCarousel() {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="text-center mb-12">
        <p className="text-gray-500 font-medium text-sm uppercase tracking-widest">
          Trusted by leading venues
        </p>
      </div>
      <div className="relative">
        <div className="flex animate-scroll">
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-8 px-8 py-4 bg-[#F5F5F5] rounded-xl font-bold text-gray-600 text-lg whitespace-nowrap"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
