
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
// Removed useToast and Alert imports

const DEFAULT_TEXTS = {
  welcomeTitle: "A Warm Welcome to Haden's Airbnb",
  guestThankYou: "Thank you for being our guest! We're delighted to have you stay.",
  guideIntro: "This digital guide is here to provide you with all the information you need for a comfortable and convenient stay. Whether you need instructions for the appliances, details about the Wi-Fi, or guidance on recycling, you'll find it here in your own language.",
  languageSelectionInfo: "Simply choose your language from the selection box at thetop of the page to view the guide in your preferred language.",
  quickAccessHeader: "Quick Access Instructions:",
};
type DefaultTextKeys = keyof typeof DEFAULT_TEXTS;

export function WelcomeMessage() {
  const { language } = useLanguage();
  const [translatedTexts, setTranslatedTexts] = useState(DEFAULT_TEXTS);
  const [isLoading, setIsLoading] = useState(true);
  // Removed error state

  const fetchTranslations = useCallback(async () => {
    if (!language) {
      setIsLoading(true); 
      return;
    }

    setIsLoading(true);

    if (language.toLowerCase() === 'en') {
      setTranslatedTexts(DEFAULT_TEXTS);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/locales/${language.toLowerCase()}.json`);
      if (!response.ok) {
        console.warn(`Could not load translations for ${language}. Falling back to English.`);
        setTranslatedTexts(DEFAULT_TEXTS);
        setIsLoading(false);
        return;
      }
      const data = await response.json();
      
      const updatedTexts = { ...DEFAULT_TEXTS };
      for (const key of Object.keys(DEFAULT_TEXTS) as DefaultTextKeys[]) {
        if (data && typeof data[`welcome.${key}`] === 'string') {
          updatedTexts[key] = data[`welcome.${key}`];
        } else {
          // console.warn(`WelcomeMessage: Missing translation for key: welcome.${key} in ${language}.json. Falling back to default for this key.`);
          // Default is already in updatedTexts
        }
      }
      setTranslatedTexts(updatedTexts);

    } catch (e) {
      console.error('Translation fetch error in WelcomeMessage:', e);
      setTranslatedTexts(DEFAULT_TEXTS); // Fallback to default on error
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchTranslations();
  }, [fetchTranslations]);

  if (isLoading) {
    return (
      <>
        <CardTitle className="text-3xl font-bold text-primary">
          <Skeleton className="h-8 w-3/4 mb-2" />
        </CardTitle>
        <CardDescription className="text-foreground/80 mt-2 text-base space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </CardDescription>
        <div className="mt-6">
          <Skeleton className="h-6 w-1/2 mb-3" />
        </div>
      </>
    );
  }

  // Removed error display block

  return (
    <>
      <CardTitle className="text-3xl font-bold text-primary">{translatedTexts.welcomeTitle}</CardTitle>
      <CardDescription className="text-foreground/80 mt-2 text-base space-y-3">
        <p>{translatedTexts.guestThankYou}</p>
        <p>{translatedTexts.guideIntro}</p>
        <p>{translatedTexts.languageSelectionInfo}</p>
      </CardDescription>
      <div className="mt-6">
         <h3 className="text-lg font-semibold text-center text-foreground/90">{translatedTexts.quickAccessHeader}</h3>
      </div>
    </>
  );
}
