
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supportedLanguages, type Language } from '@/lib/languages';
// Removed useToast import

const COOKIE_NAME = 'hadens-helpful-host-lang';

interface LanguageContextType {
  language: string;
  setLanguage: (langCode: string) => void;
  availableLanguages: Language[];
  isLanguageSupported: (langCode: string) => boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper functions for cookies
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
};

const setCookie = (name: string, value: string, days: number = 365) => {
  if (typeof document === 'undefined') return;
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/; SameSite=Lax";
};

export const LanguageProvider = ({
  children,
  initialDetectedLanguage,
}: {
  children: ReactNode;
  initialDetectedLanguage: string | null;
}) => {
  // Removed toast instance

  const isLanguageSupported = useCallback((langCode: string): boolean => {
    return supportedLanguages.some(l => l.code.toLowerCase() === langCode.toLowerCase());
  }, []);

  // Initialize state using a function for one-time computation
  const [currentLanguage, setCurrentLanguageState] = useState<string>(() => {
    const langFromCookie = getCookie(COOKIE_NAME);
    if (langFromCookie && isLanguageSupported(langFromCookie)) {
      return langFromCookie;
    }

    if (initialDetectedLanguage) {
      const baseLang = initialDetectedLanguage.split('-')[0].toLowerCase();
      if (isLanguageSupported(baseLang)) {
        return baseLang;
      }
    }
    
    if (isLanguageSupported('en')) return 'en'; // Default to English
    return supportedLanguages.length > 0 ? supportedLanguages[0].code : 'en'; // Absolute fallback
  });

  useEffect(() => {
    // This effect ensures the html lang attribute is updated whenever currentLanguage changes.
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage]);

  const setLanguage = (langCode: string) => {
    const normalizedLangCode = langCode.toLowerCase();
    if (isLanguageSupported(normalizedLangCode)) {
      setCurrentLanguageState(normalizedLangCode);
      setCookie(COOKIE_NAME, normalizedLangCode);
    } else {
      console.warn(`Unsupported language selected: "${langCode}". Language not changed.`);
      // Removed toast call for unsupported language
    }
  };

  return (
    <LanguageContext.Provider value={{ language: currentLanguage, setLanguage, availableLanguages: supportedLanguages, isLanguageSupported }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
