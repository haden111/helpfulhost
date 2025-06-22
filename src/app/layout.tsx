
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { Header } from '@/components/custom/Header';
import { FooterContent } from '@/components/custom/FooterContent'; // Changed import
import { Toaster } from "@/components/ui/toaster";
// Removed imports for headers and auto-detect-language flow to improve stability

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Haden's Airbnb",
  description: 'Your friendly guide for a comfortable stay at Haden\'s Airbnb.',
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF', // Updated to white background
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Hardcoding language to 'en' to prevent server startup issues caused by dynamic header reads.
  // The manual language selector in the header will still function correctly.
  const initialLangForHtml = 'en';

  return (
    <html lang={initialLangForHtml} className="light" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-foreground bg-background`}>
        <LanguageProvider initialDetectedLanguage={initialLangForHtml}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8">
              {children}
            </main>
            <footer className="py-6 text-center text-sm text-muted-foreground border-t">
              <FooterContent /> {/* Use the new component here */}
            </footer>
          </div>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
