
export interface Language {
  code: string;
  name: string;
  flagCode: string; // For flag images, or 'globe'
}

// Refined list of ~20 most spoken languages globally, with specific constraints for India and China.
export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', flagCode: 'us' },
  { code: 'zh', name: '中文 (Mandarin Chinese)', flagCode: 'cn' },
  { code: 'yue', name: '粵語 (Cantonese)', flagCode: 'cn' }, // Added Cantonese for China
  { code: 'hi', name: 'हिन्दी (Hindi)', flagCode: 'in' },
  { code: 'bn', name: 'বাংলা (Bengali)', flagCode: 'in' }, // Flag changed to 'in' for India's top 2
  { code: 'es', name: 'Español (Spanish)', flagCode: 'mx' },
  { code: 'fr', name: 'Français (French)', flagCode: 'fr' },
  { code: 'ar', name: 'العربية (Arabic)', flagCode: 'globe' },
  { code: 'ru', name: 'Русский (Russian)', flagCode: 'ru' },
  { code: 'pt', name: 'Português (Portuguese)', flagCode: 'br' },
  { code: 'ur', name: 'اردو (Urdu)', flagCode: 'pk' },
  { code: 'id', name: 'Bahasa Indonesia (Indonesian)', flagCode: 'id' },
  { code: 'de', name: 'Deutsch (German)', flagCode: 'de' },
  { code: 'ja', name: '日本語 (Japanese)', flagCode: 'jp' },
  { code: 'sw', name: 'Kiswahili (Swahili)', flagCode: 'tz' },
  // Marathi, Telugu, Tamil, Punjabi removed to keep India to 2 languages (Hindi, Bengali)
  { code: 'tr', name: 'Türkçe (Turkish)', flagCode: 'tr' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)', flagCode: 'vn' },
  { code: 'ko', name: '한국어 (Korean)', flagCode: 'kr' },
  { code: 'it', name: 'Italiano (Italian)', flagCode: 'it' },
  { code: 'fa', name: 'فارسی (Persian)', flagCode: 'ir' },
];
