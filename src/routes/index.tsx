import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  CreditCard,
  Gem,
  Headphones,
  Receipt,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";

import referImage from "@/assets/refer-friends.jpg";
import { AppShell } from "@/components/bundler/AppShell";
import { ServiceLogo } from "@/components/bundler/ServiceLogo";
import { Button } from "@/components/ui/button";
import { PLAN_PRICES, formatMonthYear, useBundler } from "@/lib/bundler-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bundler Dashboard — Your streaming bundle in one place" },
      {
        name: "description",
        content:
          "Manage your Bundler subscription, grab sign-in details and OTPs for Netflix, Prime Video, Disney+, Hulu and more.",
      },
      { property: "og:title", content: "Bundler Dashboard" },
      {
        property: "og:description",
        content: "One subscription, eight streaming services. Sign-in details and OTPs on demand.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const slides = [
  {
    title: "Refer your friends and earn $10",
    body: "Refer friends to Bundler and earn $10 when they successfully subscribe. Join our Referral program today!",
    cta: "Refer Now",
    to: "/refer" as const,
  },
  {
    title: "Save $180 on the Annual Plan",
    body: "Switch to annual billing and lock in every service for a full year at a lower rate.",
    cta: "Upgrade Now",
    to: "/subscription" as const,
  },
  {
    title: "Never miss a renewal",
    body: "Turn on auto-renew and expiry reminders so your household keeps streaming without gaps.",
    cta: "Open Settings",
    to: "/settings" as const,
  },
  {
    title: "Get OTPs in seconds",
    body: "Generate one-time codes for every service straight from your dashboard.",
    cta: "See services",
    to: "/" as const,
  },
  {
    title: "Install the Bundler app",
    body: "Add Bundler to your home screen for instant access to sign-in details on the go.",
    cta: "Learn more",
    to: "/support" as const,
  },
];

function Banner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[index]!;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-mint">
      <div className="relative z-10 max-w-lg px-6 py-7 sm:px-8">
        <h2 className="text-xl font-extrabold text-mint-foreground sm:text-[1.4rem]">
          {slide.title.replace("$10", "")}
          {slide.title.includes("$10") && <span className="text-success">$10</span>}
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-mint-foreground/80">
          {slide.body}
        </p>
        <Button asChild variant="secondary" className="mt-4 gap-2 bg-surface hover:bg-surface/90">
          <Link to={slide.to}>
            {slide.cta} <ArrowRight className="size-4" />
          </Link>
        </Button>

        <div className="mt-5 flex items-center gap-3">
          <button
            aria-label="Previous slide"
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            className="rounded-full p-1 text-mint-foreground/70 hover:bg-surface/50"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="flex gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.title}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "size-2 rounded-full transition-colors",
                  i === index ? "bg-mint-foreground" : "bg-mint-foreground/30",
                )}
              />
            ))}
          </div>
          <button
            aria-label="Next slide"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            className="rounded-full p-1 text-mint-foreground/70 hover:bg-surface/50"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <img
        src={referImage}
        alt="Two friends sharing a Bundler referral link on their phones"
        width={992}
        height={672}
        className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[38%] object-cover object-left mix-blend-multiply lg:block"
      />
    </section>
  );
}

function Dashboard() {
  const { state, displayName, daysLeft, renew } = useBundler();
  const navigate = useNavigate();
  const plan = PLAN_PRICES[state.plan];

  const quickActions = [
    state.plan === "monthly"
      ? {
          icon: Gem,
          label: "Upgrade to Annual Plan",
          hint: "(Save $180)",
          onClick: () => navigate({ to: "/subscription", search: { upgrade: true } }),
        }
      : {
          icon: Gem,
          label: "Manage your Annual Plan",
          hint: "",
          onClick: () => navigate({ to: "/subscription" }),
        },
    {
      icon: CreditCard,
      label: "Manage Payment Method",
      hint: "",
      onClick: () => navigate({ to: "/subscription", search: { methods: true } }),
    },
    {
      icon: Receipt,
      label: "View Payment History",
      hint: "",
      onClick: () => navigate({ to: "/payments" }),
    },
    {
      icon: Headphones,
      label: "Speak to support",
      hint: "",
      onClick: () => navigate({ to: "/support" }),
    },
  ];

  return (
    <AppShell>
      <h1 className="mb-5 text-3xl font-extrabold tracking-tight lg:text-[2.3rem]">
        Welcome, {displayName}
      </h1>

      <Banner />

      <h2 className="mb-3 mt-9 text-lg font-extrabold">Current Plan</h2>
      <section className="overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-4 bg-navy px-6 py-6">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Gem className="size-5" />
          </span>
          <div>
            <p className="text-lg font-extrabold text-navy-foreground">{plan.label}</p>
            <p className="text-sm text-navy-foreground/70">
              Member since{" "}
              <span className="font-semibold text-primary-foreground">
                {formatMonthYear(state.memberSince)}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 bg-surface px-6 py-4">
          <p className="flex items-center gap-2.5 text-sm font-medium">
            <AlertTriangle className="size-5 text-warning" />
            Your plan will expire in{" "}
            <span className={cn("font-bold", daysLeft <= 30 ? "text-destructive" : "text-success")}>
              {daysLeft} days
            </span>
          </p>
          <Button variant="outline" className="border-primary text-primary" onClick={() => renew()}>
            Renew in Advance
          </Button>
        </div>
      </section>

      <h2 className="mb-3 mt-9 text-lg font-extrabold">Get your sign-In details</h2>
      <section className="panel divide-y overflow-hidden">
        {state.services.map((s) => (
          <Link
            key={s.id}
            to="/services/$serviceId"
            params={{ serviceId: s.id }}
            className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/60"
          >
            <ServiceLogo service={s} />
            <div className="min-w-0">
              <p className="font-bold">{s.name}</p>
              <p className="truncate text-sm text-muted-foreground">{s.tagline}</p>
            </div>
            <ArrowRight className="ml-auto size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
          </Link>
        ))}
      </section>

      <h2 className="mb-3 mt-9 text-lg font-extrabold">Quick Actions</h2>
      <section className="panel divide-y overflow-hidden">
        {quickActions.map((a) => (
          <button
            key={a.label}
            onClick={a.onClick}
            className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-secondary/60"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <a.icon className="size-5" />
            </span>
            <p className="font-bold">
              {a.label} {a.hint && <span className="font-semibold text-primary">{a.hint}</span>}
            </p>
            <ArrowRight className="ml-auto size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
          </button>
        ))}
      </section>
    </AppShell>
  );
}
