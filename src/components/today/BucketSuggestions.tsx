import { Box } from "lucide-react";
import { useBuckets } from "../../hooks/useBuckets";
import { Link } from "react-router-dom";

export function BucketSuggestions() {
  const { items } = useBuckets();
  
  // Get active items with medium, high, or critical priority
  const activeItems = items.filter(i => 
    i.status === "active" && 
    (i.priority === "medium" || i.priority === "high" || i.priority === "critical")
  );

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xs font-bold text-gray-400 tracking-wider uppercase flex items-center gap-1.5">
          <Box size={14} />
          From Buckets (High Priority)
        </h2>
      </div>
      
      {activeItems.length === 0 ? (
        <div className="text-sm text-gray-400 italic">
          No high priority items in your buckets right now.
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {activeItems.map(item => (
            <div key={item.id} className="flex items-start gap-2 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
              <span className="text-sm text-gray-700 line-clamp-2 leading-relaxed">{item.content}</span>
            </div>
          ))}
        </div>
      )}
      
      <Link 
        to="/buckets"
        className="mt-2 text-center text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-2.5 rounded-xl transition-colors"
      >
        Go to Buckets
      </Link>
    </div>
  );
}
