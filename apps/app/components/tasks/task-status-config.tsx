import { Circle, Clock, CheckCircle2, XCircle } from "lucide-react";
import type { Task } from "@workspace/types";

export type StatusFilter = Task["status"] | "all";

type StatusConfig = {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  badgeVariant: string;
};

export const statusConfig = {
  todo: {
    label: "To Do",
    icon: Circle,
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
    badgeVariant: "secondary" as const,
  },
  "in-progress": {
    label: "In Progress",
    icon: Clock,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    badgeVariant: "default" as const,
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950",
    badgeVariant: "default" as const,
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950",
    badgeVariant: "destructive" as const,
  },
} satisfies Record<Task["status"], StatusConfig>;

export const StatusIcon = ({ status }: { status: Task["status"] }) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  return <Icon className={`h-5 w-5 ${config.color}`} />;
};
