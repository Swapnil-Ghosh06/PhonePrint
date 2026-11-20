import React from "react";

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  size?: "sm" | "md";
}

export function Tabs({
  items,
  activeId,
  onChange,
  className = "",
  size = "md",
}: TabsProps) {
  const sizeStyles = {
    sm: "p-1 text-xs",
    md: "p-1.5 text-xs sm:text-sm",
  };

  const itemSizeStyles = {
    sm: "px-3 py-1.5",
    md: "px-4 py-2",
  };

  return (
    <div
      role="tablist"
      className={`glass-panel inline-flex flex-wrap items-center rounded-2xl border border-white/80 shadow-sm ${sizeStyles[size]} ${className}`}
    >
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 rounded-xl font-montserrat transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              itemSizeStyles[size]
            } ${
              isActive
                ? "bg-white text-blue-700 font-semibold shadow-sm border border-blue-100/60"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium"
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 rounded-full px-2 py-0.5 font-montserrat text-[10px] font-semibold transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-200/70 text-slate-600"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
