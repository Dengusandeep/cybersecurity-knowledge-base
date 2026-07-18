"use client";

import { useState } from "react";
import { Send, Mail, Github, Linkedin, Twitter, CheckCircle } from "lucide-react";
import { submitContactMessage } from "@/lib/actions/contact";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const result = await submitContactMessage(formData);

    if (result.error) {
      setStatus("error");
      setErrorMsg(result.error);
    } else {
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20">
          <Mail className="h-8 w-8 text-accent-light" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">Get in Touch</h1>
        <p className="mt-2 text-text-secondary">
          Have a question, collaboration idea, or just want to connect? Send me a message.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3">
          {status === "success" ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
              <CheckCircle className="mx-auto mb-3 h-10 w-10 text-emerald-400" />
              <h3 className="text-lg font-semibold text-text-primary">Message Sent!</h3>
              <p className="mt-1 text-sm text-text-muted">
                Thanks for reaching out. I&apos;ll get back to you soon.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-4 text-sm text-accent-light underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text-secondary">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/25"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-secondary">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/25"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/25"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/25 resize-none"
                  placeholder="Your message..."
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-red-400">{errorMsg || "Something went wrong. Please try again."}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light disabled:opacity-50"
              >
                {status === "loading" ? "Sending..." : "Send Message"}
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-bg-secondary p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Connect
            </h3>
            <div className="space-y-3">
              {[
                { icon: Github, label: "GitHub", href: "#" },
                { icon: Linkedin, label: "LinkedIn", href: "#" },
                { icon: Twitter, label: "Twitter / X", href: "#" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm text-text-secondary transition-all hover:border-accent/30 hover:text-accent-light"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
