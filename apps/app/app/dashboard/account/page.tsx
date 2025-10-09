import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { UserButton } from "@workspace/auth/client";
import { currentUser } from "@workspace/auth/server";
import { BadgeCheck } from "lucide-react";

export default async function AccountPage() {
  const user = await currentUser();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-primary p-3">
          <BadgeCheck className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Account</h1>
          <p className="text-muted-foreground">
            Manage your account information and authentication
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your personal details from Clerk</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-16 w-16",
                  },
                }}
              />
              <div>
                <div className="font-medium">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-sm text-muted-foreground">
                  {user?.emailAddresses[0]?.emailAddress}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <div className="grid gap-1">
                <div className="text-sm font-medium">User ID</div>
                <div className="text-sm font-mono text-muted-foreground">
                  {user?.id}
                </div>
              </div>

              <div className="grid gap-1">
                <div className="text-sm font-medium">Created At</div>
                <div className="text-sm text-muted-foreground">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </div>
              </div>

              <div className="grid gap-1">
                <div className="text-sm font-medium">Last Sign In</div>
                <div className="text-sm text-muted-foreground">
                  {user?.lastSignInAt
                    ? new Date(user.lastSignInAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authentication */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>
              Manage your authentication methods
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="text-sm font-medium">Email Addresses</div>
              <div className="space-y-1">
                {user?.emailAddresses.map((email) => (
                  <div
                    key={email.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div className="text-muted-foreground">
                      {email.emailAddress}
                    </div>
                    {email.id === user.primaryEmailAddressId && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <div className="text-sm font-medium">
                Two-Factor Authentication
              </div>
              <div className="text-sm text-muted-foreground">
                {user?.twoFactorEnabled ? (
                  <span className="text-green-600">Enabled ✓</span>
                ) : (
                  <span>Not enabled</span>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <div className="text-sm font-medium">Password</div>
              <div className="text-sm text-muted-foreground">
                {user?.passwordEnabled ? "Enabled" : "Not set"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Manage Account</CardTitle>
            <CardDescription>
              Click the profile button above to access Clerk&apos;s full account
              management interface where you can update your profile, change
              your password, enable 2FA, and more.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                Orion Kit uses Clerk for authentication. All account management
                features are provided by Clerk&apos;s secure interface.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
