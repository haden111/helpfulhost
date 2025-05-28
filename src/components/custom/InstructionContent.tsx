
'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { translateInstructionalText } from '@/ai/flows/translate-instructional-text';
import type { InstructionLocation } from '@/lib/instructions-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface InstructionContentProps {
  locationData: InstructionLocation;
}

export function InstructionContent({ locationData }: InstructionContentProps) {
  const { language } = useLanguage();
  const { toast } = useToast();

  const [translatedTitle, setTranslatedTitle] = useState<string>('');
  const [translatedSteps, setTranslatedSteps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const translateContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!locationData) {
        setError("Instruction data is missing.");
        setIsLoading(false);
        return;
    }
    
    if (!language) {
        setError("Language not available for translation.");
        setIsLoading(false);
        return;
    }

    if (language.toLowerCase() === 'en') {
      setTranslatedTitle(locationData.defaultTexts.title);
      setTranslatedSteps(locationData.defaultTexts.steps);
      setIsLoading(false);
      return;
    }

    try {
      const textsToTranslate: Record<string, string> = {
        title: locationData.defaultTexts.title,
      };
      locationData.defaultTexts.steps.forEach((step, index) => {
        textsToTranslate[`step_${index}`] = step;
      });

      const result = await translateInstructionalText({
        textsToTranslate,
        language: language,
      });

      const { translatedTexts } = result;

      if (translatedTexts && translatedTexts.title) {
        setTranslatedTitle(translatedTexts.title);
      } else {
        console.warn(`Missing translation for title in InstructionContent. Falling back to default.`);
        setTranslatedTitle(locationData.defaultTexts.title);
      }

      const newTranslatedSteps: string[] = [];
      locationData.defaultTexts.steps.forEach((_, index) => {
        if (translatedTexts && translatedTexts[`step_${index}`]) {
          newTranslatedSteps.push(translatedTexts[`step_${index}`]);
        } else {
          console.warn(`Missing translation for step_${index} in InstructionContent. Falling back to default.`);
          newTranslatedSteps.push(locationData.defaultTexts.steps[index]); // Fallback to default for this specific step
        }
      });
      setTranslatedSteps(newTranslatedSteps);

    } catch (e) {
      console.error('Translation error in InstructionContent:', e);
      setError('Failed to translate content. Displaying in English.');
      toast({
        title: 'Translation Failed (Instructions)',
        description: 'Could not translate instructions. Showing default language. Please try another language or check console for errors.',
        variant: 'destructive',
        duration: 7000, 
      });
      setTranslatedTitle(locationData.defaultTexts.title);
      setTranslatedSteps(locationData.defaultTexts.steps);
    } finally {
      setIsLoading(false);
    }
  }, [language, locationData, toast]);

  useEffect(() => {
    translateContent();
  }, [translateContent]);

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl overflow-hidden">
      <CardHeader className="bg-muted/50 p-4 md:p-6">
        {isLoading ? (
          <Skeleton className="h-8 w-3/4" />
        ) : (
          <CardTitle className="text-2xl md:text-3xl font-semibold text-primary flex items-center gap-2">
            <Info className="h-7 w-7 text-primary" />
            {translatedTitle || locationData?.defaultTexts?.title}
          </CardTitle>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 relative aspect-[4/3] md:aspect-auto">
            {locationData?.image && (
              <Image
                src={locationData.image}
                alt={translatedTitle || locationData.defaultTexts.title}
                layout="fill"
                objectFit="cover"
                data-ai-hint={locationData.dataAiHint}
                priority
              />
            )}
          </div>
          <div className="w-full md:w-1/2 p-4 md:p-6 space-y-4">
            {error && !isLoading && ( 
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Translation Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : (
              <ul className="list-none space-y-3 text-foreground/90">
                {translatedSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3 p-2 bg-background rounded-md border border-border/50">
                    <span className="flex-shrink-0 h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-base">{step}</span>
                  </li>
                ))}
                {translatedSteps.length === 0 && !error && !isLoading && locationData?.defaultTexts?.steps?.length > 0 && (
                   <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Instructions Loading</AlertTitle>
                    <AlertDescription>Translated steps will appear here shortly.</AlertDescription>
                  </Alert>
                )}
                 {translatedSteps.length === 0 && locationData?.defaultTexts?.steps?.length === 0 && !isLoading && (
                  <Alert variant="default">
                    <Info className="h-4 w-4" />
                    <AlertTitle>No Instructions</AlertTitle>
                    <AlertDescription>There are currently no detailed steps for this item.</AlertDescription>
                  </Alert>
                )}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
