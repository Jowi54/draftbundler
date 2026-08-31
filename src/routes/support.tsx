import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell, PageHeading } from "@/components/bundler/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useBundler } from "@/lib/bundler-store";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support & Feedback — Bundler" },
      {
        name: "description",
        content:
          "Talk to the Bundler team, send feedback, or find answers about sign-in details, OTPs and billing.",
      },
      { property: "og:title", content: "Support & Feedback — Bundler" },
      {
        property: "og:description",
        content: "Live chat, email and FAQs for your Bundler subscription.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SupportPage,
});

const faqs = [
  {
    q: "Why does a service ask for a one-time code?",
    a: "Shared accounts sometimes verify a new device. Open the service page in your dashboard and tap Generate OTP — the code is valid for 2 minutes.",
  },
  {
    q: "Can I change the account password myself?",
    a: "No. Passwords are rotated by Bundler each month so every household member keeps access. Always copy the latest one from the dashboard.",
  },
  {
    q: "What happens if my plan expires?",
    a: "Access pauses immediately but your profiles are held for 14 days. Renew in advance to avoid interruption.",
  },
  {
    q: "How do referral rewards pay out?",
    a: "Credit is applied automatically to your next invoice once your friend completes their first payment.",
  },
];

function SupportPage() {
  const { state } = useBundler();
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");

  return (
    <AppShell>
      <PageHeading title="Support & Feedback" subtitle="We usually reply within 5 minutes." />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: MessageSquare, label: "Live chat", value: "Online now" },
          { icon: Mail, label: "Email", value: "help@bundler.co" },
          { icon: Phone, label: "Phone", value: "+1 (800) 555-0110" },
        ].map((c) => (
          <div key={c.label} className="panel flex items-center gap-3 p-5">
            <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <c.icon className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {c.label}
              </p>
              <p className="font-bold">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="panel mt-6 p-6">
        <h2 className="text-base font-extrabold">Send us a message</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Replying to <span className="font-semibold text-foreground">{state.settings.email}</span>
        </p>
        <div className="mt-4 space-y-3">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="I need help with Disney+ sign-in"
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what's happening…"
            />
          </div>
        </div>
        <Button
          className="mt-4 gap-2"
          onClick={() => {
            if (subject.trim().length < 3 || message.trim().length < 10) {
              toast.error("Add a subject and a bit more detail");
              return;
            }
            setSubject("");
            setMessage("");
            toast.success("Message sent", { description: "A specialist will reply shortly." });
          }}
        >
          <Send className="size-4" /> Send message
        </Button>
      </section>

      <h2 className="mb-3 mt-9 text-lg font-extrabold">Frequently asked</h2>
      <section className="panel px-6 py-2">
        <Accordion type="single" collapsible>
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left font-bold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </AppShell>
  );
}
