"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import type { Task } from "@workspace/types";

interface DashboardTasksPreviewProps {
  readonly tasks: Task[];
}

const getStatusIcon = (status: Task["status"]) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "in-progress":
      return <Clock className="h-5 w-5 text-blue-500" />;
    case "todo":
      return <Circle className="h-5 w-5 text-muted-foreground" />;
    case "cancelled":
      return <Circle className="h-5 w-5 text-red-500" />;
  }
};

const getStatusText = (status: Task["status"]): string => {
  switch (status) {
    case "completed":
      return "Completed";
    case "in-progress":
      return "In Progress";
    case "todo":
      return "To Do";
    case "cancelled":
      return "Cancelled";
  }
};

export function DashboardTasksPreview({ tasks }: DashboardTasksPreviewProps) {
  const recentTasks = tasks
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  if (tasks.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">No tasks yet</CardTitle>
          <CardDescription>
            You haven&apos;t created any tasks yet. Get started by creating your
            first task.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Recent Tasks</CardTitle>
        <CardDescription>Your 5 most recent tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="mt-0.5">{getStatusIcon(task.status)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{task.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {getStatusText(task.status)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
