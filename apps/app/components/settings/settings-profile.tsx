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
import { User as UserIcon } from "lucide-react";
import type { AuthUser } from "@/hooks/use-auth";

interface SettingsProfileProps {
  readonly user: AuthUser | null | undefined;
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
              <UserIcon className="h-5 w-5" />
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
          {user.image && (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="h-16 w-16 rounded-full border-2 border-primary/20"
            />
          )}
          <div>
            <div className="font-semibold text-lg">{user.name || "User"}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
        <Separator />
        <div className="grid gap-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">User ID</span>
            <span className="text-sm">{user.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Member since</span>
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
