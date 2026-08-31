import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, Gift, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell, PageHeading } from "@/components/bundler/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate, referralCode, useBundler } from "@/lib/bundler-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/refer")({
  head: () => ({
    meta: [
      { title: "Refer friends and earn $10 — Bundler" },
      {
        name: "description",
        content:
          "Share your Bundler referral link, track invites and earn $10 for every friend who subscribes.",
      },
      { property: "og:title", content: "Refer friends and earn $10 — Bundler" },
      {
        property: "og:description",
        content: "Earn $10 in Bundler credit for each friend who subscribes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReferPage,
});

function ReferPage() {
  const { state, inviteFriend } = useBundler();
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  const link = `https://bundler.co/join?ref=${referralCode}`;
  const earned = state.referrals.reduce((sum, r) => sum + r.reward, 0);

  return (
    <AppShell>
      <PageHeading
        title="Refer your friends and earn $10"
        subtitle="You earn $10 in credit each time a friend subscribes."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total earned", value: `$${earned}` },
          {
            label: "Friends joined",
            value: String(state.referrals.filter((r) => r.status === "joined").length),
          },
          {
            label: "Pending invites",
            value: String(state.referrals.filter((r) => r.status === "invited").length),
          },
        ].map((s) => (
          <div key={s.label} className="panel p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-1 text-2xl font-extrabold">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="panel mt-6 p-6">
        <div className="flex items-center gap-2">
          <Gift className="size-5 text-primary" />
          <h2 className="text-base font-extrabold">Your referral link</h2>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Input readOnly value={link} className="flex-1 min-w-56 font-mono text-sm" />
          <Button
            className="gap-2"
            onClick={async () => {
              await navigator.clipboard.writeText(link).catch(() => {});
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
              toast.success("Referral link copied");
            }}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
      </section>

      <section className="panel mt-6 p-6">
        <h2 className="text-base font-extrabold">Invite by email</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="fname">Friend's name</Label>
            <Input
              id="fname"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ada Nwosu"
            />
          </div>
          <div>
            <Label htmlFor="femail">Friend's email</Label>
            <Input
              id="femail"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="ada@example.com"
            />
          </div>
        </div>
        <Button
          className="mt-4 gap-2"
          onClick={() => {
            if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
              toast.error("Add a name and a valid email");
              return;
            }
            inviteFriend(form.name.trim(), form.email.trim());
            setForm({ name: "", email: "" });
            toast.success("Invite sent");
          }}
        >
          <Send className="size-4" /> Send invite
        </Button>
      </section>

      <h2 className="mb-3 mt-9 text-lg font-extrabold">Your referrals</h2>
      <section className="panel divide-y overflow-hidden">
        {state.referrals.map((r) => (
          <div key={r.id} className="flex items-center gap-3 px-5 py-4">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
              {r.name
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="font-bold">{r.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {r.email} · {formatDate(r.date)}
              </p>
            </div>
            <span
              className={cn(
                "ml-auto rounded-full px-2.5 py-1 text-xs font-bold capitalize",
                r.status === "joined" ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground",
              )}
            >
              {r.status}
            </span>
            <p className="w-14 text-right font-extrabold">${r.reward}</p>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
