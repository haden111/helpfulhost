'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { instructionsData } from '@/lib/instructions-data';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, Coffee, Tv, ArrowRightCircle } from 'lucide-react';

interface InstructionLink {
  code: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

// Maps keywords in the instruction code to specific icons
const iconMap: { [key: string]: React.ElementType } = {
  'door': Lightbulb,
  'tv': Tv,
  'coffee': Coffee,
};

// Maps keywords to descriptions
const descriptionMap: { [key: string]: string } = {
    'door': 'Entry and Lock',
    'tv': 'Living Room Entertainment',
    'coffee': 'Kitchen Amenities'
}

/**
 * Finds the best matching value from a map based on keywords in a string.
 * @param code The string to search for keywords in (e.g., 'kitchen-coffee-machine').
 * @param map The map of keywords to values.
 * @param defaultValue The value to return if no keyword matches.
 * @returns The matched value or the default value.
 */
const getBestMatch = <T,>(code: string, map: Record<string, T>, defaultValue: T): T => {
    const key = Object.keys(map).find(key => code.toLowerCase().includes(key));
    return key ? map[key] : defaultValue;
}


export function WelcomeInstructionLinks() {
  const [randomLinks, setRandomLinks] = useState<InstructionLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This logic runs only on the client to prevent hydration mismatch and ensure randomness per visit
    const allCodes = Object.keys(instructionsData);

    const shuffled = [...allCodes].sort(() => 0.5 - Math.random());
    
    // Select up to 3 links, or fewer if not enough are available
    const selectedCodes = shuffled.slice(0, Math.min(3, shuffled.length));

    const links: InstructionLink[] = selectedCodes.map(code => ({
      code,
      title: instructionsData[code].defaultTexts.title.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1FFFF}]/gu, '').trim(),
      description: getBestMatch(code, descriptionMap, 'Quick guide'),
      icon: getBestMatch(code, iconMap, ArrowRightCircle),
    }));
    
    setRandomLinks(links);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (randomLinks.length === 0) {
    return (
        <div className="text-center text-muted-foreground pt-4">
            <p>No instructions available at the moment.</p>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
      {randomLinks.map(link => {
        const Icon = link.icon;
        return (
          <Button variant="outline" className="w-full justify-start text-left h-auto py-3" asChild key={link.code}>
            <Link href={`/instructions/${link.code}`} className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{link.title}</p>
                <p className="text-xs text-muted-foreground">{link.description}</p>
              </div>
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
