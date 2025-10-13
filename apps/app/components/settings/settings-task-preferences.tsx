"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { CheckCircle2, Clock } from "lucide-react";

interface SettingsTaskPreferencesProps {
  readonly defaultStatus: string | null | undefined;
  readonly onDefaultStatusChange: (status: "todo" | "in-progress") => void;
}

export function SettingsTaskPreferences({
  defaultStatus,
  onDefaultStatusChange,
}: SettingsTaskPreferencesProps) {
  const currentStatus = (
    defaultStatus === "in-progress" ? "in-progress" : "todo"
  ) as "todo" | "in-progress";

  return (
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
                {currentStatus === "todo" ? (
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
              <DropdownMenuItem onClick={() => onDefaultStatusChange("todo")}>
                <CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" />
                To Do
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDefaultStatusChange("in-progress")}
              >
                <Clock className="mr-2 h-4 w-4 text-blue-500" />
                In Progress
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
