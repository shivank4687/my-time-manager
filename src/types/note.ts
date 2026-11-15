export type NoteType = "general" | "scratchpad" | "daily" | "goal" | "task" | "bucket_reference";

export interface Note {
  id: string;
  title?: string;
  content: string;
  type: NoteType;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  
  // Foreign keys
  date?: string; // For daily reflection (YYYY-MM-DD)
  goalId?: string; // For goal journal
  taskId?: string; // For task context
  bucketId?: string; // For categorized reference notebooks
}
