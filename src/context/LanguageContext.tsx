
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supportedLanguages, type Language } from '@/lib/languages';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const isLanguageSupported = useCallback((langCode: string): boolean => {
    return supportedLanguages.some(l => l.code === langCode);
  }, []);

  const getDefaultLanguage = useCallback((): string => {
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
    
    if (isLanguageSupported('en')) return 'en';
    return supportedLanguages.length > 0 ? supportedLanguages[0].code : 'en'; // Fallback
  }, [initialDetectedLanguage, isLanguageSupported]);

  const [currentLanguage, setCurrentLanguageState] = useState<string>(getDefaultLanguage());

  useEffect(() => {
    // Ensure currentLanguage is always valid on mount or if supportedLanguages changes
    const defaultLang = getDefaultLanguage();
    if(currentLanguage !== defaultLang && !getCookie(COOKIE_NAME)) { // Prioritize cookie if exists
         setCurrentLanguageState(defaultLang);
    }
  }, [getDefaultLanguage, currentLanguage]);


  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage]);

  const setLanguage = (langCode: string) => {
    if (isLanguageSupported(langCode)) {
      setCurrentLanguageState(langCode);
      setCookie(COOKIE_NAME, langCode);
    } else {
      toast({
        title: "Unsupported Language",
        description: `The language "${langCode}" is not supported.`,
        variant: "destructive",
      });
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
