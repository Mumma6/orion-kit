"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import type { Task } from "@workspace/database";

interface RecentActivityItem {
  readonly title: string;
  readonly status: Task["status"];
  readonly date: string;
}

interface AnalyticsRecentActivityProps {
  readonly recentActivity: readonly RecentActivityItem[];
}

const getStatusLabel = (status: Task["status"]): string => {
  switch (status) {
    case "todo":
      return "To Do";
    case "in-progress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
  }
};

const getStatusVariant = (
  status: Task["status"]
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "completed":
      return "default";
    case "in-progress":
      return "default";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
};

export function AnalyticsRecentActivity({
  recentActivity,
}: AnalyticsRecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest task updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between pb-4 border-b last:border-b-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.date}
                  </p>
                </div>
                <Badge variant={getStatusVariant(activity.status)}>
                  {getStatusLabel(activity.status)}
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No recent activity
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
