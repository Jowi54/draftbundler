import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Copy, Eye, EyeOff, RefreshCw, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/bundler/AppShell";
import { ServiceLogo } from "@/components/bundler/ServiceLogo";
import { Button } from "@/components/ui/button";
import { useBundler, type ServiceId } from "@/lib/bundler-store";

export const Route = createFileRoute("/services/$serviceId")({
  head: ({ params }) => {
    const name = params.serviceId.replace(/-/g, " ");
    return {
      meta: [
        { title: `${name} sign-in details — Bundler` },
        {
          name: "description",
          content: `View your shared ${name} email, password, profile and generate a one-time sign-in code.`,
        },
        { property: "og:title", content: `${name} sign-in details — Bundler` },
        {
          property: "og:description",
          content: `Secure ${name} credentials and OTP generation inside your Bundler account.`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ServicePage,
});

function CopyRow({ label, value, secret }: { label: string; value: string; secret?: boolean }) {
  const [shown, setShown] = useState(!secret);
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 truncate font-mono text-sm font-semibold">
          {shown ? value : "•".repeat(Math.min(value.length, 16))}
        </p>
      </div>
      {secret && (
        <Button
          variant="ghost"
          size="icon"
          aria-label={shown ? `Hide ${label}` : `Show ${label}`}
          onClick={() => setShown((s) => !s)}
        >
          {shown ? <EyeOff /> : <Eye />}
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
            toast.success(`${label} copied`);
          } catch {
            toast.error("Copy failed", { description: "Your browser blocked clipboard access." });
          }
        }}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}

function ServicePage() {
  const { serviceId } = Route.useParams();
  const { state, generateOtp } = useBundler();
  const service = state.services.find((s) => s.id === (serviceId as ServiceId));
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!service) throw notFound();

  const otp = state.otps[service.id];
  const secondsLeft = otp ? Math.max(0, Math.ceil((otp.expiresAt - now) / 1000)) : 0;
  const otpValid = Boolean(otp) && secondsLeft > 0;

  return (
    <AppShell>
      <Link
        to="/"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to dashboard
      </Link>

      <div className="mb-6 flex items-center gap-4">
        <ServiceLogo service={service} className="size-14 text-base" />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{service.name}</h1>
          <p className="text-sm text-muted-foreground">{service.tagline}</p>
        </div>
      </div>

      <section className="panel divide-y overflow-hidden">
        <CopyRow label="Email" value={service.email} />
        <CopyRow label="Password" value={service.password} secret />
        <CopyRow label="Profile" value={service.profile} />
        <CopyRow label="Profile PIN" value={service.pin} secret />
      </section>

      {service.supportsOtp && (
        <section className="panel mt-6 p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <h2 className="text-lg font-extrabold">One-time sign-in code</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {service.name} sends a verification code to the shared inbox. Generate it here — codes
            expire after 2 minutes.
          </p>

          {otpValid ? (
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="flex gap-2">
                {otp!.code.split("").map((d, i) => (
                  <span
                    key={i}
                    className="flex size-12 items-center justify-center rounded-lg bg-secondary text-xl font-extrabold"
                  >
                    {d}
                  </span>
                ))}
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                Expires in {String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:
                {String(secondsLeft % 60).padStart(2, "0")}
              </p>
              <Button
                variant="outline"
                className="gap-2"
                onClick={async () => {
                  await navigator.clipboard.writeText(otp!.code).catch(() => {});
                  toast.success("Code copied");
                }}
              >
                <Copy className="size-4" /> Copy code
              </Button>
            </div>
          ) : (
            <Button
              className="mt-5 gap-2"
              onClick={() => {
                generateOtp(service.id);
                toast.success(`New ${service.name} code generated`);
              }}
            >
              <RefreshCw className="size-4" />
              {otp ? "Generate a new code" : "Generate OTP"}
            </Button>
          )}
        </section>
      )}

      <section className="panel mt-6 p-6">
        <h2 className="text-base font-extrabold">House rules</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>• Only use the profile assigned to you — others are reserved for the bundle.</li>
          <li>• Never change the account email, password or payment details.</li>
          <li>• Passwords rotate monthly; come back here for the latest one.</li>
        </ul>
      </section>
    </AppShell>
  );
}
