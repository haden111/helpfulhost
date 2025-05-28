import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/custom/LanguageSelector';

export function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary hover:text-primary/80 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary">
            <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-3.5-4_S10 6 8 7.5_7 9.5 7 11.5A7 7 0 0 0 12 22Z"/>
            <path d="M10.5 12c-.7.7-1.5 1.5-1.5 2.5"/>
            <path d="M13.5 12c.7.7 1.5 1.5 1.5 2.5"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Haden's Helpful Host
        </Link>
        <nav className="flex items-center gap-4">
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
