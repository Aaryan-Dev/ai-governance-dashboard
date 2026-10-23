import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import "./globals.css";

const description = "Visibility into AI tool usage, spend and approved limits across the organization.";

export const metadata: Metadata = {
  title: { default: "AI Governance Dashboard", template: "%s · AI Governance" },
  description,
  openGraph: { title: "AI Governance Dashboard", description, type: "website" },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f9f9f7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
