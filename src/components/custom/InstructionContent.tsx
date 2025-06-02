
'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { translateInstructionalText } from '@/ai/flows/translate-instructional-text';
import type { InstructionLocation, StepInstruction } from '@/lib/instructions-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface InstructionContentProps {
  locationData: InstructionLocation;
}

interface TranslatedStep extends StepInstruction {
  // 'text' will be the translated text, other fields from original StepInstruction
}

export function InstructionContent({ locationData }: InstructionContentProps) {
  const { language } = useLanguage();
  const { toast } = useToast();

  const [translatedTitle, setTranslatedTitle] = useState<string>('');
  const [translatedSteps, setTranslatedSteps] = useState<TranslatedStep[]>([]);
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

    const defaultTitle = locationData.defaultTexts.title;
    const defaultSteps = locationData.defaultTexts.steps;

    if (!language) {
      setTranslatedTitle(defaultTitle);
      setTranslatedSteps(defaultSteps.map(step => ({ ...step })));
      setIsLoading(false);
      return;
    }

    if (language.toLowerCase() === 'en') {
      setTranslatedTitle(defaultTitle);
      setTranslatedSteps(defaultSteps.map(step => ({ ...step })));
      setIsLoading(false);
      return;
    }

    try {
      const textsToTranslate: Record<string, string> = {
        title: defaultTitle,
      };
      defaultSteps.forEach((step, index) => {
        textsToTranslate[`step_${index}_text`] = step.text;
      });

      const result = await translateInstructionalText({
        textsToTranslate,
        language: language,
      });

      const { translatedTexts: R_translatedTexts } = result;
      let newTranslatedTitle = defaultTitle;
      let titleIsIdenticalToDefault = true;

      if (R_translatedTexts && typeof R_translatedTexts.title === 'string') {
        newTranslatedTitle = R_translatedTexts.title;
        if (newTranslatedTitle !== defaultTitle) {
          titleIsIdenticalToDefault = false;
        }
      } else {
        console.warn(`InstructionContent: Missing translation for title. Falling back to default.`);
      }
      setTranslatedTitle(newTranslatedTitle);

      let stepsAreCompletelyIdenticalToDefault = true;
      const tempTranslatedSteps: TranslatedStep[] = defaultSteps.map((originalStep, index) => {
        const translatedText = R_translatedTexts?.[`step_${index}_text`];
        if (translatedText && typeof translatedText === 'string') {
          if (translatedText !== originalStep.text) {
            stepsAreCompletelyIdenticalToDefault = false;
          }
          return { ...originalStep, text: translatedText };
        } else {
          console.warn(`InstructionContent: Missing translation for step_${index}_text. Falling back to default.`);
          return { ...originalStep }; 
        }
      });
      setTranslatedSteps(tempTranslatedSteps);

      if (titleIsIdenticalToDefault && stepsAreCompletelyIdenticalToDefault && language.toLowerCase() !== 'en') {
        console.warn(`InstructionContent: Received translations for language '${language}' are identical to English defaults for "${defaultTitle}". Upstream fallback likely occurred.`);
        toast({
          title: 'Translation May Be Incomplete (Instructions)',
          description: `Displaying content in English as translation to ${language} for "${defaultTitle}" might not have been fully successful.`,
          variant: 'default',
          duration: 7000,
        });
      }

    } catch (e) {
      console.error('Translation error in InstructionContent:', e);
      setError(`Failed to translate content for "${defaultTitle}". Displaying in English.`);
      toast({
        title: `Translation Failed (${defaultTitle})`,
        description: 'Could not translate instructions. Showing default language.',
        variant: 'destructive',
        duration: 7000,
      });
      setTranslatedTitle(defaultTitle);
      setTranslatedSteps(defaultSteps.map(step => ({ ...step })));
    } finally {
      setIsLoading(false);
    }
  }, [language, locationData, toast]);

  useEffect(() => {
    if (locationData) {
      translateContent();
    } else {
      setIsLoading(false);
      setError("Instruction data is not available.");
    }
  }, [translateContent, locationData]);

  if (!locationData && !isLoading) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Instruction data is missing and content cannot be displayed.</AlertDescription>
      </Alert>
    );
  }

  const currentTitle = translatedTitle || locationData?.defaultTexts?.title;
  const currentSteps = (translatedSteps.length > 0 ? translatedSteps : (locationData?.defaultTexts?.steps.map(step => ({ ...step }))) || []);


  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl overflow-hidden">
      <CardHeader className="bg-muted/50 p-4 md:p-6">
        {isLoading && !currentTitle ? (
          <Skeleton className="h-8 w-3/4" />
        ) : (
          <CardTitle className="text-2xl md:text-3xl font-semibold text-primary flex items-center gap-2">
            <Info className="h-7 w-7 text-primary" />
            {currentTitle}
          </CardTitle>
        )}
      </CardHeader>
      <CardContent className="p-4 md:p-6 space-y-6">
        {locationData?.image && (
          <div className="mb-6 rounded-lg overflow-hidden shadow-md">
            <Image
              src={locationData.image}
              alt={currentTitle || 'Location image'}
              width={800}
              height={450}
              className="w-full h-auto object-cover"
              data-ai-hint={locationData.dataAiHint}
              priority
            />
          </div>
        )}

        {error && !isLoading && (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Translation Issue</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && currentSteps.length === 0 ? (
          <div className="space-y-8">
            {[1, 2].map(i => (
              <div key={i} className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch p-4 bg-background rounded-lg border border-border/50 shadow-sm">
                <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                  <Skeleton className="aspect-[370/500] w-full rounded-lg" />
                </div>
                <div className="w-full md:w-2/3 lg:w-3/4 flex items-center">
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {currentSteps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch p-4 bg-card rounded-lg border border-border/30 shadow-md hover:shadow-lg transition-shadow duration-300">
                {/* Image Cell */}
                <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 self-center md:self-auto"> {/* Centered image on mobile */}
                  <div className="relative aspect-[370/500] w-full max-w-[200px] md:max-w-none mx-auto md:mx-0 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg">
                    <Image
                      src={step.image || `https://placehold.co/370x500.png`}
                      alt={step.text.substring(0, 50) + '...' || `Instruction step ${index + 1}`}
                      fill
                      objectFit="cover"
                      sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                      className="transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={step.dataAiHint}
                    />
                  </div>
                </div>
                {/* Text Cell */}
                <div className="w-full md:w-2/3 lg:w-3/4 flex items-center py-2">
                  <p className="text-base text-foreground/90 leading-relaxed">
                    <span className="font-semibold text-primary">{index + 1}. </span>{step.text}
                  </p>
                </div>
              </div>
            ))}
            {currentSteps.length === 0 && !error && !isLoading && locationData?.defaultTexts?.steps?.length > 0 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Instructions Loading</AlertTitle>
                <AlertDescription>Translated steps will appear here shortly.</AlertDescription>
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
