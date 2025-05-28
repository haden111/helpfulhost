
import { InstructionContent } from '@/components/custom/InstructionContent';
import { instructionsData, type InstructionLocation } from '@/lib/instructions-data';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface InstructionPageProps {
  params: {
    locationCode: string;
  };
}

export async function generateStaticParams() {
  return Object.keys(instructionsData).map((code) => ({
    locationCode: code,
  }));
}

export default function InstructionPage({ params }: InstructionPageProps) {
  const { locationCode } = params;
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
       <div className="mt-8 text-center">
        <Button variant="outline" asChild>
          <Link href="/">Back to Welcome Page</Link>
        </Button>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: InstructionPageProps) {
  const locationData = instructionsData[params.locationCode];
  const title = locationData ? `${locationData.defaultTexts.title} - Haden's Airbnb` : "Instructions - Haden's Airbnb";
  return {
    title,
  };
}
