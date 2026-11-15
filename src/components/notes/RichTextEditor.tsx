import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import { 
  Bold, Italic, Heading, Strikethrough, 
  Quote, Code, List, ListOrdered, Link as LinkIcon 
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ 
    icon: Icon, 
    onClick, 
    isActive, 
    title 
  }: { 
    icon: any, 
    onClick: () => void, 
    isActive?: boolean, 
    title: string 
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${
        isActive 
          ? 'bg-indigo-100 text-indigo-700' 
          : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
      }`}
      title={title}
    >
      <Icon size={16} />
    </button>
  );

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar p-2 border-b border-gray-200 bg-gray-50">
      <ToolbarButton 
        title="Heading 3" 
        icon={Heading} 
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
      />
      <div className="w-px h-4 bg-gray-300 mx-1"></div>
      <ToolbarButton 
        title="Bold" 
        icon={Bold} 
        onClick={() => editor.chain().focus().toggleBold().run()} 
        isActive={editor.isActive('bold')}
      />
      <ToolbarButton 
        title="Italic" 
        icon={Italic} 
        onClick={() => editor.chain().focus().toggleItalic().run()} 
        isActive={editor.isActive('italic')}
      />
      <ToolbarButton 
        title="Strikethrough" 
        icon={Strikethrough} 
        onClick={() => editor.chain().focus().toggleStrike().run()} 
        isActive={editor.isActive('strike')}
      />
      <div className="w-px h-4 bg-gray-300 mx-1"></div>
      <ToolbarButton 
        title="Quote" 
        icon={Quote} 
        onClick={() => editor.chain().focus().toggleBlockquote().run()} 
        isActive={editor.isActive('blockquote')}
      />
      <ToolbarButton 
        title="Code Block" 
        icon={Code} 
        onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
        isActive={editor.isActive('codeBlock')}
      />
      <ToolbarButton 
        title="Link" 
        icon={LinkIcon} 
        onClick={setLink} 
        isActive={editor.isActive('link')}
      />
      <div className="w-px h-4 bg-gray-300 mx-1"></div>
      <ToolbarButton 
        title="Bulleted List" 
        icon={List} 
        onClick={() => editor.chain().focus().toggleBulletList().run()} 
        isActive={editor.isActive('bulletList')}
      />
      <ToolbarButton 
        title="Numbered List" 
        icon={ListOrdered} 
        onClick={() => editor.chain().focus().toggleOrderedList().run()} 
        isActive={editor.isActive('orderedList')}
      />
    </div>
  );
};

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something...",
  className = "",
  autoFocus = false,
}: RichTextEditorProps) {
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    autofocus: autoFocus,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none prose-indigo focus:outline-none min-h-[150px] p-4',
        'data-placeholder': placeholder,
      },
    },
  });

  // Keep editor content in sync if value changes externally (like when changing tabs)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className={`flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm ${className}`}>
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-auto bg-white cursor-text" onClick={() => editor?.commands.focus()}>
        <EditorContent editor={editor} className="h-full" />
      </div>
      <style>{`
        /* Add some basic styling for the editor content empty state */
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}
