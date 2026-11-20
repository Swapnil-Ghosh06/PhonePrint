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
      className={`overflow-x-auto glass-panel rounded-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${className}`}
    >
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-200/60 bg-white/50 text-slate-700">
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
                  className={`px-5 py-3.5 font-montserrat tracking-wider uppercase text-[11px] text-slate-500 font-semibold ${alignClass} ${col.className || ""}`}
                >
                  {col.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 font-sans">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-slate-400 font-sans"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr
                key={keyExtractor(item)}
                className={`transition-colors duration-150 hover:bg-blue-50/40 ${
                  idx % 2 === 1 ? "bg-white/30" : "bg-transparent"
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
                      className={`px-5 py-3 text-slate-700 ${alignClass} ${col.className || ""}`}
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
