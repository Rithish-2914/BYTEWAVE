"use client";

import { useLanguage } from "@/components/providers/language-provider";

export default function SearchPage() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          {t("Search")}
        </h1>
        <p className="text-muted-foreground">
          {t("searchPage.description")}
        </p>
      </div>
       {/* Placeholder content for search */}
      <div className="text-center py-20 text-muted-foreground">
        {t("searchPage.placeholder")}
      </div>
    </div>
  );
}
