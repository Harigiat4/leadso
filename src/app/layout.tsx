import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Leadso: Your B2B Lead Generation Solution!",
  description: "Find verified business emails, leads and enrich company data effortlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          "antialiased min-h-screen bg-background text-foreground"
        )}
      >
        {children}
      </body>
    </html>
  );
}
