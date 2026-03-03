import { useEffect, useState } from 'react'
import type { Event } from '../../types'
import { getEvents } from '../../services/api/eventService'

export default function EventsView() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getEvents()
      .then(setEvents)
      .catch(() => setError('Failed to load events'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>
  if (!events.length) return <div className="text-center text-gray-500 p-8">No events yet</div>

  return (
    <div className="p-4 sm:p-6 space-y-4">
      {events.map((event) => (
        <div key={event.id} className="glass-card rounded-lg p-4">
          <h3 className="font-semibold">{event.title}</h3>
          <p className="text-sm text-theme-text-muted">{event.location} — {event.date}</p>
        </div>
      ))}
    </div>
  )
}
