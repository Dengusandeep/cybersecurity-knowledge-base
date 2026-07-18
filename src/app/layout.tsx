import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthListener from "@/components/auth/AuthListener";

export const metadata: Metadata = {
  title: {
    default: "S_Library — Cybersecurity Knowledge Library",
    template: "%s | S_Library",
  },
  description:
    "Personal cybersecurity knowledge library documenting SOC investigations, TryHackMe labs, PortSwigger labs, Blue Team challenges, CTFs, projects, and write-ups.",
  keywords: [
    "cybersecurity",
    "SOC analyst",
    "TryHackMe",
    "PortSwigger",
    "HackTheBox",
    "blue team",
    "CTF",
    "write-ups",
    "security labs",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <AuthListener />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
