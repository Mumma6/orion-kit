"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { TrendingUp, Clock, Target } from "lucide-react";

interface AnalyticsInsightsProps {
  readonly completedThisWeek: number;
  readonly inProgress: number;
  readonly completionRate: number;
}

export function AnalyticsInsights({
  completedThisWeek,
  inProgress,
  completionRate,
}: AnalyticsInsightsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Productivity Insights</CardTitle>
        <CardDescription>
          Tips and trends based on your task management
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2 rounded-lg border p-4">
            <div className="flex items-center gap-2 text-green-500">
              <TrendingUp className="h-5 w-5" />
              <span className="font-semibold">Great Progress!</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You've completed {completedThisWeek} tasks this week.
              {completedThisWeek > 5
                ? " Keep up the momentum!"
                : " You're doing well!"}
            </p>
          </div>

          <div className="space-y-2 rounded-lg border p-4">
            <div className="flex items-center gap-2 text-blue-500">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">In Progress</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You have {inProgress} tasks in progress.
              {inProgress > 3
                ? " Consider completing some before starting new ones."
                : " Good balance!"}
            </p>
          </div>

          <div className="space-y-2 rounded-lg border p-4">
            <div className="flex items-center gap-2 text-purple-500">
              <Target className="h-5 w-5" />
              <span className="font-semibold">Focus Area</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {completionRate >= 70
                ? "You're highly productive! Keep it up."
                : completionRate >= 40
                  ? "Good progress. Try completing more tasks to boost your rate."
                  : "Consider breaking down tasks into smaller, manageable pieces."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
