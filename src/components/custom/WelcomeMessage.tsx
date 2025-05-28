
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translateInstructionalText } from '@/ai/flows/translate-instructional-text';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const { toast } = useToast();

  const [translatedTexts, setTranslatedTexts] = useState(DEFAULT_TEXTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const translateAllTexts = useCallback(async () => {
    if (!language) {
      setIsLoading(true); 
      return;
    }

    setIsLoading(true);
    setError(null);

    if (language.toLowerCase() === 'en') {
      setTranslatedTexts(DEFAULT_TEXTS);
      setIsLoading(false);
      return;
    }

    try {
      const result = await translateInstructionalText({ 
        textsToTranslate: DEFAULT_TEXTS, 
        language 
      });
      
      // Ensure all keys are present in the result, fallback to default if not
      const updatedTexts = { ...DEFAULT_TEXTS };
      for (const key of Object.keys(DEFAULT_TEXTS) as DefaultTextKeys[]) {
        if (result.translatedTexts && result.translatedTexts[key]) {
          updatedTexts[key] = result.translatedTexts[key];
        } else {
          console.warn(`Missing translation for key: ${key} in WelcomeMessage. Falling back to default.`);
        }
      }
      setTranslatedTexts(updatedTexts);

    } catch (e) {
      console.error('Translation error in WelcomeMessage:', e);
      setError('Failed to translate welcome message. Displaying in English.');
      toast({
        title: 'Translation Failed (Welcome Message)',
        description: 'Could not translate the welcome message. Showing default language.',
        variant: 'destructive',
        duration: 5000,
      });
      setTranslatedTexts(DEFAULT_TEXTS); // Fallback to default
    } finally {
      setIsLoading(false);
    }
  }, [language, toast]);

  useEffect(() => {
    translateAllTexts();
  }, [translateAllTexts]);

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

  if (error) {
    return (
      <>
        <CardTitle className="text-3xl font-bold text-primary">{DEFAULT_TEXTS.welcomeTitle}</CardTitle>
        <CardDescription className="text-foreground/80 mt-2 text-base space-y-3">
          <Alert variant="destructive" className="my-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Translation Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <p>{DEFAULT_TEXTS.guestThankYou}</p>
          <p>{DEFAULT_TEXTS.guideIntro}</p>
          <p>{DEFAULT_TEXTS.languageSelectionInfo}</p>
        </CardDescription>
        <div className="mt-6">
           <h3 className="text-lg font-semibold text-center text-foreground/90">{DEFAULT_TEXTS.quickAccessHeader}</h3>
        </div>
      </>
    );
  }

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
