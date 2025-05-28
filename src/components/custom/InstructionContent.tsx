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
    if (!locationData) return;

    setIsLoading(true);
    setError(null);

    // Use default English text if target language is English to avoid unnecessary API calls
    if (language === 'en') {
      setTranslatedTitle(locationData.defaultTexts.title);
      setTranslatedSteps(locationData.defaultTexts.steps);
      setIsLoading(false);
      return;
    }

    try {
      const titlePromise = translateInstructionalText({
        text: locationData.defaultTexts.title,
        language: language,
      });
      const stepsPromises = locationData.defaultTexts.steps.map(step =>
        translateInstructionalText({ text: step, language: language })
      );

      const [titleResult, ...stepsResults] = await Promise.all([titlePromise, ...stepsPromises]);
      
      setTranslatedTitle(titleResult.translatedText);
      setTranslatedSteps(stepsResults.map(r => r.translatedText));

    } catch (e) {
      console.error('Translation error:', e);
      setError('Failed to translate content. Displaying in English.');
      toast({
        title: 'Translation Failed',
        description: 'Could not translate instructions. Showing default language.',
        variant: 'destructive',
      });
      // Fallback to default English text on error
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
            {translatedTitle}
          </CardTitle>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 relative aspect-[4/3] md:aspect-auto">
            <Image
              src={locationData.image}
              alt={translatedTitle || locationData.defaultTexts.title}
              layout="fill"
              objectFit="cover"
              data-ai-hint={locationData.dataAiHint}
              priority
            />
          </div>
          <div className="w-full md:w-1/2 p-4 md:p-6 space-y-4">
            {error && (
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
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
