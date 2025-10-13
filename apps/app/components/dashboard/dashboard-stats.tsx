"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

interface DashboardStatsProps {
  readonly total: number;
  readonly completed: number;
  readonly inProgress: number;
  readonly todo: number;
}

export function DashboardStats({
  total,
  completed,
  inProgress,
  todo,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">{completed}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500">{inProgress}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">To Do</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-muted-foreground">{todo}</div>
        </CardContent>
      </Card>
    </div>
  );
}
