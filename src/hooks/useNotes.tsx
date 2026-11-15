import React, { createContext, useContext, useState, useEffect } from "react";
import type { Note, NoteType } from "../types/note";

const NOTES_STORAGE_KEY = "scheduler_notes";

interface NotesContextType {
  notes: Note[];
  addNote: (noteData: Omit<Note, "id" | "createdAt" | "updatedAt">) => Note;
  updateNote: (id: string, updates: Partial<Omit<Note, "id" | "createdAt" | "updatedAt">>) => void;
  deleteNote: (id: string) => void;
  getNotesByType: (type: NoteType) => Note[];
  getNotesByTask: (taskId: string) => Note[];
  getNotesByGoal: (goalId: string) => Note[];
  getNotesByBucket: (bucketId: string) => Note[];
  getDailyReflection: (date: string) => Note | undefined;
  getScratchpadNote: () => Note | null;
  getVisibleNotes: () => Note[];
}

const NotesContext = createContext<NotesContextType | null>(null);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const loadedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
    return loadedNotes ? JSON.parse(loadedNotes) : [];
  });

  // Sync across tabs if needed
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === NOTES_STORAGE_KEY && e.newValue) {
        setNotes(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addNote = (noteData: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    const newNote: Note = {
      ...noteData,
      id: `note_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => {
      const next = [...prev, newNote];
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Omit<Note, "id" | "createdAt" | "updatedAt">>) => {
    setNotes(prev => {
      const next = prev.map((n) =>
        n.id === id
          ? { ...n, ...updates, updatedAt: new Date().toISOString() }
          : n
      );
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const deleteNote = (id: string) => {
    setNotes(prev => {
      const next = prev.filter((n) => n.id !== id);
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const getNotesByType = (type: NoteType) => notes.filter((n) => n.type === type);
  const getNotesByTask = (taskId: string) => notes.filter((n) => n.type === "task" && n.taskId === taskId);
  const getNotesByGoal = (goalId: string) => notes.filter((n) => n.type === "goal" && n.goalId === goalId);
  const getNotesByBucket = (bucketId: string) => notes.filter((n) => n.type === "bucket_reference" && n.bucketId === bucketId);
  const getDailyReflection = (date: string) => notes.find((n) => n.type === "daily" && n.date === date);
  const getScratchpadNote = () => notes.find((n) => n.type === "scratchpad") || null;
  const getVisibleNotes = () => notes.filter((n) => n.type !== "scratchpad");

  return (
    <NotesContext.Provider
      value={{
        notes,
        addNote,
        updateNote,
        deleteNote,
        getNotesByType,
        getNotesByTask,
        getNotesByGoal,
        getNotesByBucket,
        getDailyReflection,
        getScratchpadNote,
        getVisibleNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
