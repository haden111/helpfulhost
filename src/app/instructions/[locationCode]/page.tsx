
import { InstructionContent } from '@/components/custom/InstructionContent';
import { instructionsData, type InstructionLocation } from '@/lib/instructions-data';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RandomPOILinks } from '@/components/custom/RandomPOILinks'; // Import the new component

interface InstructionPageProps {
  params: Promise<{
    locationCode: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(instructionsData).map((code) => ({
    locationCode: code,
  }));
}

export default async function InstructionPage({ params }: InstructionPageProps) {
  const { locationCode } = await params;
  const locationData: InstructionLocation | undefined = instructionsData[locationCode];

  if (!locationData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
        <Card className="w-full max-w-md p-8 shadow-lg">
          <CardHeader>
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <CardTitle className="text-2xl font-semibold text-destructive">Instructions Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Sorry, we couldn't find instructions for the location code: <code className="bg-muted px-1 py-0.5 rounded">{locationCode}</code>.
            </p>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8">
      <InstructionContent locationData={locationData} />
      
      <RandomPOILinks currentLocationCode={locationCode} /> {/* Add the new component here */}

      <div className="mt-10 text-center"> {/* Increased mt from 8 to 10 for more space */}
        <Button variant="outline" asChild>
          <Link href="/">Back to Welcome Page</Link>
        </Button>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: InstructionPageProps) {
  const { locationCode } = await params;
  const locationData = instructionsData[locationCode];
  const title = locationData ? `${locationData.defaultTexts.title.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1FFFF}]/gu, '').trim()} - Haden's Airbnb` : "Instructions - Haden's Airbnb";
  return {
    title,
  };
}
