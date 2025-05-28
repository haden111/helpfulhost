
import Link from 'next/link';
import Image from 'next/image';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/custom/LanguageSelector';

export function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-primary hover:text-primary/80 transition-colors">
          <Image
            src="/haden-logo.png" // Assuming the logo is saved as public/haden-logo.png
            alt="Haden's Airbnb Logo"
            width={40} // Adjust width as needed
            height={40} // Adjust height as needed
            className="h-10 w-auto" // Maintain aspect ratio, adjust height
            priority
          />
          <span className="hidden sm:inline-block whitespace-nowrap">Haden's Airbnb</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <LanguageSelector />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/" aria-label="Home">
              <Home className="h-5 w-5" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
