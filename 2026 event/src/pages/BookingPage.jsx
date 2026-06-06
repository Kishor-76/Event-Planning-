import Navbar from '../components/Navbar'
import BookingForm from '../components/BookingForm'

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F5F5F5] pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Book Your <span className="text-rose-500">Dream Event</span>
            </h1>
            <p className="text-gray-600">Simple steps to bring your vision to life</p>
          </div>
          <BookingForm />
        </div>
      </div>
    </>
  )
}
