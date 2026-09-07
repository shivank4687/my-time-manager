import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface HeaderProps {
  selectedDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}

export const Header = ({ selectedDate, onPrevDay, onNextDay, onToday }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between py-4 border-b border-gray-200">
      <h1 className="text-xl font-bold text-gray-800">My Time</h1>
      
      <div className="flex items-center gap-4 text-sm">
        <button
          onClick={onToday}
          className="px-3 py-1 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors font-medium"
        >
          Today
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevDay}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="min-w-[120px] text-center font-medium text-gray-700">
            {format(selectedDate, "MMMM d, yyyy")}
          </span>
          <button
            onClick={onNextDay}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
