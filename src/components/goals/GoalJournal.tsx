import { useState, useEffect, useRef } from "react";
import { BookOpen } from "lucide-react";
import { useNotes } from "../../hooks/useNotes";
import { RichTextEditor } from "../notes/RichTextEditor";

interface GoalJournalProps {
  goalId: string;
}

export function GoalJournal({ goalId }: GoalJournalProps) {
  const { getNotesByGoal, addNote, updateNote } = useNotes();
  const [content, setContent] = useState("");
  const [noteId, setNoteId] = useState<string | null>(null);


  useEffect(() => {
    const notes = getNotesByGoal(goalId);
    if (notes.length > 0) {
      setContent(notes[0].content);
      setNoteId(notes[0].id);
    }
  }, [goalId]);

  // Auto-save logic
  const contentRef = useRef(content);
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      const currentContent = contentRef.current;
      if (currentContent !== "") {
        if (noteId) {
          updateNote(noteId, { content: currentContent });
        } else {
          const newNote = addNote({
            title: "Goal Journal",
            content: currentContent,
            type: "goal",
            goalId,
          });
          setNoteId(newNote.id);
        }
      }
    }, 2000);
    return () => clearInterval(saveInterval);
  }, [noteId, goalId, updateNote, addNote]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4 mt-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <BookOpen size={20} className="text-indigo-500" />
          Goal Journal
        </h3>
        <div className="text-xs text-gray-400 italic">Auto-saved</div>
      </div>
      
      <div className="h-64 sm:h-96">
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Document your strategy, reflect on progress, and brainstorm ideas for this goal here..."
          className="h-full"
        />
      </div>
    </div>
  );
}
