import { createFileRoute } from "@tanstack/react-router";
import { Check, CreditCard, Gem, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AppShell, PageHeading } from "@/components/bundler/AppShell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PLAN_PRICES, formatDate, useBundler, type PlanId } from "@/lib/bundler-store";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  upgrade: z.boolean().optional(),
  methods: z.boolean().optional(),
});

export const Route = createFileRoute("/subscription")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Manage Subscription — Bundler" },
      {
        name: "description",
        content:
          "Switch between the Bundler monthly and annual plans, renew in advance, manage auto-renew and your saved payment methods.",
      },
      { property: "og:title", content: "Manage Subscription — Bundler" },
      {
        property: "og:description",
        content: "Change plan, renew early and manage payment methods for your Bundler account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SubscriptionPage,
});

const planFeatures = [
  "8 premium streaming services",
  "Instant OTP generation",
  "Dedicated household profiles",
  "24/7 human support",
];

function SubscriptionPage() {
  const search = Route.useSearch();
  const { state, daysLeft, renew, switchPlan, update, addPaymentMethod, removePaymentMethod, makePrimary } =
    useBundler();
  const [confirm, setConfirm] = useState<PlanId | null>(search.upgrade ? "annual" : null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ number: "", expiry: "", cvc: "", brand: "Visa" });

  return (
    <AppShell>
      <PageHeading
        title="Manage Subscription"
        subtitle="Your plan, renewal date and billing details."
      />

      <section className="panel p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Gem className="size-5" />
            </span>
            <div>
              <p className="text-lg font-extrabold">{PLAN_PRICES[state.plan].label}</p>
              <p className="text-sm text-muted-foreground">
                ${PLAN_PRICES[state.plan].price} / {PLAN_PRICES[state.plan].cadence} · renews{" "}
                {formatDate(state.renewsAt)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                renew();
                toast.success("Plan renewed", { description: "Your expiry date was extended." });
              }}
            >
              Renew in Advance
            </Button>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-xl bg-secondary px-4 py-3">
          <div>
            <p className="text-sm font-bold">Auto-renew</p>
            <p className="text-xs text-muted-foreground">
              {state.autoRenew
                ? `We'll charge your primary card in ${daysLeft} days.`
                : "Your plan will lapse at the end of the term."}
            </p>
          </div>
          <Switch
            checked={state.autoRenew}
            onCheckedChange={(v) => {
              update({ autoRenew: v });
              toast(v ? "Auto-renew on" : "Auto-renew off");
            }}
          />
        </div>
      </section>

      <h2 className="mb-3 mt-9 text-lg font-extrabold">Choose your plan</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {(Object.keys(PLAN_PRICES) as PlanId[]).map((id) => {
          const p = PLAN_PRICES[id];
          const active = state.plan === id;
          return (
            <div
              key={id}
              className={cn(
                "panel relative p-6",
                active ? "ring-2 ring-primary" : "ring-1 ring-border",
              )}
            >
              {id === "annual" && (
                <span className="absolute right-5 top-5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-bold text-success">
                  Save $180
                </span>
              )}
              <p className="font-extrabold">{p.label}</p>
              <p className="mt-2 text-3xl font-extrabold">
                ${p.price}
                <span className="text-sm font-semibold text-muted-foreground">/{p.cadence}</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {planFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="size-4 text-success" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-5 w-full"
                variant={active ? "secondary" : "default"}
                disabled={active}
                onClick={() => setConfirm(id)}
              >
                {active ? "Current plan" : id === "annual" ? "Upgrade to Annual" : "Switch to Monthly"}
              </Button>
            </div>
          );
        })}
      </div>

      <h2 className="mb-3 mt-9 text-lg font-extrabold" id="methods">
        Payment methods
      </h2>
      <section className={cn("panel divide-y overflow-hidden", search.methods && "ring-2 ring-primary")}>
        {state.methods.map((m) => (
          <div key={m.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
            <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <CreditCard className="size-5" />
            </span>
            <div>
              <p className="font-bold">
                {m.brand} •••• {m.last4}
              </p>
              <p className="text-xs text-muted-foreground">Expires {m.expiry}</p>
            </div>
            {m.primary && (
              <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-bold text-success">
                Primary
              </span>
            )}
            <div className="ml-auto flex gap-2">
              {!m.primary && (
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => makePrimary(m.id)}>
                  <Star className="size-4" /> Make primary
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Remove card"
                onClick={() => {
                  removePaymentMethod(m.id);
                  toast("Card removed");
                }}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        <button
          onClick={() => setAddOpen(true)}
          className="flex w-full items-center gap-3 px-5 py-4 text-sm font-bold text-primary transition-colors hover:bg-secondary/60"
        >
          <Plus className="size-4" /> Add a new payment method
        </button>
      </section>

      <Dialog open={confirm !== null} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirm === "annual" ? "Upgrade to Annual Plan" : "Switch to Monthly Plan"}
            </DialogTitle>
            <DialogDescription>
              {confirm &&
                `You'll be charged $${PLAN_PRICES[confirm].price} today and your renewal date moves to ${
                  confirm === "annual" ? "12 months" : "30 days"
                } from now.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (confirm) {
                  switchPlan(confirm);
                  toast.success(`${PLAN_PRICES[confirm].label} activated`);
                }
                setConfirm(null);
              }}
            >
              Confirm and pay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add payment method</DialogTitle>
            <DialogDescription>Cards are stored securely and can be removed anytime.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="card">Card number</Label>
              <Input
                id="card"
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                value={form.number}
                onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="exp">Expiry</Label>
                <Input
                  id="exp"
                  placeholder="09/29"
                  value={form.expiry}
                  onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  value={form.cvc}
                  onChange={(e) => setForm((f) => ({ ...f, cvc: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const digits = form.number.replace(/\D/g, "");
                if (digits.length < 12 || !/^\d{2}\/\d{2}$/.test(form.expiry) || form.cvc.length < 3) {
                  toast.error("Check the card details", {
                    description: "Enter a full card number, MM/YY expiry and CVC.",
                  });
                  return;
                }
                addPaymentMethod({
                  brand: digits.startsWith("4") ? "Visa" : "Mastercard",
                  last4: digits.slice(-4),
                  expiry: form.expiry,
                  primary: state.methods.length === 0,
                });
                setForm({ number: "", expiry: "", cvc: "", brand: "Visa" });
                setAddOpen(false);
                toast.success("Card added");
              }}
            >
              Save card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
