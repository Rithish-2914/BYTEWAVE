import { CategoryChart } from "@/components/dashboard/category-chart";
import { StatusChart } from "@/components/dashboard/status-chart";
import { StatsCards } from "@/components/dashboard/stats-cards";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your documents.
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-4 md:grid-cols-2">
        <StatusChart />
        <CategoryChart />
      </div>
    </div>
  );
}
