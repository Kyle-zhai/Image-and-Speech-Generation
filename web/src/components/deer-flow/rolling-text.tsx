"use client";

import * as React from "react";

export function RollingText({
  text,
  speed = 20,
  className = "",
}: {
  text: string;
  speed?: number; // ms per char
  className?: string;
}) {
  const [shown, setShown] = React.useState("");

  React.useEffect(() => {
    setShown("");
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return <span className={className}>{shown}</span>;
}
