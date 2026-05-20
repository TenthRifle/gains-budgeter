import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "gAIns",
  description: "A practical budgeting guide for South African households.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
