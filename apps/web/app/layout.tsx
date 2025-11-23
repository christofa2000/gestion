import type { Metadata } from "next";
import "./globals.css";

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
      <body className="theme-neutral" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

