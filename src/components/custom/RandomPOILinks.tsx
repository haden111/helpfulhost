
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { instructionsData, type InstructionLocation } from '@/lib/instructions-data'; 
import { Button } from '@/components/ui/button';
import { ArrowRightCircle, ListChecks } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RandomPOILinksProps {
  currentLocationCode: string;
}

interface POILink {
  code: string;
  title: string;
  emoji?: string; 
}

export function RandomPOILinks({ currentLocationCode }: RandomPOILinksProps) {
  const [linksToShow, setLinksToShow] = useState<POILink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentLocationData = instructionsData[currentLocationCode];
    let selectedCodes: string[] = [];

    // Prioritize specified related links
    if (currentLocationData?.relatedLinks && currentLocationData.relatedLinks.length > 0) {
      selectedCodes = currentLocationData.relatedLinks.slice(0, 3);
    } else {
      // Fallback to random links if none are specified
      const allCodes = Object.keys(instructionsData);
      const availableCodes = allCodes.filter(code => code !== currentLocationCode);
      
      if (availableCodes.length > 0) {
        const shuffled = [...availableCodes].sort(() => 0.5 - Math.random());
        selectedCodes = shuffled.slice(0, Math.min(3, availableCodes.length));
      }
    }

    if (selectedCodes.length === 0) {
      setLinksToShow([]);
      setIsLoading(false);
      return;
    }

    const links = selectedCodes
      .map(code => {
        const locationInfo = instructionsData[code];
        if (!locationInfo) return null; // Skip if code is invalid
        return {
          code,
          title: locationInfo.defaultTexts.title,
          emoji: locationInfo.linkIconEmoji, 
        } as POILink;
      })
      .filter((link): link is POILink => link !== null); // Filter out any nulls
    
    setLinksToShow(links);
    setIsLoading(false);
  }, [currentLocationCode]);

  if (isLoading) {
    return (
      <div className="mt-12 pt-8 border-t">
        <h3 className="text-xl font-semibold mb-6 text-center text-primary">
          <Skeleton className="h-7 w-1/2 mx-auto" />
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (linksToShow.length === 0) {
    return null; 
  }

  const formatLinkTitle = (title: string) => {
    // First, remove emojis
    let cleanedTitle = title.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1FFFF}]/gu, '');
    // Then, remove "Instructions" or "Instruction" (case-insensitive, whole word)
    cleanedTitle = cleanedTitle.replace(/\bInstructions?\b/gi, '');
    // Trim any leading/trailing whitespace that might result
    return cleanedTitle.trim();
  };

  return (
    <div className="mt-12 pt-8 border-t">
      <h3 className="text-xl font-semibold mb-6 text-center text-primary flex items-center justify-center gap-2">
        <ListChecks className="h-6 w-6" />
        Explore Other Instructions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {linksToShow.map(link => (
          <Button variant="outline" className="w-full justify-start text-left h-auto p-3 shadow-sm hover:shadow-md transition-shadow" asChild key={link.code}>
            <Link href={`/instructions/${link.code}`} className="flex items-center gap-2">
              {link.emoji ? (
                <span className="text-lg flex-shrink-0 w-6 text-center">{link.emoji}</span>
              ) : (
                <ArrowRightCircle className="h-5 w-5 text-accent flex-shrink-0" />
              )}
              <div>
                <p className="font-medium text-foreground/90">{formatLinkTitle(link.title)}</p>
                <p className="text-xs text-muted-foreground">Quick guide</p>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
