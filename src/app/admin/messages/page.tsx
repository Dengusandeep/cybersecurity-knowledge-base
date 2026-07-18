import { Mail } from "lucide-react";
import { getContactMessages } from "@/lib/actions/contact";
import { formatDate } from "@/lib/utils";

export default async function MessagesPage() {
  const messages = await getContactMessages();

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold text-text-primary">Contact Messages</h1>

      {messages.length === 0 ? (
        <div className="rounded-xl border border-border bg-bg-secondary p-12 text-center">
          <Mail className="mx-auto h-10 w-10 text-text-muted" />
          <p className="mt-3 text-text-muted">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="rounded-xl border border-border bg-bg-secondary p-5"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-text-primary">{msg.subject}</h3>
                  <p className="text-sm text-text-muted">
                    {msg.name} &middot;{" "}
                    <a href={`mailto:${msg.email}`} className="text-accent-light hover:underline">
                      {msg.email}
                    </a>
                  </p>
                </div>
                <span className="text-xs text-text-muted">
                  {formatDate(msg.created_at)}
                </span>
              </div>
              <p className="text-sm text-text-secondary whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
