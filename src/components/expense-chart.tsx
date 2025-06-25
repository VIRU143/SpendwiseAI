"use client";

import * as React from "react";
import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CATEGORIES } from "@/lib/constants";
import type { Expense } from "@/lib/types";

interface ExpenseChartProps {
  expenses: Expense[];
}

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(207, 82%, 67%)",
  "hsl(54, 100%, 61%)",
];

export default function ExpenseChart({ expenses }: ExpenseChartProps) {
  const { chartData, chartConfig } = React.useMemo(() => {
    const aggregatedData: { [key: string]: number } = {};

    for (const expense of expenses) {
      if (aggregatedData[expense.category]) {
        aggregatedData[expense.category] += expense.amount;
      } else {
        aggregatedData[expense.category] = expense.amount;
      }
    }

    const chartData = Object.entries(aggregatedData).map(([category, total]) => ({
      category,
      total,
      fill: "var(--color-)" + category,
    }));
    
    const chartConfig: ChartConfig = {};
    CATEGORIES.forEach((cat, index) => {
        chartConfig[cat.value] = {
            label: cat.label,
            color: chartColors[index % chartColors.length],
            icon: cat.icon
        }
    });

    return { chartData, chartConfig };
  }, [expenses]);
  
  if (!expenses || expenses.length === 0) {
    return null;
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="total"
          nameKey="category"
          innerRadius={60}
          strokeWidth={5}
        >
           {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
          ))}
        </Pie>
        <ChartLegend
            content={<ChartLegendContent nameKey="category" />}
            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}
