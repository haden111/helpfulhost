export interface Language {
  code: string;
  name: string;
}

// Using a smaller list for example, extend to 23 languages as required.
export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'ja', name: '日本語 (Japanese)' },
  { code: 'ko', name: '한국어 (Korean)' },
  { code: 'zh', name: '中文 (Chinese)' },
  { code: 'it', name: 'Italiano (Italian)' },
  { code: 'pt', name: 'Português (Portuguese)' },
  { code: 'ru', name: 'Русский (Russian)' },
  // Add more languages to reach 23, e.g.:
  // { code: 'ar', name: 'العربية (Arabic)' },
  // { code: 'hi', name: 'हिन्दी (Hindi)' },
  // { code: 'nl', name: 'Nederlands (Dutch)' },
  // { code: 'sv', name: 'Svenska (Swedish)' },
  // { code: 'pl', name: 'Polski (Polish)' },
  // { code: 'tr', name: 'Türkçe (Turkish)' },
];
