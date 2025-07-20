// web/src/hooks/useSSE.ts
"use client"

import { useEffect, useState } from "react";

export function useSSE(url: string) {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      setMessages((prev: any) => [...prev, event.data]);
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [url]);

  return messages;
}
