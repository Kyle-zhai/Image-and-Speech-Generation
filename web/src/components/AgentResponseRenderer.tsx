"use client";

import React from "react";

type AgentResponse = {
  type: "image" | "audio" | "video" | "text";
  url?: string;
  content?: string;
  name?: string;
};

export default function AgentResponseRenderer({ response }: { response: AgentResponse }) {
  if (!response) return null;

  switch (response.type) {
    case "image":
      return (
        <div className="p-2">
          <p className="font-semibold mb-2">{response.name}</p>
          <img src={response.url} alt={response.name} className="rounded-xl max-w-full" />
        </div>
      );
    case "audio":
      return (
        <div className="p-2">
          <p className="font-semibold mb-2">{response.name}</p>
          <audio controls src={response.url} className="w-full" />
        </div>
      );
    case "video":
      return (
        <div className="p-2">
          <p className="font-semibold mb-2">{response.name}</p>
          <video controls src={response.url} className="w-full rounded-xl" />
        </div>
      );
    case "text":
    default:
      return (
        <div className="p-2">
          <p className="font-semibold mb-2">{response.name}</p>
          <p className="whitespace-pre-line">{response.content}</p>
        </div>
      );
  }
}
