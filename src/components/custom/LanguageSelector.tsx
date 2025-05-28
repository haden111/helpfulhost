
'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import Image from 'next/image';

// Simple Globe SVG as a component
const GlobeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className || "w-5 h-5"}
    aria-hidden="true"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.41 3.59-8 8-8V4c-3.95-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86c-3.95-.49-7-3.85-7-7.93zm8 8c4.41 0 8-3.59 8-8h.07c.49 3.95 3.85 7 7.93 7s7.44-3.05 7.93-7H20c0 4.41-3.59 8-8 8zm1-14h1.87l-1.4 1.4c-.29.29-.56.6-.8.93H13V6zm0 3h1.75l-1.75 1.75V9zm0 3h1.75l-1.75 1.75V12zm0 3h1.87l-.94.94c-.29.29-.6.56-.93.8V15zm2.87 2.07c.87-.48 1.64-1.15 2.22-1.94H15v.07c0 .34.03.67.08.99h.79zm2.13-3.07H15v2h2.08c.05-.32.08-.66.08-1s-.03-.68-.08-1zm0-4H15v2h2.08c.05-.32.08-.66.08-1s-.03-.68-.08-1z"/>
  </svg>
);


export function LanguageSelector() {
  const { language, setLanguage, availableLanguages } = useLanguage();

  const handleLanguageChange = (newLangCode: string) => {
    setLanguage(newLangCode);
  };

  return (
    <div className="flex flex-col space-y-1 w-full max-w-xs">
      <Label htmlFor="language-select" className="text-xs font-medium text-foreground/70 sr-only">Select Language</Label>
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger id="language-select" className="w-full min-w-[180px] bg-background border-input hover:border-primary/50 focus:ring-primary h-9 text-sm">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center gap-2">
                {lang.flagCode === 'globe' ? (
                  <GlobeIcon className="w-5 h-5 rounded-sm border border-black" />
                ) : (
                  <Image
                    src={`https://flagcdn.com/w20/${lang.flagCode.toLowerCase()}.png`}
                    alt={`${lang.name} flag`}
                    width={20}
                    height={15}
                    className="rounded-sm object-cover border border-black"
                  />
                )}
                <span>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
