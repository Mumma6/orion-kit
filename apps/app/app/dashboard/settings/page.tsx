"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Bell,
  CheckCircle2,
  Clock,
  Settings,
  Shield,
  User,
  LogOut,
  Palette,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@workspace/auth";

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const router = useRouter();

  // Settings state
  const [defaultStatus, setDefaultStatus] = useState<"todo" | "in-progress">(
    "todo"
  );
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const handleSavePreferences = () => {
    // TODO: Save to backend
    console.log("Saving preferences:", {
      defaultStatus,
      emailNotifications,
      taskReminders,
      weeklyDigest,
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
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
        {/* Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile
                </CardTitle>
                <CardDescription>Your account information</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openUserProfile()}
              >
                Edit Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {user?.imageUrl && (
                <img
                  src={user.imageUrl}
                  alt={user.fullName || "User"}
                  className="h-16 w-16 rounded-full border-2 border-primary/20"
                />
              )}
              <div>
                <div className="font-semibold text-lg">
                  {user?.fullName || "User"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {user?.primaryEmailAddress?.emailAddress}
                </div>
              </div>
            </div>
            <Separator />
            <div className="grid gap-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">User ID</span>
                <span className="text-sm font-mono">
                  {user?.id.slice(0, 12)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Member since
                </span>
                <span className="text-sm">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="default" className="bg-green-500">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Task Preferences
            </CardTitle>
            <CardDescription>
              Customize how you create and manage tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <Label>Default Status for New Tasks</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    {defaultStatus === "todo" ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" />
                        To Do
                      </>
                    ) : (
                      <>
                        <Clock className="mr-2 h-4 w-4 text-blue-500" />
                        In Progress
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setDefaultStatus("todo")}>
                    <CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" />
                    To Do
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDefaultStatus("in-progress")}
                  >
                    <Clock className="mr-2 h-4 w-4 text-blue-500" />
                    In Progress
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="text-sm font-medium">Display Options</div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Show completed tasks by default</div>
                <div>• Sort tasks by creation date</div>
                <div>• Enable task descriptions</div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Palette className="mr-2 h-4 w-4" />
                Customize Display
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
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
                variant={emailNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => setEmailNotifications(!emailNotifications)}
              >
                {emailNotifications ? "Enabled" : "Disabled"}
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
                variant={taskReminders ? "default" : "outline"}
                size="sm"
                onClick={() => setTaskReminders(!taskReminders)}
              >
                {taskReminders ? "Enabled" : "Disabled"}
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
                variant={weeklyDigest ? "default" : "outline"}
                size="sm"
                onClick={() => setWeeklyDigest(!weeklyDigest)}
              >
                {weeklyDigest ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Privacy
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Password</div>
                  <div className="text-sm text-muted-foreground">
                    Last changed: Never
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openUserProfile()}
                >
                  Change
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">
                    Two-Factor Authentication
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Add an extra layer of security
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openUserProfile()}
                >
                  Configure
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Active Sessions</div>
                  <div className="text-sm text-muted-foreground">
                    Manage your login sessions
                  </div>
                </div>
                <Badge variant="secondary">1 active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button onClick={handleSavePreferences} className="gap-2">
          <Save className="h-4 w-4" />
          Save Preferences
        </Button>
        <Button
          variant="outline"
          onClick={() => signOut(() => router.push("/"))}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
