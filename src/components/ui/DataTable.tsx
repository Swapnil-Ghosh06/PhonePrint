import React from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  className?: string;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  className = "",
  emptyMessage = "No survey records found",
}: DataTableProps<T>) {
  return (
    <div
      className={`overflow-x-auto rounded-xs border border-stone-300/80 bg-white shadow-none ${className}`}
    >
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-stone-300/80 bg-stone-100/70 text-stone-700 font-medium">
            {columns.map((col) => {
              const alignClass =
                col.align === "center"
                  ? "text-center"
                  : col.align === "right"
                  ? "text-right"
                  : "text-left";
              return (
                <th
                  key={col.key}
                  className={`px-4 py-2.5 font-mono tracking-wider uppercase text-[10px] text-stone-600 font-semibold ${alignClass} ${col.className || ""}`}
                >
                  {col.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200/60 font-sans">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-stone-400 italic"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr
                key={keyExtractor(item)}
                className={`transition-colors hover:bg-stone-50 ${
                  idx % 2 === 1 ? "bg-[#FAF9F5]/40" : "bg-white"
                }`}
              >
                {columns.map((col) => {
                  const alignClass =
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                      ? "text-right"
                      : "text-left";
                  return (
                    <td
                      key={col.key}
                      className={`px-4 py-2.5 text-stone-800 ${alignClass} ${col.className || ""}`}
                    >
                      {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
