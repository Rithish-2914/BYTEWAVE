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
import { mockDocuments } from "@/lib/data";
import { DOCUMENT_CATEGORIES } from "@/lib/constants";

const chartData = DOCUMENT_CATEGORIES.map((category) => ({
  name: category,
  value: mockDocuments.filter((doc) => doc.category === category).length,
}));

const chartConfig = chartData.reduce((acc, { name }) => {
  acc[name] = { label: name };
  return acc;
}, {} as any);

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

export function CategoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents by Category</CardTitle>
        <CardDescription>
          Distribution of all documents across different categories.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
