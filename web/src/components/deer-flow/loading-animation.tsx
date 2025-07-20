import * as React from "react";

export function LoadingAnimation({
  message = "Loading...",
  className = "",
}: { message?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
      <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
      {message}
    </div>
  );
}
