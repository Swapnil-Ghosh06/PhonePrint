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
    sm: "p-0.5 text-xs",
    md: "p-1 text-xs sm:text-sm",
  };

  const itemSizeStyles = {
    sm: "px-2.5 py-1",
    md: "px-3.5 py-1.5",
  };

  return (
    <div
      role="tablist"
      className={`inline-flex flex-wrap items-center rounded-xs border border-stone-300/80 bg-[#F4F3EE] shadow-none ${sizeStyles[size]} ${className}`}
    >
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-1.5 rounded-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 ${
              itemSizeStyles[size]
            } ${
              isActive
                ? "bg-white text-stone-900 border border-stone-300/80 shadow-none font-semibold"
                : "text-stone-600 hover:text-stone-900 hover:bg-white/50"
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 rounded-xs px-1.5 py-0.5 font-mono text-[10px] ${
                  isActive
                    ? "bg-stone-100 text-stone-800 border border-stone-300 font-semibold"
                    : "bg-stone-200/70 text-stone-600"
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
