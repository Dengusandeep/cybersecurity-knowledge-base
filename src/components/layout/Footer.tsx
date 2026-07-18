"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname === "/login") return null;

  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              <span className="text-lg font-bold text-text-primary">
                S<span className="text-accent">_</span>Library
              </span>
            </Link>
            <p className="mt-3 text-sm text-text-muted leading-relaxed">
              Documenting my cybersecurity learning journey — one lab, one investigation, one write-up at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/labs", label: "Labs" },
                { href: "/investigations", label: "SOC Investigations" },
                { href: "/projects", label: "Projects" },
                { href: "/notes", label: "Notes" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-accent-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platforms */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Platforms
            </h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>TryHackMe</li>
              <li>PortSwigger</li>
              <li>HackTheBox</li>
              <li>Blue Team Labs</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Connect
            </h3>
            <div className="flex gap-3">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Twitter, href: "#", label: "Twitter" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted transition-all hover:border-accent/50 hover:text-accent-light"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-text-muted">
          © {new Date().getFullYear()} S_Library. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
