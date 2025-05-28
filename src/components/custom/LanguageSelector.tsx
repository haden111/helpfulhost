
'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

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
              <span role="img" aria-label={lang.name} className="mr-2">{lang.emoji}</span>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
