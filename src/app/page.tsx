
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Lightbulb, Coffee, Tv } from 'lucide-react';
import { WelcomeMessage } from '@/components/custom/WelcomeMessage'; // Import the new component

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
        <CardContent className="p-8 pt-0 space-y-8"> {/* Adjusted pt-0 as WelcomeMessage now handles its own title margin */}
          
          {/* "Quick Access Instructions" header is now part of WelcomeMessage */}
          {/* The buttons remain static here for navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2"> {/* Added pt-2 for spacing after translated header */}
            <Button variant="outline" className="w-full justify-start text-left h-auto py-3" asChild>
              <Link href="/instructions/front-door" className="flex items-center gap-3">
                <Lightbulb className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Front Door</p>
                  <p className="text-xs text-muted-foreground">Entry and Lock</p>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start text-left h-auto py-3" asChild>
              <Link href="/instructions/living-room-tv" className="flex items-center gap-3">
                <Tv className="h-5 w-5 text-primary" />
                 <div>
                  <p className="font-medium">TV Guide</p>
                  <p className="text-xs text-muted-foreground">Living Room Entertainment</p>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start text-left h-auto py-3" asChild>
              <Link href="/instructions/kitchen-coffee-machine" className="flex items-center gap-3">
                <Coffee className="h-5 w-5 text-primary" />
                 <div>
                  <p className="font-medium">Coffee Machine</p>
                  <p className="text-xs text-muted-foreground">Kitchen Amenities</p>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
