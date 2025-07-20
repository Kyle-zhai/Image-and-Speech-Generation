"use client"
import React, { useMemo } from "react";

// ---- Landing / existing site sections ----
import { SiteHeader } from "./chat/components/site-header";
import { Jumbotron } from "./landing/components/jumbotron";
import { Ray } from "./landing/components/ray";
import { CaseStudySection } from "./landing/sections/case-study-section";
import { CoreFeatureSection } from "./landing/sections/core-features-section";
import { JoinCommunitySection } from "./landing/sections/join-community-section";
import { MultiAgentSection } from "./landing/sections/multi-agent-section";

// ---- Runtime config (planner/image/speech enable flags) ----
import { useConfig } from "../hooks/useConfig";

// ---- Live agent SSE panel (streams image/audio/video/text events) ----
import LiveAgentSSEPanel from "../components/live-agent-sse-panel";

/* -------------------------------------------------------------------------------------------------
 * Page Component
 * -----------------------------------------------------------------------------------------------*/
export default function HomePage() {
  const { config, loading, error } = useConfig();

  return (
    <div className="flex flex-col items-center">
      <SiteHeader />

      <main className="container flex flex-col items-center justify-center gap-56">
        {/* Static landing sections (marketing) */}
        <Jumbotron />
        <CaseStudySection />
        <MultiAgentSection />
        <CoreFeatureSection />
        <JoinCommunitySection />

        {/* Live streaming agent output */}
        <section id="live-agent" className="w-full mt-20 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Live Agent Responses</h2>

          {loading && (
            <p className="text-sm text-muted-foreground">Loading configuration…</p>
          )}

          {!loading && (
            <>
              {error && (
                <WarningBanner message="Failed to load config. Using defaults." />
              )}
              {!config.imageEnabled && (
                <WarningBanner message="Image generation disabled in config." />
              )}
              {!config.speechEnabled && (
                <WarningBanner message="Speech generation disabled in config." />
              )}

              {/* SSE panel actually renders streamed responses */}
              <LiveAgentSSEPanel endpoint="/api/sse" enabled />
            </>
          )}
        </section>
      </main>

      <Footer />
      <Ray />
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Footer
 * -----------------------------------------------------------------------------------------------*/
function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);
  return (
    <footer className="container mt-32 flex flex-col items-center justify-center">
      <hr className="from-border/0 via-border/70 to-border/0 m-0 h-px w-full border-none bg-gradient-to-r" />
      <div className="text-muted-foreground container flex h-20 flex-col items-center justify-center text-sm">
        <p className="text-center font-serif text-lg md:text-xl">
          &quot;Originated from Open Source, give back to Open Source.&quot;
        </p>
      </div>
      <div className="text-muted-foreground container mb-8 flex flex-col items-center justify-center text-xs">
        <p>Licensed under MIT License</p>
        <p>&copy; {year} DeerFlow</p>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Small in-page warning banner (config flags / errors)
 * -----------------------------------------------------------------------------------------------*/
function WarningBanner({ message }: { message: string }) {
  return (
    <div className="w-full rounded-md border border-yellow-400/40 bg-yellow-400/10 px-4 py-2 text-sm text-yellow-700 dark:text-yellow-300">
      {message}
    </div>
  );
}