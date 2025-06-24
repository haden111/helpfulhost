
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { WelcomeMessage } from '@/components/custom/WelcomeMessage';
import { WelcomeInstructionLinks } from '@/components/custom/WelcomeInstructionLinks';

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-8">
      <Card className="w-full max-w-lg shadow-2xl bg-card rounded-xl overflow-hidden">
        <CardHeader className="text-center bg-primary/20 p-8">
          <div className="mx-auto mb-6 flex justify-center">
            <Image
              src="/haden.png"
              alt="Haden's Airbnb Logo"
              width={434}
              height={327}
              className="h-24 w-auto rounded-md"
              priority
            />
          </div>
          {/* Translatable content will be rendered by WelcomeMessage */}
          <WelcomeMessage />
        </CardHeader>
        <CardContent className="p-8 pt-0">
          
          {/* "Quick Access Instructions" header is now part of WelcomeMessage */}
          {/* The buttons are now randomly selected from available instructions */}
          <WelcomeInstructionLinks />
        </CardContent>
      </Card>
    </div>
  );
}
