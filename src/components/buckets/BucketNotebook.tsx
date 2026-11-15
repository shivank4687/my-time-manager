import { useState, useEffect, useRef } from "react";
import { Book } from "lucide-react";
import { useNotes } from "../../hooks/useNotes";
import { RichTextEditor } from "../notes/RichTextEditor";

interface BucketNotebookProps {
  bucketId: string;
}

export function BucketNotebook({ bucketId }: BucketNotebookProps) {
  const { getNotesByBucket, addNote, updateNote } = useNotes();
  const [content, setContent] = useState("");
  const [noteId, setNoteId] = useState<string | null>(null);


  useEffect(() => {
    const notes = getNotesByBucket(bucketId);
    if (notes.length > 0) {
      setContent(notes[0].content);
      setNoteId(notes[0].id);
    } else {
      setContent("");
      setNoteId(null);
    }
  }, [bucketId]);

  // Auto-save logic
  const contentRef = useRef(content);
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      const currentContent = contentRef.current;
      // We only save if there's an actual note or if the user typed something
      if (currentContent !== "") {
        if (noteId) {
          updateNote(noteId, { content: currentContent });
        } else {
          const newNote = addNote({
            title: "Bucket Notes",
            content: currentContent,
            type: "bucket_reference",
            bucketId,
          });
          setNoteId(newNote.id);
        }
      }
    }, 2000);
    return () => clearInterval(saveInterval);
  }, [noteId, bucketId, updateNote, addNote]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Book className="text-indigo-600" size={20} />
          Notebook
        </h3>
        <div className="text-xs text-gray-400 italic">Auto-saved</div>
      </div>
      
      <div className="flex-1 min-h-[400px]">
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Store long-term reference material, wikis, or detailed notes for this bucket here..."
        />
      </div>
    </div>
  );
}
