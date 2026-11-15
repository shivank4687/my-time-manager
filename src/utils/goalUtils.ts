import type { Goal } from "../types/goal";
import type { TimeBlock } from "../types/timeBlock";
import { differenceInDays, parseISO, isValid } from "date-fns";

// Get all recursive child goals for a specific goal
export const getRecursiveChildGoals = (goalId: string, allGoals: Goal[]): Goal[] => {
  const directChildren = allGoals.filter(g => g.parentGoalId === goalId);
  const allChildren = [...directChildren];
  
  for (const child of directChildren) {
    allChildren.push(...getRecursiveChildGoals(child.id, allGoals));
  }
  
  return allChildren;
};

// Check if a goal would cause a circular dependency if parentId is set
export const wouldCauseCircularDependency = (goalId: string, potentialParentId: string, allGoals: Goal[]): boolean => {
  if (goalId === potentialParentId) return true;
  
  const children = getRecursiveChildGoals(goalId, allGoals);
  return children.some(c => c.id === potentialParentId);
};

export interface GoalProgress {
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
  timeInvestedMinutes: number;
  daysRemaining: number | null;
}

// Calculate aggregated progress including all child goals
export const calculateGoalProgress = (goal: Goal, allGoals: Goal[], allTasks: TimeBlock[]): GoalProgress => {
  const childGoals = getRecursiveChildGoals(goal.id, allGoals);
  const relevantGoalIds = [goal.id, ...childGoals.map(g => g.id)];
  
  const relevantTasks = allTasks.filter(t => t.goalId && relevantGoalIds.includes(t.goalId) && t.status !== "inbox");
  
  const totalTasks = relevantTasks.length;
  const completedTasks = relevantTasks.filter(t => t.status === "completed").length;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  
  const timeInvestedMinutes = relevantTasks.reduce((sum, task) => sum + (task.actualMinutes || 0), 0);
  
  let daysRemaining = null;
  if (goal.targetDate) {
    const target = parseISO(goal.targetDate);
    if (isValid(target)) {
      daysRemaining = differenceInDays(target, new Date());
    }
  }

  return {
    totalTasks,
    completedTasks,
    progressPercentage,
    timeInvestedMinutes,
    daysRemaining
  };
};

export const getGoalHierarchyString = (goalId: string, allGoals: Goal[]): string => {
  let currentId: string | undefined = goalId;
  const hierarchy: string[] = [];
  
  while (currentId) {
    const goal = allGoals.find(g => g.id === currentId);
    if (!goal) break;
    hierarchy.unshift(goal.title);
    currentId = goal.parentGoalId;
  }
  
  if (hierarchy.length === 0) return "";
  
  if (hierarchy.length === 1) {
    return `🎯 ${hierarchy[0]}`;
  }
  
  return `🎯 ${hierarchy[0]} ↳ ${hierarchy.slice(1).join(" ↳ ")}`;
};
