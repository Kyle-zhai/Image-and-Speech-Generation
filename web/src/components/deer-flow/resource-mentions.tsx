import * as React from "react";

export type ResourceMention = {
  id: string;
  title: string;
  url?: string;
};

export function ResourceMentions({
  resources,
  className = "",
}: {
  resources: ResourceMention[];
  className?: string;
}) {
  if (!resources?.length) return null;
  return (
    <div className={`flex flex-wrap gap-2 text-xs ${className}`}>
      {resources.map((r) => (
        <a
          key={r.id}
          href={r.url ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded border px-2 py-1 hover:bg-accent"
        >
          {r.title}
        </a>
      ))}
    </div>
  );
}
