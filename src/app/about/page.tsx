import {
  Shield,
  Award,
  BookOpen,
  Terminal,
  Target,
  Brain,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About the author — SOC Analyst and cybersecurity learner documenting their journey.",
};

const skills = [
  "Network Security",
  "SIEM (Splunk, ELK)",
  "Incident Response",
  "Malware Analysis",
  "Threat Hunting",
  "Digital Forensics",
  "Web Application Security",
  "Penetration Testing",
  "Python Scripting",
  "Linux Administration",
  "Wireshark",
  "Burp Suite",
];


export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20">
          <Shield className="h-8 w-8 text-accent-light" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">About Me</h1>
        <p className="mt-2 text-lg text-text-secondary">
          SOC Analyst &middot; Cybersecurity Learner
        </p>
      </div>

      {/* Introduction */}
      <section className="mb-12 rounded-xl border border-border bg-bg-secondary p-6 sm:p-8">
        <p className="text-text-secondary leading-relaxed">
          I&apos;m a cybersecurity enthusiast and aspiring SOC analyst documenting my learning
          journey through hands-on labs, investigations, and research. This library serves as
          my personal knowledge base — a place to organize write-ups, share methodology, and
          track progress across platforms like TryHackMe, PortSwigger, HackTheBox, and Blue
          Team Labs Online.
        </p>
        <p className="mt-4 text-text-secondary leading-relaxed">
          I believe in learning by doing, and every write-up here represents real hands-on work.
          My goal is to build a strong foundation in defensive security while continuously
          expanding my offensive security skills.
        </p>
      </section>

      {/* Skills */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-2">
          <Brain className="h-5 w-5 text-accent-light" />
          <h2 className="text-xl font-bold text-text-primary">Skills & Tools</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-lg border border-border bg-bg-secondary px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-accent/30 hover:text-accent-light"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Focus Areas */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-2">
          <Target className="h-5 w-5 text-accent-light" />
          <h2 className="text-xl font-bold text-text-primary">Focus Areas</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: Shield, title: "Blue Team / Defense", desc: "SIEM monitoring, incident response, threat hunting, and log analysis." },
            { icon: Terminal, title: "Offensive Security", desc: "Penetration testing, web app security, and vulnerability assessment." },
            { icon: BookOpen, title: "Research & Learning", desc: "Continuous learning through labs, courses, certifications, and CTFs." },
            { icon: Award, title: "Documentation", desc: "Detailed write-ups with methodology, commands, and lessons learned." },
          ].map((area) => (
            <div key={area.title} className="rounded-xl border border-border bg-bg-secondary p-5">
              <area.icon className="mb-3 h-5 w-5 text-accent-light" />
              <h3 className="mb-1 font-semibold text-text-primary">{area.title}</h3>
              <p className="text-sm text-text-muted">{area.desc}</p>
            </div>
          ))}
        </div>
      </section>


    </div>
  );
}
