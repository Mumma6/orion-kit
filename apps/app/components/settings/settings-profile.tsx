"use client";

import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { User } from "lucide-react";
import type { UserResource } from "@workspace/auth/client";

interface SettingsProfileProps {
  readonly user: UserResource | null | undefined;
  readonly onEditProfile: () => void;
}

export function SettingsProfile({ user, onEditProfile }: SettingsProfileProps) {
  if (!user) {
    return null;
  }

  return (
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
          <Button variant="outline" size="sm" onClick={onEditProfile}>
            Edit Profile
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {user.imageUrl && (
            <img
              src={user.imageUrl}
              alt={user.fullName || "User"}
              className="h-16 w-16 rounded-full border-2 border-primary/20"
            />
          )}
          <div>
            <div className="font-semibold text-lg">
              {user.fullName || "User"}
            </div>
            <div className="text-sm text-muted-foreground">
              {user.primaryEmailAddress?.emailAddress}
            </div>
          </div>
        </div>
        <Separator />
        <div className="grid gap-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">User ID</span>
            <span className="text-sm font-mono">{user.id.slice(0, 12)}...</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Member since</span>
            <span className="text-sm">
              {user.createdAt
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
  );
}
