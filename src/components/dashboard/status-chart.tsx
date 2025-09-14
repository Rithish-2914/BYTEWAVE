"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { mockDocuments } from "@/lib/data";
import { DOCUMENT_STATUSES } from "@/lib/constants";
import { useLanguage } from "../providers/language-provider";

export function StatusChart() {
  const { t } = useLanguage();

  const chartData = DOCUMENT_STATUSES.map((status) => ({
    name: t(status),
    total: mockDocuments.filter((doc) => doc.status === status).length,
  }));

  const chartConfig = {
    total: {
      label: t("Total"),
      color: "hsl(var(--primary))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("statusChart.title")}</CardTitle>
        <CardDescription>
          {t("statusChart.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="total" fill="var(--color-total)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
