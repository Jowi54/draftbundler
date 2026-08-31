import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell, PageHeading } from "@/components/bundler/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useBundler } from "@/lib/bundler-store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Bundler" },
      {
        name: "description",
        content:
          "Update your Bundler profile, notification preferences, appearance and account security settings.",
      },
      { property: "og:title", content: "Settings — Bundler" },
      {
        property: "og:description",
        content: "Profile, notifications, appearance and security for your Bundler account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { state, updateSettings, reset } = useBundler();
  const [profile, setProfile] = useState({
    fullName: state.settings.fullName,
    email: state.settings.email,
    phone: state.settings.phone,
    country: state.settings.country,
  });

  const toggles = [
    {
      key: "emailNotifications" as const,
      title: "Email notifications",
      body: "Receipts, renewals and account alerts.",
    },
    {
      key: "productUpdates" as const,
      title: "Product updates",
      body: "New services added to the bundle and feature news.",
    },
    {
      key: "expiryReminders" as const,
      title: "Expiry reminders",
      body: "Get nudged 7 and 2 days before your plan expires.",
    },
    {
      key: "twoFactor" as const,
      title: "Two-factor authentication",
      body: "Require a code from your phone when signing in.",
    },
  ];

  return (
    <AppShell>
      <PageHeading title="Settings" subtitle="Manage your profile, alerts and security." />

      <section className="panel p-6">
        <h2 className="text-base font-extrabold">Profile</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={profile.fullName}
              onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={profile.country}
              onChange={(e) => setProfile((p) => ({ ...p, country: e.target.value }))}
            />
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <Button
            onClick={() => {
              if (!profile.fullName.trim() || !/^\S+@\S+\.\S+$/.test(profile.email)) {
                toast.error("Check your details", {
                  description: "A name and a valid email are required.",
                });
                return;
              }
              updateSettings(profile);
              toast.success("Profile updated");
            }}
          >
            Save changes
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setProfile({
                fullName: state.settings.fullName,
                email: state.settings.email,
                phone: state.settings.phone,
                country: state.settings.country,
              })
            }
          >
            Discard
          </Button>
        </div>
      </section>

      <section className="panel mt-6 divide-y overflow-hidden">
        {toggles.map((t) => (
          <div key={t.key} className="flex items-center gap-4 px-6 py-4">
            <div>
              <p className="font-bold">{t.title}</p>
              <p className="text-sm text-muted-foreground">{t.body}</p>
            </div>
            <Switch
              className="ml-auto"
              checked={state.settings[t.key]}
              onCheckedChange={(v) => {
                updateSettings({ [t.key]: v });
                toast(`${t.title} ${v ? "enabled" : "disabled"}`);
              }}
            />
          </div>
        ))}
        <div className="flex items-center gap-4 px-6 py-4">
          <div>
            <p className="font-bold">Dark appearance</p>
            <p className="text-sm text-muted-foreground">Easier on the eyes at night.</p>
          </div>
          <Switch
            className="ml-auto"
            checked={state.settings.theme === "dark"}
            onCheckedChange={(v) => updateSettings({ theme: v ? "dark" : "light" })}
          />
        </div>
      </section>

      <section className="panel mt-6 p-6">
        <h2 className="text-base font-extrabold text-destructive">Danger zone</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Reset this dashboard back to its original demo data.
        </p>
        <Button
          variant="outline"
          className="mt-4 border-destructive text-destructive"
          onClick={() => {
            reset();
            toast("Dashboard reset");
          }}
        >
          Reset account data
        </Button>
      </section>
    </AppShell>
  );
}
