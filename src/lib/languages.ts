
export interface Language {
  code: string;
  name: string;
  emoji: string; // Added emoji field
}

// Top 23 most spoken languages globally with corresponding emojis
export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', emoji: '🇺🇸' },
  { code: 'zh', name: '中文 (Mandarin Chinese)', emoji: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी (Hindi)', emoji: '🇮🇳' },
  { code: 'es', name: 'Español (Spanish)', emoji: '🇲🇽' },
  { code: 'fr', name: 'Français (French)', emoji: '🇫🇷' },
  { code: 'ar', name: 'العربية (Arabic)', emoji: '🌍' },
  { code: 'bn', name: 'বাংলা (Bengali)', emoji: '🇧🇩' },
  { code: 'ru', name: 'Русский (Russian)', emoji: '🇷🇺' },
  { code: 'pt', name: 'Português (Portuguese)', emoji: '🇧🇷' },
  { code: 'ur', name: 'اردو (Urdu)', emoji: '🇵🇰' },
  { code: 'id', name: 'Bahasa Indonesia (Indonesian)', emoji: '🇮🇩' },
  { code: 'de', name: 'Deutsch (German)', emoji: '🇩🇪' },
  { code: 'ja', name: '日本語 (Japanese)', emoji: '🇯🇵' },
  { code: 'sw', name: 'Kiswahili (Swahili)', emoji: '🇹🇿' },
  { code: 'mr', name: 'मराठी (Marathi)', emoji: '🇮🇳' },
  { code: 'te', name: 'తెలుగు (Telugu)', emoji: '🇮🇳' },
  { code: 'tr', name: 'Türkçe (Turkish)', emoji: '🇹🇷' },
  { code: 'ta', name: 'தமிழ் (Tamil)', emoji: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)', emoji: '🇮🇳' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)', emoji: '🇻🇳' },
  { code: 'ko', name: '한국어 (Korean)', emoji: '🇰🇷' },
  { code: 'it', name: 'Italiano (Italian)', emoji: '🇮🇹' },
  { code: 'fa', name: 'فارسی (Persian)', emoji: '🇮🇷' },
];

