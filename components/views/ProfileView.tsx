import { useAuth } from '../../context/AuthContext'

export default function ProfileView() {
  const { profile, role } = useAuth()

  if (!profile) return <div className="p-4">Sign in to view your profile.</div>

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-xl font-bold">Profile</h2>
      <p>Name: {profile.full_name || 'N/A'}</p>
      <p>Email: {profile.email || 'N/A'}</p>
      <p>Role: {role}</p>
    </div>
  )
}
