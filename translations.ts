import type { Language } from './types'

type TranslationMap = Record<string, string>

const en: TranslationMap = {
  appName: 'Community Hub',
  home: 'General Feed',
  campus: 'Campus',
  community: 'Community',
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
}

const ar: TranslationMap = {
  appName: 'منصة المجتمع',
  home: 'الخلاصة العامة',
  campus: 'الحرم الجامعي',
  community: 'المجتمع',
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
}

const ku: TranslationMap = {
  appName: 'کۆمەڵگە هەب',
  home: 'فیدی گشتی',
  campus: 'کامپەس',
  community: 'کۆمەڵگە',
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
}

export const UI_TEXT: Record<Language, TranslationMap> = { en, ar, ku }
