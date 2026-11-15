export type TaskStatus = "inbox" | "scheduled" | "in_progress" | "completed";
export type TaskPriority = "critical" | "high" | "medium" | "low" | "routine";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TimeBlock {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  date?: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  category?: string;
  priority?: TaskPriority;
  recurringGroupId?: string;
  recurrence?: {
    days: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
    until: string; // YYYY-MM-DD
  };
  createdAt: string; // ISO String
  goalId?: string | null;
  
  // Advanced features
  subtasks?: Subtask[];
  tags?: string[];
  estimatedMinutes?: number;
  actualMinutes?: number;
}
