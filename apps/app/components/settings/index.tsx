"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Settings } from "lucide-react";
import { useKindeAuth } from "@workspace/auth/client";
import { usePreferences, useUpdatePreferences } from "@/hooks/use-settings";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { SettingsProfile } from "./settings-profile";
import { SettingsTaskPreferences } from "./settings-task-preferences";
import { SettingsNotifications } from "./settings-notifications";
import type { UpdatePreferencesInput } from "@workspace/types";

export function SettingsContent() {
  const { user } = useKindeAuth();

  const { data: preferences, isLoading } = usePreferences();
  const updatePreferences = useUpdatePreferences();

  const form = useForm<UpdatePreferencesInput>({
    defaultValues: {
      defaultTaskStatus: "todo",
      emailNotifications: "enabled",
      taskReminders: "enabled",
      weeklyDigest: "disabled",
    },
  });

  useEffect(() => {
    if (preferences?.data) {
      form.reset({
        defaultTaskStatus: preferences.data.defaultTaskStatus || "todo",
        emailNotifications: preferences.data.emailNotifications || "enabled",
        taskReminders: preferences.data.taskReminders || "enabled",
        weeklyDigest: preferences.data.weeklyDigest || "disabled",
        theme: preferences.data.theme || "system",
        language: preferences.data.language || "en",
        timezone: preferences.data.timezone || undefined,
        pushNotifications: preferences.data.pushNotifications || "disabled",
      });
    }
  }, [preferences, form]);

  const handleDefaultStatusChange = (status: "todo" | "in-progress") => {
    form.setValue("defaultTaskStatus", status);
    form.handleSubmit(onSubmit)();
  };

  const handleEmailNotificationsChange = (enabled: boolean) => {
    form.setValue("emailNotifications", enabled ? "enabled" : "disabled");
    form.handleSubmit(onSubmit)();
  };

  const handleTaskRemindersChange = (enabled: boolean) => {
    form.setValue("taskReminders", enabled ? "enabled" : "disabled");
    form.handleSubmit(onSubmit)();
  };

  const handleWeeklyDigestChange = (enabled: boolean) => {
    form.setValue("weeklyDigest", enabled ? "enabled" : "disabled");
    form.handleSubmit(onSubmit)();
  };

  const onSubmit = async (data: UpdatePreferencesInput) => {
    await updatePreferences.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  const currentDefaultStatus = form.watch("defaultTaskStatus");
  const currentEmailNotifications = form.watch("emailNotifications");
  const currentTaskReminders = form.watch("taskReminders");
  const currentWeeklyDigest = form.watch("weeklyDigest");

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-primary p-3">
          <Settings className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and task preferences
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsProfile user={user} onEditProfile={() => {}} />

        <SettingsTaskPreferences
          defaultStatus={currentDefaultStatus}
          onDefaultStatusChange={handleDefaultStatusChange}
        />

        <SettingsNotifications
          emailNotifications={currentEmailNotifications}
          taskReminders={currentTaskReminders}
          weeklyDigest={currentWeeklyDigest}
          onEmailNotificationsChange={handleEmailNotificationsChange}
          onTaskRemindersChange={handleTaskRemindersChange}
          onWeeklyDigestChange={handleWeeklyDigestChange}
        />
      </div>
    </div>
  );
}
