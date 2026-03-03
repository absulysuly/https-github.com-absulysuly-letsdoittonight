import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomeView from '../components/views/HomeView'
import CandidatesView from '../components/views/CandidatesView'
import CandidateProfileView from '../components/views/CandidateProfileView'
import EventsView from '../components/views/EventsView'
import DebatesView from '../components/views/DebatesView'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/feed" element={<HomeView />} />
        <Route path="/candidates" element={<CandidatesView />} />
        <Route path="/candidate/:id" element={<CandidateProfileView />} />
        <Route path="/events" element={<EventsView />} />
        <Route path="/debates" element={<DebatesView />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
