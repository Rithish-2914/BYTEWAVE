"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { useLanguage } from "../providers/language-provider";
import {useEffect, useState} from 'react';
import type { Document } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";

type StatCardProps = {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
  isLoading?: boolean;
};

function StatCard({ title, value, icon: Icon, description, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <Skeleton className="h-8 w-1/4" />
        ) : (
            <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function StatsCards({ documents, isLoaded }: { documents: Document[], isLoaded: boolean }) {
  const { t } = useLanguage();
  const [overdue, setOverdue] = useState(0);

  useEffect(() => {
    if (isLoaded) {
        const now = new Date();
        const overdueCount = documents.filter(
          (doc) => doc.deadline && new Date(doc.deadline) < now && doc.status !== 'Approved'
        ).length;
        setOverdue(overdueCount);
    }
  }, [documents, isLoaded]);

  const totalDocuments = documents.length;
  const pendingReview = documents.filter(
    (doc) => doc.status === "Pending" || doc.status === "In Review"
  ).length;
  const resolved = documents.filter(
    (doc) => doc.status === "Approved"
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t("statsCards.totalDocuments")}
        value={totalDocuments.toString()}
        icon={FileText}
        description={t("statsCards.totalDocumentsDescription")}
        isLoading={!isLoaded}
      />
      <StatCard
        title={t("statsCards.pendingReview")}
        value={pendingReview.toString()}
        icon={Clock}
        description={t("statsCards.pendingReviewDescription")}
        isLoading={!isLoaded}
      />
      <StatCard
        title={t("statsCards.resolved")}
        value={resolved.toString()}
        icon={CheckCircle}
        description={t("statsCards.resolvedDescription")}
        isLoading={!isLoaded}
      />
      <StatCard
        title={t("statsCards.overdue")}
        value={overdue.toString()}
        icon={AlertTriangle}
        description={t("statsCards.overdueDescription")}
        isLoading={!isLoaded}
      />
    </div>
  );
}
