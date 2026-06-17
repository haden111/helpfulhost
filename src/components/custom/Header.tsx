'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/custom/LanguageSelector';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();
  const isScanPage = pathname === '/scan';

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-primary hover:text-primary/80 transition-colors">
          <Image
            src="/haden_min.png" 
            alt="Haden's Airbnb Logo"
            width={434} 
            height={327} 
            className="h-10 w-auto" 
            priority
          />
          <span className="hidden sm:inline-block whitespace-nowrap">Haden's Airbnb</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <LanguageSelector />
          <Button variant="ghost" size="icon" asChild>
            <Link href={isScanPage ? "/" : "/scan"} aria-label={isScanPage ? "Close Scanner" : "Scan QR Code"}>
              <QrCode className="h-5 w-5" />
            </Link>
          </Button>
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