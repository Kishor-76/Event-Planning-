import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import EventListingPage from './pages/EventListingPage'
import BookingPage from './pages/BookingPage'
import WeddingPlanningPage from './pages/WeddingPlanningPage'
import BirthdayPartyPage from './pages/BirthdayPartyPage'
import CorporateEventPage from './pages/CorporateEventPage'
import AnniversaryPage from './pages/AnniversaryPage'
import BabyShowerPage from './pages/BabyShowerPage'
import ProfilePage from './pages/ProfilePage'
import { ProtectedRoute } from './context/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/events" element={<EventListingPage />} />
        <Route path="/booking" element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        } />
        <Route path="/wedding-planning" element={<WeddingPlanningPage />} />
        <Route path="/birthday-party" element={<BirthdayPartyPage />} />
        <Route path="/corporate-event" element={<CorporateEventPage />} />
        <Route path="/anniversary-celebration" element={<AnniversaryPage />} />
        <Route path="/baby-shower" element={<BabyShowerPage />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
