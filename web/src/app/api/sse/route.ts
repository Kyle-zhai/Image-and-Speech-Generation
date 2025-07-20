import { NextResponse } from "next/server";

type AgentResponse = {
  type: "text" | "image" | "audio" | "video";
  content: string;
  name?: string;
};

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // 模拟异步 Agent 多模态响应流程
      const responses: AgentResponse[] = [
        {
          type: "text",
          content: "Here is a generated image of a white cat.",
        },
        {
          type: "image",
          content: "https://example.com/white-cat.jpg",
          name: "White Cat",
        },
        {
          type: "text",
          content: "Now generating speech...",
        },
        {
          type: "audio",
          content: "https://example.com/audio/hello.mp3",
          name: "Speech Output",
        },
        {
          type: "video",
          content: "https://example.com/video/sample.mp4",
          name: "Demo Video",
        },
      ];

      for (const r of responses) {
        const data = `data: ${JSON.stringify(r)}\n\n`;
        controller.enqueue(encoder.encode(data));
        await new Promise((res) => setTimeout(res, 1000)); // 模拟延迟
      }

      controller.close(); // 关闭 SSE
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
