import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Settings } from "lucide-react";
import { currentUser } from "@workspace/auth/server";

export default async function SettingsPage() {
  const user = await currentUser();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-primary p-3">
          <Settings className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="text-sm font-medium">Name</div>
              <div className="text-sm text-muted-foreground">
                {user?.firstName} {user?.lastName}
              </div>
            </div>
            <div className="grid gap-2">
              <div className="text-sm font-medium">Email</div>
              <div className="text-sm text-muted-foreground">
                {user?.emailAddresses[0]?.emailAddress}
              </div>
            </div>
            <div className="grid gap-2">
              <div className="text-sm font-medium">User ID</div>
              <div className="text-sm font-mono text-muted-foreground">
                {user?.id}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="text-sm font-medium">Theme</div>
              <div className="text-sm text-muted-foreground">
                Use the theme toggle in the header to switch between light and
                dark mode
              </div>
            </div>
            <div className="grid gap-2">
              <div className="text-sm font-medium">Language</div>
              <div className="text-sm text-muted-foreground">English</div>
            </div>
            <div className="grid gap-2">
              <div className="text-sm font-medium">Timezone</div>
              <div className="text-sm text-muted-foreground">
                {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Manage how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Email Notifications</div>
                <div className="text-sm text-muted-foreground">
                  Receive updates via email
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Enabled</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Push Notifications</div>
                <div className="text-sm text-muted-foreground">
                  Get notified in your browser
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Disabled</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="text-sm font-medium">
                Two-Factor Authentication
              </div>
              <div className="text-sm text-muted-foreground">
                Managed by Clerk - Configure in your account settings
              </div>
            </div>
            <div className="grid gap-2">
              <div className="text-sm font-medium">Sessions</div>
              <div className="text-sm text-muted-foreground">
                1 active session
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
