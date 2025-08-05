import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata: Metadata = {
  title: "Dashboard Metalom",
  description: "Dashboard Metalom",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Fonte Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        {/* Google Material Symbols */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded" rel="stylesheet" />
      </head>
      <body
        className="antialiased font-[Inter] bg-gray-50 text-[#1a202c]"
        style={{ fontFamily: 'Inter, sans-serif', color: '#1a202c' }}
      >
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64 bg-white p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
