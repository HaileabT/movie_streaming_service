import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Movie Streaming Platform",
  description: "A basic movie streaming platform built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <div className="min-h-screen bg-background text-foreground">{children}</div>
        </ToastProvider>
      </body>
    </html>
  );
}
