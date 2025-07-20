import * as React from "react";
import { clsx } from "clsx";

export function RainbowText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}
