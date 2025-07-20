import * as React from "react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <span role="img" aria-label="deer">🦌</span>
      <span className="font-bold tracking-tight">DeerFlow</span>
    </div>
  );
}
