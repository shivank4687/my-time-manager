import React, { createContext, useContext, useState, useEffect } from "react";
import type { Bucket, BucketItem } from "../types/bucket";

const BUCKETS_STORAGE_KEY = "scheduler_buckets";
const BUCKET_ITEMS_STORAGE_KEY = "scheduler_bucket_items";

interface BucketsContextType {
  buckets: Bucket[];
  items: BucketItem[];
  addBucket: (name: string) => Bucket;
  deleteBucket: (id: string) => void;
  addItem: (bucketId: string, content: string) => BucketItem;
  deleteItem: (id: string) => void;
  toggleItemStatus: (id: string) => void;
  updateItemPriority: (id: string, priority: BucketItem["priority"]) => void;
  updateItemResultInfo: (id: string, resultInfo: string) => void;
}

const BucketsContext = createContext<BucketsContextType | null>(null);

export const BucketsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buckets, setBuckets] = useState<Bucket[]>(() => {
    const loadedBuckets = localStorage.getItem(BUCKETS_STORAGE_KEY);
    return loadedBuckets ? JSON.parse(loadedBuckets) : [];
  });
  const [items, setItems] = useState<BucketItem[]>(() => {
    const loadedItems = localStorage.getItem(BUCKET_ITEMS_STORAGE_KEY);
    return loadedItems ? JSON.parse(loadedItems) : [];
  });

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === BUCKETS_STORAGE_KEY && e.newValue) {
        try {
          setBuckets(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Failed to sync buckets from storage event", err);
        }
      }
      if (e.key === BUCKET_ITEMS_STORAGE_KEY && e.newValue) {
        try {
          setItems(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Failed to sync bucket items from storage event", err);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const saveBuckets = (newBuckets: Bucket[]) => {
    setBuckets(newBuckets);
    localStorage.setItem(BUCKETS_STORAGE_KEY, JSON.stringify(newBuckets));
  };

  const saveItems = (newItems: BucketItem[]) => {
    setItems(newItems);
    localStorage.setItem(BUCKET_ITEMS_STORAGE_KEY, JSON.stringify(newItems));
  };

  const addBucket = (name: string) => {
    const newBucket: Bucket = {
      id: `bucket_${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
    };
    saveBuckets([...buckets, newBucket]);
    return newBucket;
  };

  const deleteBucket = (id: string) => {
    saveBuckets(buckets.filter((b) => b.id !== id));
    saveItems(items.filter((i) => i.bucketId !== id)); // cascading delete
  };

  const addItem = (bucketId: string, content: string) => {
    const newItem: BucketItem = {
      id: `item_${Date.now()}`,
      bucketId,
      content,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    saveItems([newItem, ...items]); // Newest first
    return newItem;
  };

  const deleteItem = (id: string) => {
    saveItems(items.filter((i) => i.id !== id));
  };

  const toggleItemStatus = (id: string) => {
    saveItems(
      items.map((i) =>
        i.id === id ? { ...i, status: i.status === "active" ? "completed" : "active" } : i
      )
    );
  };

  const updateItemPriority = (id: string, priority: BucketItem["priority"]) => {
    saveItems(
      items.map((i) =>
        i.id === id ? { ...i, priority } : i
      )
    );
  };

  const updateItemResultInfo = (id: string, resultInfo: string) => {
    saveItems(
      items.map((i) =>
        i.id === id ? { ...i, resultInfo } : i
      )
    );
  };

  return React.createElement(
    BucketsContext.Provider,
    {
      value: {
        buckets,
        items,
        addBucket,
        deleteBucket,
        addItem,
        deleteItem,
        toggleItemStatus,
        updateItemPriority,
        updateItemResultInfo,
      },
    },
    children
  );
};

export const useBuckets = () => {
  const context = useContext(BucketsContext);
  if (!context) {
    throw new Error("useBuckets must be used within a BucketsProvider");
  }
  return context;
};
