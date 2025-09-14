"use client";

import { useLanguage } from "@/components/providers/language-provider";

export default function ArchivePage() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          {t("Archive")}
        </h1>
        <p className="text-muted-foreground">
          {t("archivePage.description")}
        </p>
      </div>
      {/* Placeholder content for archive */}
      <div className="text-center py-20 text-muted-foreground">
        {t("archivePage.placeholder")}
      </div>
    </div>
  );
}
