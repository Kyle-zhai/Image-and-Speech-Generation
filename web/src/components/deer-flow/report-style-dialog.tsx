"use client";

import * as React from "react";

type Props = {
  open: boolean;
  onOpenChange?: (v: boolean) => void;
  children?: React.ReactNode;
};

export function ReportStyleDialog({ open, onOpenChange, children }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-md border bg-card p-4 shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Report Style</h2>
        <div className="mb-4 text-sm text-muted-foreground">
          {children ?? "Customize your report style here (placeholder)."}
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => onOpenChange?.(false)}
            className="rounded-md border px-3 py-1 text-sm hover:bg-accent"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
