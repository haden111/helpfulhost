
export interface Language {
  code: string;
  name: string;
  flagCode: string; // Changed from emoji to flagCode
}

// Top 23 most spoken languages globally with corresponding flag codes
export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', flagCode: 'us' },
  { code: 'zh', name: '中文 (Mandarin Chinese)', flagCode: 'cn' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flagCode: 'in' },
  { code: 'es', name: 'Español (Spanish)', flagCode: 'mx' },
  { code: 'fr', name: 'Français (French)', flagCode: 'fr' },
  { code: 'ar', name: 'العربية (Arabic)', flagCode: 'globe' }, // Special case for globe icon
  { code: 'bn', name: 'বাংলা (Bengali)', flagCode: 'bd' },
  { code: 'ru', name: 'Русский (Russian)', flagCode: 'ru' },
  { code: 'pt', name: 'Português (Portuguese)', flagCode: 'br' },
  { code: 'ur', name: 'اردو (Urdu)', flagCode: 'pk' },
  { code: 'id', name: 'Bahasa Indonesia (Indonesian)', flagCode: 'id' },
  { code: 'de', name: 'Deutsch (German)', flagCode: 'de' },
  { code: 'ja', name: '日本語 (Japanese)', flagCode: 'jp' },
  { code: 'sw', name: 'Kiswahili (Swahili)', flagCode: 'tz' },
  { code: 'mr', name: 'मराठी (Marathi)', flagCode: 'in' },
  { code: 'te', name: 'తెలుగు (Telugu)', flagCode: 'in' },
  { code: 'tr', name: 'Türkçe (Turkish)', flagCode: 'tr' },
  { code: 'ta', name: 'தமிழ் (Tamil)', flagCode: 'in' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)', flagCode: 'in' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)', flagCode: 'vn' },
  { code: 'ko', name: '한국어 (Korean)', flagCode: 'kr' },
  { code: 'it', name: 'Italiano (Italian)', flagCode: 'it' },
  { code: 'fa', name: 'فارسی (Persian)', flagCode: 'ir' },
];
