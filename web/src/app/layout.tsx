// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import "~/styles/globals.css";

import { type Metadata } from "next";
import Script from "next/script";

import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "../components/toaster";
import { env } from "~/env";

// ⬇ 新增
import { ConfigProvider } from "../hooks/useConfig";

export const metadata: Metadata = {
  title: "🦌 DeerFlow",
  description: "Deep Exploration and Efficient Research...",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="markdown-it-fix" strategy="beforeInteractive">
          {`if (typeof window !== 'undefined' && typeof window.isSpace === 'undefined') {
              window.isSpace = function(code) {
                return code === 0x20 || code === 0x09 || code === 0x0A || code === 0x0B || code === 0x0C || code === 0x0D;
              };
            }`}
        </Script>
      </head>
      <body className="bg-app">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* ⬇ 将整个 app 包在 ConfigProvider 里 */}
          <ConfigProvider>
            {children}
            <Toaster />
          </ConfigProvider>
        </ThemeProvider>

        {/* analytics block 保留原样 */}
        {env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY && env.AMPLITUDE_API_KEY && (
          <>
            <Script src="https://cdn.amplitude.com/script/d2197dd1df3f2959f26295bb0e7e849f.js"></Script>
            <Script id="amplitude-init" strategy="lazyOnload">
              {`window.amplitude.init('${env.AMPLITUDE_API_KEY}', {"fetchRemoteConfig":true,"autocapture":true});`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
