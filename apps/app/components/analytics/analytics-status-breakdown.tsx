"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import type { LucideIcon } from "lucide-react";

interface StatusBreakdownItem {
  readonly status: string;
  readonly count: number;
  readonly percentage: number;
  readonly color: string;
  readonly icon: LucideIcon;
}

interface AnalyticsStatusBreakdownProps {
  readonly statusBreakdown: readonly StatusBreakdownItem[];
}

export function AnalyticsStatusBreakdown({
  statusBreakdown,
}: AnalyticsStatusBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Breakdown</CardTitle>
        <CardDescription>
          Distribution of tasks by current status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusBreakdown.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.status}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${item.color}`} />
                    <span className="text-sm font-medium">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{item.count}</span>
                    <span className="text-xs text-muted-foreground">
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
