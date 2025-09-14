"use client";

import { useLanguage } from "@/components/providers/language-provider";

export default function SettingsPage() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          {t("Settings")}
        </h1>
        <p className="text-muted-foreground">
          {t("settingsPage.description")}
        </p>
      </div>
       {/* Placeholder content for settings */}
      <div className="text-center py-20 text-muted-foreground">
        {t("settingsPage.placeholder")}
      </div>
    </div>
  );
}
