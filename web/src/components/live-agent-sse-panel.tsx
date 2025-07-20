"use client";

import React from "react";
import AgentResponseRenderer from "./AgentResponseRenderer";

type Props = {
  endpoint: string;
  enabled?: boolean;
};

export default function LiveAgentSSEPanel({ endpoint, enabled = true }: Props) {
  const [events, setEvents] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!enabled) return;
    const src = new EventSource(endpoint);
    src.onmessage = (ev) => {
      setEvents((prev) => [...prev, ev.data]);
    };
    src.onerror = (err) => {
      console.warn("[LiveAgentSSEPanel] SSE error", err);
      src.close();
    };
    return () => src.close();
  }, [endpoint, enabled]);

  if (!enabled) return null;

  return (
    <div className="space-y-4">
      {events.length === 0 && (
        <p className="text-sm text-muted-foreground">Waiting for agent output…</p>
      )}
      {events.map((raw, i) => {
        let parsed: any = { type: "text", content: raw };
        try {
          parsed = JSON.parse(raw);
        } catch {
          /* ignore */
        }
        return <AgentResponseRenderer key={i} response={parsed} />;
      })}
    </div>
  );
}
