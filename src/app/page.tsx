import { LanguageSelector } from '@/components/custom/LanguageSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Lightbulb, Coffee, Tv } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-8">
      <Card className="w-full max-w-lg shadow-2xl bg-card rounded-xl overflow-hidden">
        <CardHeader className="text-center bg-primary/20 p-8">
          <div className="mx-auto mb-4 h-16 w-16 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-3.5-4_S10 6 8 7.5_7 9.5 7 11.5A7 7 0 0 0 12 22Z"/>
            <path d="M10.5 12c-.7.7-1.5 1.5-1.5 2.5"/>
            <path d="M13.5 12c.7.7 1.5 1.5 1.5 2.5"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Welcome to Haden's Helpful Host!</CardTitle>
          <CardDescription className="text-foreground/80 mt-2 text-base">
            Your friendly guide to a comfortable and enjoyable stay.
            Please select your preferred language below to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="flex justify-center">
            <LanguageSelector />
          </div>
          
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
