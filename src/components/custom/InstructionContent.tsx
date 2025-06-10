
'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import type { InstructionLocation, StepInstruction } from '@/lib/instructions-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface InstructionContentProps {
  locationData: InstructionLocation;
}

interface DisplayStep extends StepInstruction {
  // 'text' will be the translated text, other fields from original StepInstruction
}

const getLocationCodeFromTitle = (title: string, data: Record<string, InstructionLocation>): string | undefined => {
  return Object.keys(data).find(key => data[key].defaultTexts.title === title);
};

export function InstructionContent({ locationData }: InstructionContentProps) {
  const { language } = useLanguage();

  const [displayTitle, setDisplayTitle] = useState<string>('');
  const [displaySteps, setDisplaySteps] = useState<DisplayStep[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadAndTranslateContent = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    if (!locationData) {
      setFetchError("Instruction data is missing for this location.");
      setIsLoading(false);
      return;
    }

    const defaultTitle = locationData.defaultTexts.title;
    const defaultSteps = locationData.defaultTexts.steps;

    if (!language) {
      setDisplayTitle(defaultTitle);
      setDisplaySteps(defaultSteps.map(step => ({ ...step })));
      setIsLoading(false);
      return;
    }

    if (language.toLowerCase() === 'en') {
      setDisplayTitle(defaultTitle);
      setDisplaySteps(defaultSteps.map(step => ({ ...step })));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/locales/${language.toLowerCase()}.json`);
      if (!response.ok) {
        console.warn(`Could not load translations for ${language} for instruction ${locationData.defaultTexts.title}. Falling back to English.`);
        setDisplayTitle(defaultTitle);
        setDisplaySteps(defaultSteps.map(step => ({ ...step })));
        setIsLoading(false);
        return;
      }
      const translations = await response.json();
      
      const instructionsDataModule = await import('@/lib/instructions-data');
      const locationCode = getLocationCodeFromTitle(locationData.defaultTexts.title, instructionsDataModule.instructionsData);

      let newTranslatedTitle = defaultTitle;
      if (locationCode && translations && typeof translations[`instructions.${locationCode}.title`] === 'string') {
        newTranslatedTitle = translations[`instructions.${locationCode}.title`];
      }
      setDisplayTitle(newTranslatedTitle);

      const tempTranslatedSteps: DisplayStep[] = defaultSteps.map((originalStep, index) => {
        let translatedText = originalStep.text;
        if (locationCode && translations && typeof translations[`instructions.${locationCode}.step.${index}`] === 'string') {
          translatedText = translations[`instructions.${locationCode}.step.${index}`];
        }
        // Carry over all original properties, including image, dataAiHint, and textColor
        return { ...originalStep, text: translatedText };
      });
      setDisplaySteps(tempTranslatedSteps);

    } catch (e) {
      console.error('Translation fetch error in InstructionContent:', e);
      setFetchError(`Failed to load translations for "${defaultTitle}". Displaying in English.`);
      setDisplayTitle(defaultTitle);
      setDisplaySteps(defaultSteps.map(step => ({ ...step })));
    } finally {
      setIsLoading(false);
    }
  }, [language, locationData]);

  useEffect(() => {
    if (locationData) {
      loadAndTranslateContent();
    } else {
      setIsLoading(false);
      setFetchError("Instruction data is not available for this page.");
    }
  }, [loadAndTranslateContent, locationData]);

  if (!locationData && !isLoading) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{fetchError || "Instruction data is missing and content cannot be displayed."}</AlertDescription>
      </Alert>
    );
  }

  const currentTitle = displayTitle || locationData?.defaultTexts?.title;
  const currentSteps = (displaySteps.length > 0 ? displaySteps : (locationData?.defaultTexts?.steps.map(step => ({ ...step }))) || []);

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl overflow-hidden">
      <CardHeader className="bg-muted/50 p-4 md:p-6">
        {isLoading && !currentTitle ? (
          <Skeleton className="h-8 w-3/4" />
        ) : (
          <CardTitle className="text-2xl md:text-3xl font-semibold text-primary">
            {currentTitle}
          </CardTitle>
        )}
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
        {/* Removed the main locationData.image rendering block */}

        {fetchError && !isLoading && (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Loading Issue</AlertTitle>
            <AlertDescription>{fetchError}</AlertDescription>
          </Alert>
        )}

        {isLoading && currentSteps.length === 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="flex flex-row gap-3 sm:gap-4 items-stretch p-3 sm:p-4 bg-card rounded-lg border border-border/30 shadow-md">
                <div className="w-2/5 sm:w-1/3 flex-shrink-0">
                  <div className="relative aspect-[370/500] w-full rounded-lg overflow-hidden shadow-sm">
                    <Skeleton className="w-full h-full" />
                  </div>
                </div>
                <div className="w-3/5 sm:w-2/3 flex items-center py-1 sm:py-2">
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-5 sm:h-6 w-full" />
                    <Skeleton className="h-5 sm:h-6 w-5/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {currentSteps.map((step, index) => (
              <div key={index} className="flex flex-row gap-3 sm:gap-4 items-stretch p-3 sm:p-4 bg-card rounded-lg border border-border/30 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-2/5 sm:w-1/3 flex-shrink-0">
                  <div className="relative aspect-[370/500] w-full rounded-lg overflow-hidden shadow-sm group-hover:shadow-md">
                    <Image
                      src={step.image || `https://placehold.co/370x500.png`}
                      alt={step.text.substring(0, 50) + '...' || `Instruction step ${index + 1}`}
                      fill
                      sizes="(max-width: 639px) 40vw, (max-width: 767px) 40vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={step.dataAiHint}
                    />
                  </div>
                </div>
                <div className="w-3/5 sm:w-2/3 flex items-center py-1 sm:py-2 pl-1 sm:pl-2">
                  <p className={cn(
                      "text-sm sm:text-base text-foreground/90 leading-relaxed",
                      step.textColor === 'green' && "text-green-600", // Tailwind class for green
                      step.textColor === 'red' && "text-destructive" // Theme variable for red
                    )}>
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
            {currentSteps.length === 0 && !fetchError && !isLoading && locationData?.defaultTexts?.steps?.length > 0 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Instructions Ready</AlertTitle>
                <AlertDescription>Text will appear here shortly.</AlertDescription>
              </Alert>
            )}
            {currentSteps.length === 0 && locationData?.defaultTexts?.steps?.length === 0 && !isLoading && (
              <Alert variant="default">
                <Info className="h-4 w-4" />
                <AlertTitle>No Instructions</AlertTitle>
                <AlertDescription>There are currently no detailed steps for this item.</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
