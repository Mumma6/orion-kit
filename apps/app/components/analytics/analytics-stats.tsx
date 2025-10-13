"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { BarChart3, TrendingUp, Target, Calendar } from "lucide-react";

interface AnalyticsStatsProps {
  readonly tasksThisWeek: number;
  readonly tasksThisMonth: number;
  readonly completedThisWeek: number;
  readonly completionRate: number;
  readonly total: number;
}

export function AnalyticsStats({
  tasksThisWeek,
  tasksThisMonth,
  completedThisWeek,
  completionRate,
  total,
}: AnalyticsStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tasksThisWeek}</div>
          <p className="text-xs text-muted-foreground">
            {completedThisWeek} completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tasksThisMonth}</div>
          <p className="text-xs text-muted-foreground">Tasks created</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Completion Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            {completionRate}%
          </div>
          <p className="text-xs text-muted-foreground">Overall progress</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Total Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>
    </div>
  );
}
