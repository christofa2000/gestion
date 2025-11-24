import { cn } from "@/lib/utils/cn";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Gestión Multi-Club",
  description: "Sistema de gestión para clubes deportivos - Multi-tenant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={cn(inter.variable, "theme-neutral antialiased font-sans")}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
