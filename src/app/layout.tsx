import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/shared/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sanrogym | Segueix i gamifica els teus entrenaments",
  description: "Registra l'assistència al gimnàs, competeix amb amics i manté la teva ratxa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground`}
      >
        <Navbar />
        <main className="mx-auto min-h-screen w-full max-w-7xl pt-16 pb-20 px-4 sm:px-6 lg:px-8 md:pb-8">
          {children}
        </main>
      </body>
    </html>
  );
}
