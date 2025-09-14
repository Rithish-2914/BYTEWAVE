"use client";

import { CategoryChart } from "@/components/dashboard/category-chart";
import { StatusChart } from "@/components/dashboard/status-chart";
import { useLanguage } from "@/components/providers/language-provider";

export default function AnalyticsPage() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          {t("Analytics")}
        </h1>
        <p className="text-muted-foreground">
          {t("analyticsPage.description")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatusChart />
        <CategoryChart />
      </div>

      {/* Add more detailed analytics components here */}
    </div>
  );
}
