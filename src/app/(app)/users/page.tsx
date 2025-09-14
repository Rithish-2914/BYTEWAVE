"use client";

import { useLanguage } from "@/components/providers/language-provider";

export default function UsersPage() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          {t("usersPage.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("usersPage.description")}
        </p>
      </div>
       {/* Placeholder content for users */}
      <div className="text-center py-20 text-muted-foreground">
        {t("usersPage.placeholder")}
      </div>
    </div>
  );
}
