"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockDocuments } from "@/lib/data";
import { FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { useLanguage } from "../providers/language-provider";

type StatCardProps = {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
};

function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const { t } = useLanguage();
  const totalDocuments = mockDocuments.length;
  const pendingReview = mockDocuments.filter(
    (doc) => doc.status === "Pending" || doc.status === "In Review"
  ).length;
  const resolved = mockDocuments.filter(
    (doc) => doc.status === "Approved"
  ).length;
  const overdue = mockDocuments.filter(
    (doc) => doc.deadline && new Date(doc.deadline) < new Date() && doc.status !== 'Approved'
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t("statsCards.totalDocuments")}
        value={totalDocuments.toString()}
        icon={FileText}
        description={t("statsCards.totalDocumentsDescription")}
      />
      <StatCard
        title={t("statsCards.pendingReview")}
        value={pendingReview.toString()}
        icon={Clock}
        description={t("statsCards.pendingReviewDescription")}
      />
      <StatCard
        title={t("statsCards.resolved")}
        value={resolved.toString()}
        icon={CheckCircle}
        description={t("statsCards.resolvedDescription")}
      />
      <StatCard
        title={t("statsCards.overdue")}
        value={overdue.toString()}
        icon={AlertTriangle}
        description={t("statsCards.overdueDescription")}
      />
    </div>
  );
}
