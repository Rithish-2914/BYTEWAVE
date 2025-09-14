
"use client";

import { CategoryChart } from "@/components/dashboard/category-chart";
import { StatusChart } from "@/components/dashboard/status-chart";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { useLanguage } from "@/components/providers/language-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { useDocuments } from "@/hooks/use-documents";

export default function DashboardPage() {
  const { t } = useLanguage();
  const { documents, isLoaded } = useDocuments();
  const { currentUser } = useAuth();
  
  const userDocuments = documents.filter(doc => 
    currentUser?.role === 'Admin' || doc.department === currentUser?.department
  );


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          {t("Dashboard")}
        </h1>
        <p className="text-muted-foreground">
          {t("dashboardPage.description")}
        </p>
      </div>

      <StatsCards documents={userDocuments} isLoaded={isLoaded} />

      <div className="grid gap-4 md:grid-cols-2">
        <StatusChart documents={userDocuments} isLoaded={isLoaded} />
        <CategoryChart documents={userDocuments} isLoaded={isLoaded} />
      </div>
    </div>
  );
}
