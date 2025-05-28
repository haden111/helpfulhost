
'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    {/* Simplified path for brevity, original paths were complex for a simple globe */}
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2-15.86c3.95.49 7 3.85 7 7.93s-3.05 7.44-7 7.93V4.07z" />
  </svg>
);


export function LanguageSelector() {
  const { language, setLanguage, availableLanguages } = useLanguage();

  const handleLanguageChange = (newLangCode: string) => {
    setLanguage(newLangCode);
  };

  return (
    <div className="relative">
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger 
          id="language-select" 
          className="min-w-[140px] sm:min-w-[170px] md:min-w-[180px] bg-background border-input hover:border-primary/50 focus:ring-primary h-9 text-sm"
          aria-label="Select Language"
        >
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
