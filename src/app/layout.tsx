import type { Metadata } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chart Elements",
  description:
    "A sleek Power BI–inspired visualization component suite for Next.js and Tailwind.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        {/* Apply the stored palette before paint. Neutral is the bare token set;
            named alternatives live on data-palette. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=localStorage.getItem("ce-palette")||"neutral";var a=["neutral","berry","ocean","sunset","forest","slate","vivid"];if(a.indexOf(p)<0)p="neutral";if(p==="neutral")document.documentElement.removeAttribute("data-palette");else document.documentElement.setAttribute("data-palette",p);}catch(e){document.documentElement.removeAttribute("data-palette");}})();`,
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
