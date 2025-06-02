
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
// Removed useToast import

const DEFAULT_FOOTER_MESSAGE_KEY = "footerMessage"; // This key will be used for the JSON file.
const DEFAULT_FOOTER_MESSAGE_TEXT = "If you have further questions, send a message to Haden via the Airbnb app.";
const DEFAULT_COPYRIGHT_START = "© ";
const DEFAULT_COPYRIGHT_END = " Haden's Airbnb. All rights reserved.";

export function FooterContent() {
  const { language } = useLanguage();
  const [translatedFooterMessage, setTranslatedFooterMessage] = useState<string>(DEFAULT_FOOTER_MESSAGE_TEXT);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchFooterTranslation = useCallback(async () => {
    if (!language) { 
        setIsLoading(true); // Still loading if language isn't ready
        return;
    }
    setIsLoading(true);
    if (language.toLowerCase() === 'en') {
      setTranslatedFooterMessage(DEFAULT_FOOTER_MESSAGE_TEXT);
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(`/locales/${language.toLowerCase()}.json`);
      if (!response.ok) {
        console.warn(`Could not load translations for footer in ${language}. Falling back to English.`);
        setTranslatedFooterMessage(DEFAULT_FOOTER_MESSAGE_TEXT);
        setIsLoading(false);
        return;
      }
      const translations = await response.json();

      if (translations && typeof translations[`footer.${DEFAULT_FOOTER_MESSAGE_KEY}`] === 'string') {
        setTranslatedFooterMessage(translations[`footer.${DEFAULT_FOOTER_MESSAGE_KEY}`]);
      } else {
        // console.warn(`FooterContent: Missing translation for footer key: footer.${DEFAULT_FOOTER_MESSAGE_KEY} in ${language}.json. Falling back to default.`);
        setTranslatedFooterMessage(DEFAULT_FOOTER_MESSAGE_TEXT); // Fallback to default
      }
      
    } catch (error) {
      console.error("Error fetching footer translation:", error);
      setTranslatedFooterMessage(DEFAULT_FOOTER_MESSAGE_TEXT); // Fallback to default on error
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchFooterTranslation();
  }, [fetchFooterTranslation]);

  const currentYear = new Date().getFullYear();

  return (
    <>
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
      ) : (
        <>
          <p className="mb-2">{translatedFooterMessage}</p>
          <p>{DEFAULT_COPYRIGHT_START}{currentYear}{DEFAULT_COPYRIGHT_END}</p>
        </>
      )}
    </>
  );
}
