import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Copy, Eye, EyeOff, RefreshCw, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/bundler/AppShell";
import { ServiceLogo } from "@/components/bundler/ServiceLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        <p className="text-xs font-semibold uppercase text-muted-foreground">
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
  const familyService = serviceId === "spotify" || serviceId === "youtube-premium";
  const [familyStep, setFamilyStep] = useState<"choice" | "new" | "current" | "sent" | "details">("choice");
  const [familyEmail, setFamilyEmail] = useState("");
  const [familyPassword, setFamilyPassword] = useState("");

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!service) {
    return (
      <AppShell>
        <div className="panel mx-auto max-w-lg p-8 text-center">
          <h1 className="font-display text-2xl font-semibold">Service not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">This streaming service is not included in your bundle.</p>
          <Button asChild className="mt-6"><Link to="/">Return home</Link></Button>
        </div>
      </AppShell>
    );
  }

  const otp = state.otps[service.id];
  const secondsLeft = otp ? Math.max(0, Math.ceil((otp.expiresAt - now) / 1000)) : 0;
  const otpValid = Boolean(otp) && secondsLeft > 0;

  if (familyService && familyStep !== "details") {
    const youtube = serviceId === "youtube-premium";
    return (
      <AppShell>
        <h1 className="font-display text-[26px] font-semibold">Get Sign-in Details</h1>
        <section className="mt-8 max-w-[700px]">
          {familyStep === "choice" && <>
            <h2 className="font-display text-xl font-semibold">Request to be added to {youtube ? "YouTube " : "the "}family plan</h2>
            <p className="mt-3 text-sm text-muted-foreground">Kindly choose an option to submit your details to be added to the family plan. <button className="font-semibold text-primary">Learn more</button></p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <button onClick={() => setFamilyStep("new")} className="panel group min-h-44 p-6 text-left ring-1 ring-border transition hover:ring-primary"><span className="flex size-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold">01</span><p className="mt-5 text-sm text-muted-foreground">Submit a new {youtube ? "gmail" : "email"} not registered with {youtube ? "YouTube" : "Spotify"}</p><ArrowRight className="ml-auto mt-4 size-5 text-primary" /></button>
              <button onClick={() => setFamilyStep("current")} className="panel group min-h-44 p-6 text-left ring-1 ring-border transition hover:ring-primary"><span className="flex size-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold">02</span><p className="mt-5 text-sm text-muted-foreground">Submit login details to your current {youtube ? "gmail" : "Spotify"} account</p><ArrowRight className="ml-auto mt-4 size-5 text-primary" /></button>
            </div>
            <p className="mt-8 text-sm text-muted-foreground">Not sure of what option to choose? <Link to="/support" className="font-semibold text-primary">Speak to Support</Link></p>
          </>}
          {(familyStep === "new" || familyStep === "current") && <form className="panel p-6 sm:p-10" onSubmit={(e) => { e.preventDefault(); setFamilyStep("sent"); }}>
            <h2 className="font-display text-xl font-semibold">{familyStep === "new" ? "Submit New Login Details" : `Submit current ${youtube ? "YouTube" : "Spotify"} login details`}</h2>
            <p className="mt-2 text-sm text-muted-foreground">Kindly submit {familyStep === "new" ? `a new ${youtube ? "Google" : "email"} address` : "your current login details"} to be added to the family plan.</p>
            <div className="mt-6 space-y-4"><div><Label htmlFor="family-email">{familyStep === "new" ? "New Email Address" : "Email Address"}</Label><Input id="family-email" type="email" required value={familyEmail} onChange={e => setFamilyEmail(e.target.value)} /></div><div><Label htmlFor="family-password">{familyStep === "new" ? "Preferred Password" : "Password"}</Label><Input id="family-password" type="password" required value={familyPassword} onChange={e => setFamilyPassword(e.target.value)} /></div></div>
            <div className="mt-6 flex gap-3"><Button type="button" variant="outline" onClick={() => setFamilyStep("choice")}>Back</Button><Button type="submit">Submit</Button></div>
          </form>}
          {familyStep === "sent" && <div className="panel p-8 text-center sm:p-12"><span className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/15 text-success"><Check /></span><h2 className="mt-5 font-display text-xl font-semibold">Request Sent</h2><p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">You have submitted your details successfully. You will be added to the family plan soon and you will get a confirmation email.</p><div className="mt-6 flex justify-center gap-3"><Button variant="outline" onClick={() => setFamilyStep("current")}>Change Details</Button><Button onClick={() => setFamilyStep("details")}>Okay</Button></div></div>}
        </section>
      </AppShell>
    );
  }

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
          <h1 className="font-display text-[26px] font-semibold leading-9">{service.name}</h1>
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
            <h2 className="font-display text-lg font-semibold">One-time sign-in code</h2>
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
                    className="flex size-12 items-center justify-center rounded-lg bg-secondary text-xl font-semibold"
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
        <h2 className="font-display text-lg font-semibold">House rules</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>• Only use the profile assigned to you — others are reserved for the bundle.</li>
          <li>• Never change the account email, password or payment details.</li>
          <li>• Passwords rotate monthly; come back here for the latest one.</li>
        </ul>
      </section>
    </AppShell>
  );
}
