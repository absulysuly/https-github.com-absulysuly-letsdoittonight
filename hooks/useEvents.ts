import { useEffect, useMemo, useState } from 'react'

export type EventCategory = 'Music' | 'Tech' | 'Culture' | 'Business'
export type GovernorateKey =
  | 'baghdad'
  | 'basra'
  | 'ninawa'
  | 'erbil'
  | 'najaf'
  | 'karbala'
  | 'anbar'
  | 'sulaymaniyah'
  | 'diyala'
  | 'kirkuk'
  | 'dhiqar'
  | 'wasit'
  | 'maysan'
  | 'muthanna'
  | 'babel'
  | 'salahaddin'
  | 'qadisiyyah'
  | 'duhok'

export type EventItem = {
  id: string
  title: Record<'en' | 'ar' | 'ku', string>
  description: Record<'en' | 'ar' | 'ku', string>
  category: EventCategory
  governorate: GovernorateKey
  date: string
  time: string
  venue: string
  image: string
  googleMapsUrl: string
  growth: number
}

export const governorates: { key: GovernorateKey; name: Record<'en' | 'ar' | 'ku', string> }[] = [
  { key: 'baghdad', name: { en: 'Baghdad', ar: 'بغداد', ku: 'بەغدا' } },
  { key: 'basra', name: { en: 'Basra', ar: 'البصرة', ku: 'بەسرە' } },
  { key: 'ninawa', name: { en: 'Ninawa', ar: 'نينوى', ku: 'نەینەوا' } },
  { key: 'erbil', name: { en: 'Erbil', ar: 'أربيل', ku: 'هەولێر' } },
  { key: 'najaf', name: { en: 'Najaf', ar: 'النجف', ku: 'نەجەف' } },
  { key: 'karbala', name: { en: 'Karbala', ar: 'كربلاء', ku: 'کەربەلا' } },
  { key: 'anbar', name: { en: 'Anbar', ar: 'الأنبار', ku: 'ئەنبار' } },
  { key: 'sulaymaniyah', name: { en: 'Sulaymaniyah', ar: 'السليمانية', ku: 'سلێمانی' } },
  { key: 'diyala', name: { en: 'Diyala', ar: 'ديالى', ku: 'دیالە' } },
  { key: 'kirkuk', name: { en: 'Kirkuk', ar: 'كركوك', ku: 'کەرکووک' } },
  { key: 'dhiqar', name: { en: 'Dhi Qar', ar: 'ذي قار', ku: 'زیقار' } },
  { key: 'wasit', name: { en: 'Wasit', ar: 'واسط', ku: 'واسیت' } },
  { key: 'maysan', name: { en: 'Maysan', ar: 'ميسان', ku: 'مەیسان' } },
  { key: 'muthanna', name: { en: 'Muthanna', ar: 'المثنى', ku: 'موسەننا' } },
  { key: 'babel', name: { en: 'Babel', ar: 'بابل', ku: 'بابل' } },
  { key: 'salahaddin', name: { en: 'Salahaddin', ar: 'صلاح الدين', ku: 'سەلاحەدین' } },
  { key: 'qadisiyyah', name: { en: 'Qadisiyyah', ar: 'القادسية', ku: 'قادسیە' } },
  { key: 'duhok', name: { en: 'Duhok', ar: 'دهوك', ku: 'دهۆک' } },
]

const seedEvents: EventItem[] = [
  {
    id: '1',
    title: { en: 'Baghdad Tech Night', ar: 'ليلة بغداد التقنية', ku: 'شەوی تەکنەلۆژیای بەغدا' },
    description: { en: 'Startup demos and AI showcases.', ar: 'عروض شركات ناشئة وذكاء اصطناعي.', ku: 'پیشاندانی ستارتاپ و AI.' },
    category: 'Tech', governorate: 'baghdad', date: '2026-03-18', time: '19:00', venue: 'Al Mansour Hall',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
    googleMapsUrl: 'https://maps.google.com/?q=Baghdad', growth: 28,
  },
  {
    id: '2',
    title: { en: 'Basra Music Port', ar: 'مهرجان موسيقى البصرة', ku: 'فێستیڤاڵی مۆسیقای بەسرە' },
    description: { en: 'Open-air live bands by the river.', ar: 'حفلات مباشرة على ضفة النهر.', ku: 'باندی زیندوو لای ڕووبار.' },
    category: 'Music', governorate: 'basra', date: '2026-03-20', time: '21:00', venue: 'Shatt Al-Arab Stage',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop',
    googleMapsUrl: 'https://maps.google.com/?q=Basra', growth: 34,
  },
  {
    id: '3',
    title: { en: 'Erbil Culture Expo', ar: 'معرض أربيل الثقافي', ku: 'پێشانگای کەلتووری هەولێر' },
    description: { en: 'Artisan booths, food, and heritage talks.', ar: 'حرف يدوية وأطعمة ومحاضرات تراثية.', ku: 'هونەر، خواردن و وتاری میرات.' },
    category: 'Culture', governorate: 'erbil', date: '2026-03-22', time: '17:30', venue: 'Citadel Plaza',
    image: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?q=80&w=1200&auto=format&fit=crop',
    googleMapsUrl: 'https://maps.google.com/?q=Erbil', growth: 19,
  },
  {
    id: '4',
    title: { en: 'Najaf Business Forum', ar: 'منتدى أعمال النجف', ku: 'فۆڕمی بازرگانی نەجەف' },
    description: { en: 'SME networking and investment panels.', ar: 'شبكات أعمال ولوحات استثمار.', ku: 'تۆڕسازی SME و پانێڵی وەبەرهێنان.' },
    category: 'Business', governorate: 'najaf', date: '2026-03-25', time: '10:00', venue: 'Najaf Convention Center',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop',
    googleMapsUrl: 'https://maps.google.com/?q=Najaf', growth: 22,
  },
]

export function useEvents(filters: { search: string; governorate: GovernorateKey | 'all'; category: EventCategory | 'all' }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 180)
    return () => clearTimeout(t)
  }, [filters.search, filters.governorate, filters.category])

  const events = useMemo(() => {
    const query = filters.search.trim().toLowerCase()

    return seedEvents.filter((event) => {
      const matchesSearch =
        !query ||
        Object.values(event.title).some((t) => t.toLowerCase().includes(query)) ||
        Object.values(event.description).some((d) => d.toLowerCase().includes(query)) ||
        event.venue.toLowerCase().includes(query)
      const matchesGov = filters.governorate === 'all' || event.governorate === filters.governorate
      const matchesCategory = filters.category === 'all' || event.category === filters.category
      return matchesSearch && matchesGov && matchesCategory
    })
  }, [filters])

  return { events, loading }
}
