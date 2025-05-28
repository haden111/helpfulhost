
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translateInstructionalText } from '@/ai/flows/translate-instructional-text';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_FOOTER_MESSAGE_KEY = "footerMessage";
const DEFAULT_FOOTER_MESSAGE_TEXT = "If you have further questions, send a message to Haden via the Airbnb app.";
const DEFAULT_COPYRIGHT_START = "© ";
const DEFAULT_COPYRIGHT_END = " Haden's Airbnb. All rights reserved.";

export function FooterContent() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [translatedFooterMessage, setTranslatedFooterMessage] = useState<string>(DEFAULT_FOOTER_MESSAGE_TEXT);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const translateMessage = useCallback(async () => {
    if (!language) { 
        // This state should ideally be temporary as language context initializes
        setTranslatedFooterMessage(DEFAULT_FOOTER_MESSAGE_TEXT);
        setIsLoading(false); // Or true, depending on desired behavior before lang is ready
        return;
    }
    setIsLoading(true);
    if (language.toLowerCase() === 'en') {
      setTranslatedFooterMessage(DEFAULT_FOOTER_MESSAGE_TEXT);
      setIsLoading(false);
      return;
    }
    try {
      const textsToTranslate = { [DEFAULT_FOOTER_MESSAGE_KEY]: DEFAULT_FOOTER_MESSAGE_TEXT };
      const result = await translateInstructionalText({
        textsToTranslate,
        language: language,
      });

      if (result.translatedTexts && typeof result.translatedTexts[DEFAULT_FOOTER_MESSAGE_KEY] === 'string') {
        const receivedTranslation = result.translatedTexts[DEFAULT_FOOTER_MESSAGE_KEY];
        setTranslatedFooterMessage(receivedTranslation);

        if (receivedTranslation === DEFAULT_FOOTER_MESSAGE_TEXT && language.toLowerCase() !== 'en') {
            console.warn(`FooterContent: Received translation for language '${language}' is identical to English default. Upstream fallback likely occurred.`);
            toast({
                title: 'Translation May Be Incomplete (Footer)',
                description: `Displaying footer in English as translation to ${language} might not have been fully successful.`,
                variant: 'default',
                duration: 7000,
            });
        }
      } else {
        console.warn("FooterContent: Missing translation for footer message in result. Falling back to default.");
        setTranslatedFooterMessage(DEFAULT_FOOTER_MESSAGE_TEXT); // Fallback to default
         toast({ // Also toast if explicitly missing
            title: 'Translation Issue (Footer)',
            description: `Could not retrieve translation for footer in ${language}. Displaying in English.`,
            variant: 'default',
            duration: 7000,
        });
      }
      
    } catch (error) {
      console.error("Error translating footer message:", error);
      setTranslatedFooterMessage(DEFAULT_FOOTER_MESSAGE_TEXT); // Fallback to default on error
      toast({
        title: 'Translation Failed (Footer)',
        description: 'Could not translate the footer message. Showing default language.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [language, toast]);

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
