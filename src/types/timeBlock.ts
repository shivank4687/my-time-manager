export type TaskStatus = "inbox" | "scheduled" | "completed";

export interface TimeBlock {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  date?: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  category?: string;
  createdAt: string; // ISO String
}
