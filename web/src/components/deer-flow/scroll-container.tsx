import * as React from "react";

export function ScrollContainer({
  children,
  className = "",
  maxHeight = 400,
}: {
  children: React.ReactNode;
  className?: string;
  maxHeight?: number;
}) {
  return (
    <div
      className={`overflow-y-auto rounded-md border p-2 ${className}`}
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
}
