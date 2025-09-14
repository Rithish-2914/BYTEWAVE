
"use client";

import { Pie, PieChart, Cell } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { useLanguage } from "../providers/language-provider";
import type { Document } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { useMemo } from "react";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(210, 40%, 50%)",
  "hsl(140, 40%, 50%)",
  "hsl(300, 40%, 50%)",
  "hsl(250, 50%, 60%)",
];

export function CategoryChart({ documents, isLoaded }: { documents: Document[], isLoaded: boolean }) {
  const { t } = useLanguage();

  const chartData = useMemo(() => {
    const categoryCounts = documents.reduce((acc, doc) => {
        acc[doc.category] = (acc[doc.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));

  }, [documents]);


  const chartConfig = useMemo(() => chartData.reduce((acc, { name }) => {
    acc[name] = { label: name };
    return acc;
  }, {} as any), [chartData]);

  const noData = chartData.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("categoryChart.title")}</CardTitle>
        <CardDescription>
          {t("categoryChart.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoaded ? (
          noData ? (
             <div className="flex items-center justify-center mx-auto aspect-square max-h-[300px]">
                <p className="text-muted-foreground">{t("categoryChart.noData")}</p>
             </div>
          ) : (
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
            <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60}>
                {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
            </PieChart>
            </ChartContainer>
          )
        ) : (
            <div className="flex items-center justify-center mx-auto aspect-square max-h-[300px]">
                 <Skeleton className="h-[300px] w-[300px] rounded-full" />
            </div>
        )}
      </CardContent>
    </Card>
  );
}

