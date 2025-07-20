import * as React from "react";

export function Detective({
  size = 20,
  className = "",
  title = "Detective",
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <span
      role="img"
      aria-label={title}
      title={title}
      style={{ fontSize: size, lineHeight: 1 }}
      className={className}
    >
      🕵️
    </span>
  );
}
