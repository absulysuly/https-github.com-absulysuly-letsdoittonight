import type { Language } from './types'

type TranslationMap = Record<string, string>

const en: TranslationMap = {
  appName: 'Iraqi Community Hub',
  home: 'General',
  students: 'Students',
  profile: 'Profile',
  createPost: 'Create Post',
  whatsOnYourMind: "What's on your mind?",
  like: 'Like',
  comment: 'Comment',
  share: 'Share',
  loading: 'Loading...',
  loginToPost: 'Please sign in to post.',
  signIn: 'Sign in',
  notifications: 'Notifications',
  search: 'Search',
  studentsOnly: 'Student posting is available for student accounts only.',
}

const ar: TranslationMap = {
  appName: 'المجتمع العراقي',
  home: 'عام',
  students: 'الطلاب',
  profile: 'الملف الشخصي',
  createPost: 'إنشاء منشور',
  whatsOnYourMind: 'بماذا تفكر؟',
  like: 'إعجاب',
  comment: 'تعليق',
  share: 'مشاركة',
  loading: 'جاري التحميل...',
  loginToPost: 'يرجى تسجيل الدخول للنشر.',
  signIn: 'تسجيل الدخول',
  notifications: 'الإشعارات',
  search: 'بحث',
  studentsOnly: 'النشر المخصص للطلاب متاح فقط لحسابات الطلاب.',
}

const ku: TranslationMap = {
  appName: 'کۆمەڵگەی عێراق',
  home: 'گشتی',
  students: 'خوێندکاران',
  profile: 'پڕۆفایل',
  createPost: 'دروستکردنی پۆست',
  whatsOnYourMind: 'لە مێشکتدایە چییە؟',
  like: 'بەدڵبوون',
  comment: 'کۆمێنت',
  share: 'هاوبەشکردن',
  loading: 'باردەکرێت...',
  loginToPost: 'تکایە بچۆژوورەوە بۆ پۆستکردن.',
  signIn: 'چوونەژوورەوە',
  notifications: 'ئاگادارکردنەوەکان',
  search: 'گەڕان',
  studentsOnly: 'پۆستکردنی خوێندکاران تەنها بۆ هەژماری خوێندکارانە.',
}

export const UI_TEXT: Record<Language, TranslationMap> = { en, ar, ku }
