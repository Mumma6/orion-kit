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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Circle,
  Clock,
  CheckCircle2,
  XCircle,
  Edit2,
  MoreVertical,
  Trash2,
  Plus,
} from "lucide-react";
import type { Task } from "@workspace/database";
import {
  StatusIcon,
  statusConfig,
  type StatusFilter,
} from "./task-status-config";

interface TasksTableProps {
  tasks: Task[];
  filteredTasks: Task[];
  statusFilter: StatusFilter;
  searchQuery: string;
  onEditTask: (task: Task) => void;
  onStatusChange: (task: Task, status: Task["status"]) => void;
  onDeleteTask: (taskId: number) => void;
  onCreateTask: () => void;
}

export function TasksTable({
  tasks,
  filteredTasks,
  statusFilter,
  searchQuery,
  onEditTask,
  onStatusChange,
  onDeleteTask,
  onCreateTask,
}: TasksTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {statusFilter === "all"
            ? "All Tasks"
            : `${statusConfig[statusFilter].label} Tasks`}
        </CardTitle>
        <CardDescription>
          {filteredTasks.length === 0
            ? searchQuery
              ? "No tasks match your search"
              : statusFilter === "all"
                ? "No tasks yet. Create your first task!"
                : `No ${statusConfig[statusFilter].label.toLowerCase()} tasks`
            : `Showing ${filteredTasks.length} of ${tasks.length} tasks`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredTasks.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Status</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Description
                  </TableHead>
                  <TableHead className="hidden sm:table-cell w-[140px]">
                    Created
                  </TableHead>
                  <TableHead className="w-[100px]">Badge</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id} className="group">
                    <TableCell>
                      <StatusIcon status={task.status} />
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => onEditTask(task)}
                        className="text-left font-medium hover:text-primary transition-colors"
                      >
                        {task.title}
                      </button>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-[300px]">
                      {task.description ? (
                        <span className="text-sm text-muted-foreground truncate block">
                          {task.description}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">
                          No description
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {new Date(task.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[task.status].badgeVariant}>
                        {statusConfig[task.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditTask(task)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {task.status !== "todo" && (
                            <DropdownMenuItem
                              onClick={() => onStatusChange(task, "todo")}
                            >
                              <Circle className="mr-2 h-4 w-4" />
                              Mark as To Do
                            </DropdownMenuItem>
                          )}
                          {task.status !== "in-progress" && (
                            <DropdownMenuItem
                              onClick={() =>
                                onStatusChange(task, "in-progress")
                              }
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              Mark as In Progress
                            </DropdownMenuItem>
                          )}
                          {task.status !== "completed" && (
                            <DropdownMenuItem
                              onClick={() => onStatusChange(task, "completed")}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Mark as Completed
                            </DropdownMenuItem>
                          )}
                          {task.status !== "cancelled" && (
                            <DropdownMenuItem
                              onClick={() => onStatusChange(task, "cancelled")}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Mark as Cancelled
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => onDeleteTask(task.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <Circle className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-medium">
              {searchQuery ? "No tasks found" : "No tasks yet"}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Get started by creating your first task"}
            </p>
            {!searchQuery && (
              <Button onClick={onCreateTask}>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
