"use client";

import * as React from "react";

export type AppConfig = {
  version: string;
  plannerEnabled: boolean;
  imageEnabled: boolean;
  speechEnabled: boolean;
  backendBase: string | null;
};

const DEFAULT_CONFIG: AppConfig = {
  version: "dev",
  plannerEnabled: true,
  imageEnabled: true,
  speechEnabled: true,
  backendBase: null,
};

type CtxValue = {
  config: AppConfig;
  loading: boolean;
  error: any;
};

const ConfigContext = React.createContext<CtxValue>({
  config: DEFAULT_CONFIG,
  loading: true,
  error: null,
});

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = React.useState<AppConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<any>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const resp = await fetch("/api/config", { cache: "no-store" });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = (await resp.json()) as Partial<AppConfig>;
        if (!cancelled) {
          setConfig({ ...DEFAULT_CONFIG, ...data });
          setLoading(false);
        }
      } catch (err) {
        console.warn("[ConfigProvider] Failed to load /api/config, using defaults.", err);
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = React.useMemo<CtxValue>(
    () => ({ config, loading, error }),
    [config, loading, error],
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  return React.useContext(ConfigContext);
}

