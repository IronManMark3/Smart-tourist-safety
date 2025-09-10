import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar.jsx'
import Landing from './pages/Landing.jsx'
import Tourist from './pages/Tourist.jsx'
import AuthorityDashboard from './pages/AuthorityDashboard.jsx'
import Alerts from './pages/Alerts.jsx'
import EFIR from './pages/EFIR.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/tourist" element={<Tourist />} />
          <Route path="/authority" element={<AuthorityDashboard />} />
          <Route path="/authority/alerts" element={<Alerts />} />
          <Route path="/authority/e-fir" element={<EFIR />} />
        </Routes>
      </main>
      <Toaster position="top-right" />
    </div>
  )
}
