"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Filter, Search, X } from "lucide-react";
import { statusConfig, type StatusFilter } from "./task-status-config";

interface TasksFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (filter: StatusFilter) => void;
}

export function TasksFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: TasksFiltersProps) {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            {statusFilter === "all" ? "All" : statusConfig[statusFilter].label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onStatusFilterChange("all")}>
            All Tasks
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusFilterChange("todo")}>
            To Do
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusFilterChange("in-progress")}>
            In Progress
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusFilterChange("completed")}>
            Completed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusFilterChange("cancelled")}>
            Cancelled
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
