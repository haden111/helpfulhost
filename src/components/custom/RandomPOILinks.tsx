
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { instructionsData } from '@/lib/instructions-data'; // No need for type InstructionLocation here
import { Button } from '@/components/ui/button';
import { ArrowRightCircle, ListChecks } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RandomPOILinksProps {
  currentLocationCode: string;
}

interface POILink {
  code: string;
  title: string;
  emoji?: string; // For the custom emoji
}

export function RandomPOILinks({ currentLocationCode }: RandomPOILinksProps) {
  const [randomLinks, setRandomLinks] = useState<POILink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const allCodes = Object.keys(instructionsData);
    const availableCodes = allCodes.filter(code => code !== currentLocationCode);

    if (availableCodes.length === 0) {
      setRandomLinks([]);
      setIsLoading(false);
      return;
    }

    // Shuffle the available codes
    const shuffled = [...availableCodes].sort(() => 0.5 - Math.random());
    
    // Get up to 3 unique codes
    const selectedCodes = shuffled.slice(0, Math.min(3, availableCodes.length));

    const links = selectedCodes.map(code => ({
      code,
      title: instructionsData[code].defaultTexts.title,
      emoji: instructionsData[code].linkIconEmoji, // Get the emoji
    }));
    
    setRandomLinks(links);
    setIsLoading(false);
  }, [currentLocationCode]);

  if (isLoading) {
    return (
      <div className="mt-12 pt-8 border-t">
        <h3 className="text-xl font-semibold mb-6 text-center text-primary">
          <Skeleton className="h-7 w-1/2 mx-auto" />
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (randomLinks.length === 0) {
    return null; // Don't render anything if no other links are available
  }

  return (
    <div className="mt-12 pt-8 border-t">
      <h3 className="text-xl font-semibold mb-6 text-center text-primary flex items-center justify-center gap-2">
        <ListChecks className="h-6 w-6" />
        Explore Other Instructions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {randomLinks.map(link => (
          <Button variant="outline" className="w-full justify-start text-left h-auto py-3 shadow-sm hover:shadow-md transition-shadow" asChild key={link.code}>
            <Link href={`/instructions/${link.code}`} className="flex items-center gap-3">
              {link.emoji ? (
                <span className="text-2xl flex-shrink-0 w-6 text-center">{link.emoji}</span>
              ) : (
                <ArrowRightCircle className="h-5 w-5 text-accent flex-shrink-0" />
              )}
              <div>
                <p className="font-medium text-foreground/90">{link.title.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1FFFF}]/gu, '').trim()}</p>
                <p className="text-xs text-muted-foreground">Quick guide</p>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
