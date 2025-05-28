
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Lightbulb, Coffee, Tv } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-8">
      <Card className="w-full max-w-lg shadow-2xl bg-card rounded-xl overflow-hidden">
        <CardHeader className="text-center bg-primary/20 p-8">
          <div className="mx-auto mb-6 flex justify-center">
            <Image
              src="/haden-logo.png" // Assuming the logo is saved as public/haden-logo.png
              alt="Haden's Airbnb Logo"
              width={100} // Adjust width as needed
              height={100} // Adjust height as needed
              className="h-24 w-auto rounded-full" // Example styling
              priority
            />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Welcome to Haden's Airbnb!</CardTitle>
          <CardDescription className="text-foreground/80 mt-2 text-base">
            Your friendly guide to a comfortable and enjoyable stay.
            You can change your preferred language using the selector in the top right corner.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center text-foreground/90">Quick Access Instructions:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
