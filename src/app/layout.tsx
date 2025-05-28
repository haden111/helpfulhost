import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { Header } from '@/components/custom/Header';
import { Toaster } from "@/components/ui/toaster";
import { headers } from 'next/headers';
import { autoDetectLanguage, type AutoDetectLanguageInput } from '@/ai/flows/auto-detect-language';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Haden's Helpful Host",
  description: 'Your friendly guide for a comfortable stay.',
  icons: {
    icon: '/favicon.ico', // Assuming a favicon might be added later
  },
};

export const viewport: Viewport = {
  themeColor: '#D0BFFF', // Primary color
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = headers();
  const acceptLanguageHeader = requestHeaders.get('accept-language');
  // Note: IP address detection might be complex/unreliable in some hosting environments.
  // 'x-forwarded-for' is common but can be spoofed. Vercel provides 'x-vercel-ip-city', etc.
  // For simplicity, we mainly rely on accept-language header.
  const ipAddress = requestHeaders.get('x-forwarded-for')?.split(',')[0].trim() || 
                    requestHeaders.get('x-real-ip')?.split(',')[0].trim();

  let detectedLanguageCode: string | null = null;

  try {
    const autoDetectInput: AutoDetectLanguageInput = {};
    if (acceptLanguageHeader) {
      autoDetectInput.acceptLanguage = acceptLanguageHeader;
    }
    if (ipAddress) {
      autoDetectInput.ipAddress = ipAddress;
    }

    if (Object.keys(autoDetectInput).length > 0) { // Only call if we have some input
      const result = await autoDetectLanguage(autoDetectInput);
      if (result.languageCode) {
        detectedLanguageCode = result.languageCode.split('-')[0].toLowerCase();
      }
    }
  } catch (error) {
    console.error("Error auto-detecting language via AI, falling back:", error);
    // Fallback to browser's primary language or 'en' will be handled by LanguageProvider
    if (acceptLanguageHeader) {
        detectedLanguageCode = acceptLanguageHeader.split(',')[0].split('-')[0].toLowerCase();
    }
  }
  
  // The LanguageProvider will handle cookie override and validation against supported languages.
  const initialLangForHtml = detectedLanguageCode || 'en';

  return (
    <html lang={initialLangForHtml} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-foreground bg-background`}>
        <LanguageProvider initialDetectedLanguage={detectedLanguageCode}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8">
              {children}
            </main>
            <footer className="py-6 text-center text-sm text-muted-foreground border-t">
              © {new Date().getFullYear()} Haden's Helpful Host. All rights reserved.
            </footer>
          </div>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
