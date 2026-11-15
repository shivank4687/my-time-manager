export interface Bucket {
  id: string;
  name: string;
  createdAt: string;
}

export type BucketItemStatus = "active" | "completed";

export type BucketItemPriority = "none" | "low" | "medium" | "high" | "critical";

export interface BucketItem {
  id: string;
  bucketId: string;
  content: string;
  status: BucketItemStatus;
  priority?: BucketItemPriority;
  resultInfo?: string;
  createdAt: string;
}
