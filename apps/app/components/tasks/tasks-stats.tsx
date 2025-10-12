"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import type { TasksListResponse } from "@workspace/types";

interface TasksStatsProps {
  data: TasksListResponse;
}

export function TasksStats({ data }: TasksStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.total || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">To Do</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-muted-foreground">
            {data.todo || 0}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500">
            {data.inProgress || 0}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            {data.completed || 0}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
