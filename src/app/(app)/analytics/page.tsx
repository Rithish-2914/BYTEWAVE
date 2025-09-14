"use client";

import { CategoryChart } from "@/components/dashboard/category-chart";
import { StatusChart } from "@/components/dashboard/status-chart";
import { useLanguage } from "@/components/providers/language-provider";
import { useDocuments } from "@/hooks/use-documents";

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const { documents, isLoaded } = useDocuments();

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
        <StatusChart documents={documents} isLoaded={isLoaded} />
        <CategoryChart documents={documents} isLoaded={isLoaded} />
      </div>

      {/* Add more detailed analytics components here */}
    </div>
  );
}
