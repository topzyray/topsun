"use client";

import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, LabelList } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type BarChartCardProps = {
  title: string;
  description?: string;
  data: any[];
  config: ChartConfig;
  xAxisKey: string;
  barKeys: string[];
  barRadius?: number;
  barColorMap?: Record<string, string>;
  statChangeText?: string;
  footerText?: string;
};

export function BarChartCard({
  title,
  description,
  data,
  config,
  xAxisKey,
  barKeys,
  barRadius = 0,
  barColorMap = {},
  statChangeText,
  footerText,
}: BarChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="max-h-[60vh] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={xAxisKey}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={
                  (value) => (typeof value === "string" ? value : value)
                  // typeof value === "string" ? value.slice(0, 3) : value
                }
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              {barKeys.map((key) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={barColorMap[key] || "var(--color-primary)"}
                  radius={barRadius}
                >
                  <LabelList position="top" offset={8} className="fill-foreground" fontSize={12} />
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {statChangeText}
          {/* <TrendingUp className="h-4 w-4" /> */}
        </div>
        <div className="text-muted-foreground leading-none">{footerText}</div>
      </CardFooter>
    </Card>
  );
}
