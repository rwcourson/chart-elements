import type { Metadata } from "next";
import "@rwcourson/chart-elements/tokens.css";
import "@rwcourson/chart-elements/components.css";

export const metadata: Metadata = {
  title: "Chart Elements · Next consumer fixture"
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
