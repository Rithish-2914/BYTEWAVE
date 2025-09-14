"use client";

import { useLanguage } from "@/components/providers/language-provider";

export default function NotificationsPage() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          {t("Notifications")}
        </h1>
        <p className="text-muted-foreground">
          {t("notificationsPage.description")}
        </p>
      </div>
       {/* Placeholder content for notifications */}
      <div className="text-center py-20 text-muted-foreground">
        {t("notificationsPage.placeholder")}
      </div>
    </div>
  );
}
