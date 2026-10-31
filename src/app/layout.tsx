import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tropical Shipping",
  description: "Shipping from Miami to the Caribbean",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}