import * as React from "react";

export type ResourceSuggestionItem = {
  id: string;
  label: string;
  onSelect?: (id: string) => void;
};

export function ResourceSuggestion({
  items,
  onSelect,
  className = "",
}: {
  items: ResourceSuggestionItem[];
  onSelect?: (id: string) => void;
  className?: string;
}) {
  if (!items?.length) return null;
  return (
    <ul className={`rounded-md border p-2 text-sm ${className}`}>
      {items.map((it) => (
        <li
          key={it.id}
          className="cursor-pointer rounded px-2 py-1 hover:bg-accent"
          onClick={() => (it.onSelect ?? onSelect)?.(it.id)}
        >
          {it.label}
        </li>
      ))}
    </ul>
  );
}
