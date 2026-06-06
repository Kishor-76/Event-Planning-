import Hero from '../components/Hero'
import ServiceCards from '../components/ServiceCards'
import LogoCarousel from '../components/LogoCarousel'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <ServiceCards />
      <LogoCarousel />
      <Footer />
    </>
  )
}
