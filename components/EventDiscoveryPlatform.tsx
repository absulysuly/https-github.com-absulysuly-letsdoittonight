import { useMemo, useState } from 'react'
import { useEvents, type EventCategory, type EventItem, type GovernorateKey, governorates } from '../hooks/useEvents'

type Lang = 'en' | 'ar' | 'ku'

type Dictionary = {
  title: string
  subtitle: string
  search: string
  all: string
  categories: Record<EventCategory, string>
  createEvent: string
  chat: string
  reviews: string
  details: string
  oneTap: string
  governorates: string
}

const dict: Record<Lang, Dictionary> = {
  en: {
    title: 'Iraq Event Discovery Platform', subtitle: 'Find what is happening tonight across all governorates.',
    search: 'Search events, places, or organizers...', all: 'All',
    categories: { Music: 'Music', Tech: 'Tech', Culture: 'Culture', Business: 'Business' },
    createEvent: 'Create Event', chat: 'Live Chat', reviews: 'Reviews', details: 'Event Details', oneTap: 'One-Tap Share', governorates: 'Governorates',
  },
  ar: {
    title: 'منصة اكتشاف الفعاليات في العراق', subtitle: 'اكتشف فعاليات الليلة في جميع المحافظات.',
    search: 'ابحث عن الفعاليات أو الأماكن أو المنظمين...', all: 'الكل',
    categories: { Music: 'موسيقى', Tech: 'تقنية', Culture: 'ثقافة', Business: 'أعمال' },
    createEvent: 'إنشاء فعالية', chat: 'دردشة مباشرة', reviews: 'المراجعات', details: 'تفاصيل الفعالية', oneTap: 'مشاركة بضغطة واحدة', governorates: 'المحافظات',
  },
  ku: {
    title: 'پلاتفۆرمی دۆزینەوەی ڕووداوەکانی عێراق', subtitle: 'ئەمشەو ڕووداوەکان لە هەموو پارێزگاکان بدۆزەوە.',
    search: 'گەڕان بۆ ڕووداو، شوێن یان ڕێکخەر...', all: 'هەموو',
    categories: { Music: 'مۆسیقا', Tech: 'تەکنەلۆجیا', Culture: 'کەلتوور', Business: 'بازرگانی' },
    createEvent: 'دروستکردنی ڕووداو', chat: 'چات', reviews: 'هەڵسەنگاندن', details: 'وردەکاری ڕووداو', oneTap: 'هاوبەشکردنی خێرا', governorates: 'پارێزگاکان',
  },
}

const languages: Lang[] = ['en', 'ar', 'ku']

const isRtl = (lang: Lang) => lang !== 'en'

function EventCard({ event, onOpen, t, lang }: { event: EventItem; onOpen: (event: EventItem) => void; t: Dictionary; lang: Lang }) {
  return (
    <article className="rounded-2xl border border-orange-300/20 bg-white/10 p-4 backdrop-blur-md shadow-[0_0_32px_rgba(251,146,60,0.18)] transition hover:-translate-y-1">
      <img src={event.image} alt={event.title.en} className="h-40 w-full rounded-xl object-cover" />
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between text-xs text-orange-100">
          <span className="inline-flex items-center gap-1 rounded-full border border-orange-300/30 px-2 py-0.5">📈 {event.growth}%</span>
          <span>🕒 {event.time}</span>
        </div>
        <h3 className="text-lg font-semibold text-white">{event.title[lang]}</h3>
        <p className="text-sm text-orange-50/85">{event.description[lang]}</p>
        <button type="button" onClick={() => onOpen(event)} className="mt-1 w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-3 py-2 text-sm font-semibold text-zinc-950">{t.details}</button>
      </div>
    </article>
  )
}

export default function EventDiscoveryPlatform() {
  const [lang, setLang] = useState<Lang>('en')
  const [search, setSearch] = useState('')
  const [selectedGovernorate, setSelectedGovernorate] = useState<GovernorateKey | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all')
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const t = dict[lang]
  const { events, loading } = useEvents({ search, governorate: selectedGovernorate, category: selectedCategory })
  const loopingGovernorates = useMemo(() => [...governorates, ...governorates], [])

  return (
    <div dir={isRtl(lang) ? 'rtl' : 'ltr'} className="min-h-screen text-white bg-[radial-gradient(circle_at_15%_20%,rgba(251,146,60,0.35),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(252,211,77,0.3),transparent_35%),linear-gradient(160deg,#0b1120_0%,#1e1b4b_45%,#312e81_100%)]">
      <header className="sticky top-0 z-40 border-b border-orange-300/20 bg-slate-900/55 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <div><h1 className="text-lg font-bold text-orange-200">{t.title}</h1><p className="text-xs text-orange-100/80">{t.subtitle}</p></div>
          <div className="ml-auto flex items-center gap-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search} className="hidden sm:block w-80 rounded-xl border border-orange-300/30 bg-white/10 py-2 px-3 text-sm outline-none placeholder:text-orange-100/70 focus:ring-2 focus:ring-orange-400" />
            <div className="inline-flex rounded-xl border border-orange-300/30 bg-white/10 p-1">{languages.map((l) => <button key={l} onClick={() => setLang(l)} className={`rounded-lg px-2 py-1 text-xs uppercase ${lang === l ? 'bg-orange-400 text-zinc-950' : 'text-orange-100'}`}>{l}</button>)}</div>
          </div>
        </div>
      </header>

      <section className="border-b border-orange-300/20 py-4">
        <p className="mb-2 px-4 text-sm font-medium text-orange-100">{t.governorates}</p>
        <div className="overflow-hidden">
          <div className="flex gap-3 px-4 animate-[scroll-x_24s_linear_infinite]">
            {loopingGovernorates.map((gov, i) => (
              <button key={`${gov.key}-${i}`} onClick={() => setSelectedGovernorate(gov.key)} className={`shrink-0 rounded-2xl border px-4 py-2 text-sm shadow-[inset_0_0_20px_rgba(255,255,255,0.08)] ${selectedGovernorate === gov.key ? 'border-orange-300 bg-orange-300/20 text-white' : 'border-white/20 bg-white/5 text-orange-100'}`}>{gov.name[lang]}</button>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_320px]">
        <section>
          <div className="mb-4 flex flex-wrap gap-2">
            <button onClick={() => setSelectedCategory('all')} className="rounded-full border border-orange-300/30 px-3 py-1 text-xs">{t.all}</button>
            {(['Music', 'Tech', 'Culture', 'Business'] as EventCategory[]).map((cat) => <button key={cat} onClick={() => setSelectedCategory(cat)} className={`rounded-full border px-3 py-1 text-xs ${selectedCategory === cat ? 'border-orange-300 bg-orange-300/20' : 'border-white/20'}`}>{t.categories[cat]}</button>)}
          </div>
          {loading ? <p>Loading...</p> : null}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{events.map((event) => <EventCard key={event.id} event={event} onOpen={setSelectedEvent} t={t} lang={lang} />)}</div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-orange-300/30 bg-white/10 p-4 backdrop-blur-md"><h3 className="mb-3 font-semibold">➕ {t.createEvent}</h3><ol className="space-y-2 text-sm text-orange-50/90"><li>1. Basic info</li><li>2. Dates & venue</li><li>3. Upload cover placeholder</li><li>4. Publish</li></ol></div>
          <div className="rounded-2xl border border-orange-300/30 bg-white/10 p-4 backdrop-blur-md"><h3 className="mb-2 font-semibold">💬 {t.chat}</h3><p className="text-sm text-orange-100/80">Realtime discussion room placeholder (Supabase channel ready).</p></div>
          <div className="rounded-2xl border border-orange-300/30 bg-white/10 p-4 backdrop-blur-md"><h3 className="mb-2 font-semibold">⭐ {t.reviews}</h3><p className="text-sm text-orange-100/80">★★★★★ Review and comments placeholder.</p></div>
        </aside>
      </main>

      {selectedEvent ? (
        <div className="fixed inset-0 z-50 bg-black/60 p-4" onClick={() => setSelectedEvent(null)}>
          <div onClick={(e) => e.stopPropagation()} className="mx-auto mt-8 max-w-3xl rounded-2xl border border-orange-300/30 bg-slate-900/90 p-4 backdrop-blur-md">
            <img src={selectedEvent.image} alt={selectedEvent.title.en} className="h-64 w-full rounded-xl object-cover" />
            <div className="mt-3 space-y-2"><h3 className="text-xl font-bold">{selectedEvent.title[lang]}</h3><p className="text-sm text-orange-100/85">{selectedEvent.description[lang]}</p><div className="flex flex-wrap gap-3 text-sm"><span>📅 {selectedEvent.date}</span><span>📍 {selectedEvent.venue}</span><a className="text-orange-300" href={selectedEvent.googleMapsUrl} target="_blank" rel="noreferrer">Google Maps ↗</a></div><button className="rounded-lg bg-orange-400 px-3 py-2 text-sm font-semibold text-zinc-900">🔗 {t.oneTap}</button></div>
          </div>
        </div>
      ) : null}

      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
        <a href="https://wa.me/9640000000000" className="rounded-full bg-green-500 p-3 shadow-lg shadow-green-500/30" aria-label="WhatsApp">💬</a>
        <button className="rounded-full bg-orange-500 p-3 shadow-lg shadow-orange-500/30" aria-label="Organizer profile">📞</button>
      </div>
    </div>
  )
}
