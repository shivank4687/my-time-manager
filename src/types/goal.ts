export type GoalStatus = "not_started" | "started" | "paused" | "completed";

export interface Goal {
  id: string;
  title: string;
  achievement: string;
  description?: string;
  targetDate?: string; // YYYY-MM-DD
  targetDays?: number; // Target number of days to achieve this goal
  status: GoalStatus;
  parentGoalId?: string;
  createdAt: string;
  startedAt?: string;
  pausedAt?: string;
  completedAt?: string;
  actualAchievement?: string;
}
