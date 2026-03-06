import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LST Ecosystem Health Dashboard",
  description: "Interactive prototype for LST ecosystem health scoring."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-[var(--font-body)] antialiased">{children}</body>
    </html>
  );
}
