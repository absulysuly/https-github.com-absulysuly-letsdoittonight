import { Navigate, Route, Routes } from 'react-router-dom'
import GeneralFeedView from '../components/views/GeneralFeedView'
import CampusView from '../components/views/CampusView'
import ProfileView from '../components/views/ProfileView'
import ProtectedRoute from '../components/ProtectedRoute'
import type { Language } from '../types'

export default function AppRouter({ language }: { language: Language }) {
  return (
    <Routes>
      <Route path="/" element={<GeneralFeedView language={language} />} />
      <Route path="/campus" element={<CampusView language={language} />} />
      <Route path="/profile" element={<ProtectedRoute><ProfileView /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
