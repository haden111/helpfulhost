
export interface Language {
  code: string;
  name: string;
  flagCode: string; // For flag images, or 'globe'
}

// European languages first, sorted alphabetically by English name.
// Then, Rest of World languages, sorted roughly by number of speakers.
export const supportedLanguages: Language[] = [
  // European Languages (Alphabetical)
  { code: 'bg', name: 'Български (Bulgarian)', flagCode: 'bg' },
  { code: 'cs', name: 'Čeština (Czech)', flagCode: 'cz' },
  { code: 'nl', name: 'Nederlands (Dutch)', flagCode: 'nl' },
  { code: 'en', name: 'English', flagCode: 'us' }, // Flag by most speakers (US), grouped by origin
  { code: 'fi', name: 'Suomi (Finnish)', flagCode: 'fi' },
  { code: 'fr', name: 'Français (French)', flagCode: 'fr' },
  { code: 'de', name: 'Deutsch (German)', flagCode: 'de' },
  { code: 'el', name: 'Ελληνικά (Greek)', flagCode: 'gr' },
  { code: 'hu', name: 'Magyar (Hungarian)', flagCode: 'hu' },
  { code: 'it', name: 'Italiano (Italian)', flagCode: 'it' },
  { code: 'pl', name: 'Polski (Polish)', flagCode: 'pl' },
  { code: 'pt', name: 'Português (Portuguese)', flagCode: 'br' }, // Flag by most speakers (Brazil), grouped by origin
  { code: 'ro', name: 'Română (Romanian)', flagCode: 'ro' },
  { code: 'ru', name: 'Русский (Russian)', flagCode: 'ru' },
  { code: 'es', name: 'Español (Spanish)', flagCode: 'mx' }, // Flag by most speakers (Mexico), grouped by origin
  { code: 'sv', name: 'Svenska (Swedish)', flagCode: 'se' },
  { code: 'tr', name: 'Türkçe (Turkish)', flagCode: 'tr' }, // Geographically spans Europe/Asia

  // Rest of World Languages (Roughly by speaker population)
  { code: 'zh', name: '中文 (Mandarin Chinese)', flagCode: 'cn' },
  { code: 'yue', name: '粵語 (Cantonese)', flagCode: 'cn' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flagCode: 'in' },
  { code: 'ar', name: 'العربية (Arabic)', flagCode: 'globe' },
  { code: 'bn', name: 'বাংলা (Bengali)', flagCode: 'in' }, // Representing India's 2nd major language
  { code: 'ur', name: 'اردو (Urdu)', flagCode: 'pk' },
  { code: 'id', name: 'Bahasa Indonesia (Indonesian)', flagCode: 'id' },
  { code: 'ja', name: '日本語 (Japanese)', flagCode: 'jp' },
  { code: 'sw', name: 'Kiswahili (Swahili)', flagCode: 'tz' }, // Tanzania for Swahili
  { code: 'ko', name: '한국어 (Korean)', flagCode: 'kr' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)', flagCode: 'vn' },
  { code: 'fa', name: 'فارسی (Persian)', flagCode: 'ir' },
];
