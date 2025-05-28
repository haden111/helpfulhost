
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translateInstructionalText } from '@/ai/flows/translate-instructional-text';
import { Skeleton } from '@/components/ui/skeleton';

const DEFAULT_FOOTER_MESSAGE = "If you have further questions, send a message to Haden via the Airbnb app.";
const DEFAULT_COPYRIGHT_START = "© ";
const DEFAULT_COPYRIGHT_END = " Haden's Airbnb. All rights reserved.";

export function FooterContent() {
  const { language } = useLanguage();
  const [translatedFooterMessage, setTranslatedFooterMessage] = useState<string>(DEFAULT_FOOTER_MESSAGE);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const translateMessage = useCallback(async () => {
    if (!language) { // Don't attempt to translate if language is not yet available
        setIsLoading(true); // Keep loading true until language is available
        return;
    }
    setIsLoading(true);
    if (language.toLowerCase() === 'en') {
      setTranslatedFooterMessage(DEFAULT_FOOTER_MESSAGE);
      setIsLoading(false);
      return;
    }
    try {
      const result = await translateInstructionalText({
        text: DEFAULT_FOOTER_MESSAGE,
        language: language,
      });
      setTranslatedFooterMessage(result.translatedText);
    } catch (error) {
      console.error("Error translating footer message:", error);
      setTranslatedFooterMessage(DEFAULT_FOOTER_MESSAGE); // Fallback to default
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  useEffect(() => {
    translateMessage();
  }, [translateMessage]);

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
