"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Bell } from "lucide-react";

interface SettingsNotificationsProps {
  readonly emailNotifications: string | null | undefined;
  readonly taskReminders: string | null | undefined;
  readonly weeklyDigest: string | null | undefined;
  readonly onEmailNotificationsChange: (enabled: boolean) => void;
  readonly onTaskRemindersChange: (enabled: boolean) => void;
  readonly onWeeklyDigestChange: (enabled: boolean) => void;
}

export function SettingsNotifications({
  emailNotifications,
  taskReminders,
  weeklyDigest,
  onEmailNotificationsChange,
  onTaskRemindersChange,
  onWeeklyDigestChange,
}: SettingsNotificationsProps) {
  const isEmailEnabled = emailNotifications === "enabled";
  const isRemindersEnabled = taskReminders === "enabled";
  const isDigestEnabled = weeklyDigest === "enabled";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        <CardDescription>
          Choose what notifications you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">Email Notifications</div>
            <div className="text-sm text-muted-foreground">
              Get notified about important updates
            </div>
          </div>
          <Button
            variant={isEmailEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => onEmailNotificationsChange(!isEmailEnabled)}
          >
            {isEmailEnabled ? "Enabled" : "Disabled"}
          </Button>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">Task Reminders</div>
            <div className="text-sm text-muted-foreground">
              Reminders for tasks with due dates
            </div>
          </div>
          <Button
            variant={isRemindersEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => onTaskRemindersChange(!isRemindersEnabled)}
          >
            {isRemindersEnabled ? "Enabled" : "Disabled"}
          </Button>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">Weekly Digest</div>
            <div className="text-sm text-muted-foreground">
              Summary of your tasks every Monday
            </div>
          </div>
          <Button
            variant={isDigestEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => onWeeklyDigestChange(!isDigestEnabled)}
          >
            {isDigestEnabled ? "Enabled" : "Disabled"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
