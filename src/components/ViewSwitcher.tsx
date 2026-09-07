export type ViewType = "month" | "week" | "day";

interface ViewSwitcherProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
}

export const ViewSwitcher = ({ currentView, onChangeView }: ViewSwitcherProps) => {
  const views: { id: ViewType; label: string }[] = [
    { id: "month", label: "Month" },
    { id: "week", label: "Week" },
    { id: "day", label: "Day" },
  ];

  return (
    <div className="flex p-1 bg-gray-100 rounded-lg w-fit">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onChangeView(view.id)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
            currentView === view.id
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
};
