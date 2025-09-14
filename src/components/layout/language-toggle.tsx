"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="language-switch" className="text-sm font-medium text-muted-foreground">EN</Label>
      <Switch
        id="language-switch"
        checked={language === "ml"}
        onCheckedChange={toggleLanguage}
        aria-label="Toggle language"
      />
      <Label htmlFor="language-switch" className="text-sm font-medium text-muted-foreground">ML</Label>
    </div>
  );
}
