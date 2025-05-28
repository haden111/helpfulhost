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
    <div className="flex flex-col space-y-2 w-full max-w-xs">
      <Label htmlFor="language-select" className="text-sm font-medium text-foreground/80">Select Language</Label>
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger id="language-select" className="w-full bg-background border-input hover:border-primary/50 focus:ring-primary">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
