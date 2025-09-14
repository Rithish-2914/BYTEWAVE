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
import { DOCUMENT_CATEGORIES } from "@/lib/constants";
import { useLanguage } from "../providers/language-provider";
import type { Document } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(210, 40%, 50%)",
  "hsl(140, 40%, 50%)",
  "hsl(300, 40%, 50%)",
];

export function CategoryChart({ documents, isLoaded }: { documents: Document[], isLoaded: boolean }) {
  const { t } = useLanguage();

  const chartData = DOCUMENT_CATEGORIES.map((category) => ({
    name: category,
    value: documents.filter((doc) => doc.category === category).length,
  }));

  const chartConfig = chartData.reduce((acc, { name }) => {
    acc[name] = { label: name };
    return acc;
  }, {} as any);

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
        ) : (
            <div className="flex items-center justify-center mx-auto aspect-square max-h-[300px]">
                 <Skeleton className="h-[300px] w-[300px] rounded-full" />
            </div>
        )}
      </CardContent>
    </Card>
  );
}
