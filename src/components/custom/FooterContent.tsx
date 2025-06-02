
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';

const DEFAULT_FOOTER_MESSAGE_KEY = "footerMessage";
const DEFAULT_FOOTER_MESSAGE_TEXT_WITH_PLACEHOLDER = "If you have further questions, send a message to Haden via the {airbnbAppLink}.";
const DEFAULT_COPYRIGHT_START = "© ";
const DEFAULT_COPYRIGHT_END = " Haden's Airbnb. All rights reserved.";
const AIRBNB_APP_LINK_TEXT = "Airbnb app";
const AIRBNB_DESKTOP_URL = "https://www.airbnb.co.uk/guest/inbox";
const AIRBNB_APP_SCHEME = "airbnb://";

export function FooterContent() {
  const { language } = useLanguage();
  const [translatedFooterMessage, setTranslatedFooterMessage] = useState<string>(DEFAULT_FOOTER_MESSAGE_TEXT_WITH_PLACEHOLDER);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [airbnbLinkUrl, setAirbnbLinkUrl] = useState<string>(AIRBNB_DESKTOP_URL);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.userAgent) {
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes("iphone") || userAgent.includes("ipad") || userAgent.includes("android")) {
        setAirbnbLinkUrl(AIRBNB_APP_SCHEME);
      }
    }
  }, []);

  const fetchFooterTranslation = useCallback(async () => {
    if (!language) { 
        setIsLoading(true);
        return;
    }
    setIsLoading(true);
    if (language.toLowerCase() === 'en') {
      setTranslatedFooterMessage(DEFAULT_FOOTER_MESSAGE_TEXT_WITH_PLACEHOLDER);
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(`/locales/${language.toLowerCase()}.json`);
      if (!response.ok) {
        console.warn(`Could not load translations for footer in ${language}. Falling back to English.`);
        setTranslatedFooterMessage(DEFAULT_FOOTER_MESSAGE_TEXT_WITH_PLACEHOLDER);
        setIsLoading(false);
        return;
      }
      const translations = await response.json();

      if (translations && typeof translations[`footer.${DEFAULT_FOOTER_MESSAGE_KEY}`] === 'string') {
        setTranslatedFooterMessage(translations[`footer.${DEFAULT_FOOTER_MESSAGE_KEY}`]);
      } else {
        setTranslatedFooterMessage(DEFAULT_FOOTER_MESSAGE_TEXT_WITH_PLACEHOLDER); 
      }
      
    } catch (error) {
      console.error("Error fetching footer translation:", error);
      setTranslatedFooterMessage(DEFAULT_FOOTER_MESSAGE_TEXT_WITH_PLACEHOLDER); 
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchFooterTranslation();
  }, [fetchFooterTranslation]);

  const currentYear = new Date().getFullYear();

  const renderFooterMessage = () => {
    const parts = translatedFooterMessage.split('{airbnbAppLink}');
    if (parts.length > 1) {
      return (
        <>
          {parts[0]}
          <a 
            href={airbnbLinkUrl} 
            className="underline hover:text-primary transition-colors"
            target={airbnbLinkUrl.startsWith('http') ? '_blank' : '_self'} // Open web links in new tab
            rel={airbnbLinkUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {AIRBNB_APP_LINK_TEXT}
          </a>
          {parts[1]}
        </>
      );
    }
    return translatedFooterMessage; // Fallback if placeholder not found
  };

  return (
    <>
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
      ) : (
        <>
          <p className="mb-2">{renderFooterMessage()}</p>
          <p>{DEFAULT_COPYRIGHT_START}{currentYear}{DEFAULT_COPYRIGHT_END}</p>
        </>
      )}
    </>
  );
}
