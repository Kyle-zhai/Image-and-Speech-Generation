"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  content: string;
  className?: string;
};

export function Markdown({ content, className = "" }: Props) {
  if (!content) return null;
  return (
    <div className={`prose max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
