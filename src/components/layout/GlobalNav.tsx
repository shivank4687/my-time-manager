import { Link, useLocation } from "react-router-dom";
import { Layout, Calendar, Box, Home, Target, BookOpen } from "lucide-react";

export function GlobalNav() {
  const location = useLocation();
  const path = location.pathname;

  const tabs = [
    { name: "Today", path: "/", icon: Home },
    { name: "Scheduler", path: "/scheduler", icon: Calendar },
    { name: "Timeline", path: "/timeline", icon: Layout },
    { name: "Goals", path: "/goals", icon: Target },
    { name: "Buckets", path: "/buckets", icon: Box },
    { name: "Notebooks", path: "/notebooks", icon: BookOpen },
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-indigo-200">
              <span className="text-white font-bold text-lg leading-none">T</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:block">TimeOS</span>
          </div>
          
          <nav className="flex items-center gap-1 bg-gray-50/50 p-1 rounded-xl border border-gray-100 shadow-inner">
            {tabs.map((tab) => {
              const isActive = path === tab.path || (path === "/" && tab.path === "/");
              const Icon = tab.icon;
              
              return (
                <Link
                  key={tab.name}
                  to={tab.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-white text-indigo-700 shadow-sm border border-gray-100/50 scale-105"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-indigo-600" : "text-gray-400"} />
                  <span className={isActive ? "block" : "hidden sm:block"}>{tab.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
