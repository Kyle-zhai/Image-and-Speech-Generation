import { NextResponse } from "next/server";

/**
 * Minimal mock config for front-end development without Python backend.
 * Extend this later to read real server settings.
 */
export async function GET() {
  return NextResponse.json({
    version: "dev",
    plannerEnabled: true,
    imageEnabled: true,
    speechEnabled: true,
    backendBase: process.env.NEXT_PUBLIC_API_BASE ?? null,
  });
}
