import * as React from "react";

type Props = {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function Tooltip({ content, children, className = "" }: Props) {
  return (
    <span className={`relative group inline-block ${className}`}>
      {children}
      <span
        className="
          pointer-events-none absolute bottom-full left-1/2 z-50 
          -translate-x-1/2 mb-1 whitespace-nowrap rounded bg-black px-2 py-1 
          text-[10px] text-white opacity-0 transition group-hover:opacity-100
        "
      >
        {content}
      </span>
    </span>
  );
}
