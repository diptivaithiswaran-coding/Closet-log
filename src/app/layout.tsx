import type { Metadata } from "next";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/900.css";
import "@fontsource/fraunces/400-italic.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Closet Log",
  description: "Track what you own and what you actually wear.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
