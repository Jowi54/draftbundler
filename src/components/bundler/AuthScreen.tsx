import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function BrandMark() {
  return (
    <Link to="/" className="inline-flex items-center gap-2.5" aria-label="Bundler home">
      <span className="flex size-8 items-center justify-center rounded-lg bg-foreground">
        <span className="size-3 rounded-[3px] bg-background" />
      </span>
      <span className="font-display text-[22px] font-semibold">Bundler</span>
    </Link>
  );
}

export function AuthScreen({ mode }: { mode: "signin" | "signup" | "reset" | "password" | "plans" }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [sent, setSent] = useState(false);
  const [annual, setAnnual] = useState(true);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === "reset") {
      setSent(true);
      return;
    }
    if (mode === "signup") navigate({ to: "/choose-plan" });
    else {
      toast.success(mode === "password" ? "Password saved" : "Welcome back");
      navigate({ to: "/" });
    }
  };

  if (mode === "plans") {
    return (
      <AuthFrame>
        <div className="mx-auto w-full max-w-[760px]">
          <p className="text-sm font-semibold text-primary">STEP 2 OF 2</p>
          <h1 className="mt-3 font-display text-[32px] font-semibold leading-10">Choose your Bundler plan</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">One payment. Eight premium streaming services. Cancel anytime.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[{ annual: false, name: "Monthly", price: "$29", cadence: "/ month" }, { annual: true, name: "Annual", price: "$168", cadence: "/ year" }].map((plan) => (
              <button key={plan.name} type="button" onClick={() => setAnnual(plan.annual)} className={cn("relative rounded-lg border bg-surface p-6 text-left transition-colors", annual === plan.annual ? "border-primary ring-2 ring-primary/15" : "border-border hover:border-muted-foreground")}>
                {plan.annual && <span className="absolute right-4 top-4 rounded-full bg-mint px-3 py-1 text-xs font-semibold text-mint-foreground">Save $180</span>}
                <p className="text-lg font-semibold">{plan.name}</p>
                <p className="mt-5 font-display text-4xl font-semibold">{plan.price}<span className="font-sans text-sm font-medium text-muted-foreground"> {plan.cadence}</span></p>
                <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                  {["8 premium streaming services", "Instant sign-in details and OTPs", "Dedicated household profiles"].map((feature) => <p key={feature} className="flex items-center gap-2"><Check className="size-4 text-success" />{feature}</p>)}
                </div>
              </button>
            ))}
          </div>
          <Button className="mt-6 w-full" onClick={() => { toast.success("Plan selected"); navigate({ to: "/" }); }}>Continue with {annual ? "Annual" : "Monthly"}</Button>
        </div>
      </AuthFrame>
    );
  }

  const copy = {
    signin: ["Sign in to Bundler", "Sign in with your email address and password"],
    signup: ["Create an account", "Enter your details to get started with Bundler"],
    reset: [sent ? "Check your email" : "Reset your password", sent ? "We sent a password reset link to your email address." : "Enter your email address and we’ll send you a reset link."],
    password: ["Create a new password", "Choose a secure password for your Bundler account"],
  }[mode];

  return (
    <AuthFrame>
      <div className="w-full max-w-[440px]">
        {(mode === "reset" || mode === "password") && <Link to="/sign-in" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Back to sign in</Link>}
        <h1 className="font-display text-[32px] font-semibold leading-10">{copy[0]}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy[1]}</p>
        {sent ? <Button asChild className="mt-8 w-full"><Link to="/sign-in">Return to sign in</Link></Button> : (
          <form className="mt-8 space-y-5" onSubmit={submit}>
            {mode !== "password" && mode !== "reset" && <Button type="button" variant="outline" className="w-full bg-surface"><span className="text-lg font-bold text-primary">G</span> Sign {mode === "signup" ? "up" : "in"} with Google</Button>}
            {mode !== "password" && mode !== "reset" && <div className="flex items-center gap-4 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>}
            {mode === "signup" && <Field label="Full name" id="name" placeholder="Segun Okafor" />}
            {mode !== "password" && <Field label="Email address" id="email" type="email" placeholder="email@gmail.com" />}
            {mode !== "reset" && <div><div className="flex items-center justify-between"><Label htmlFor="password">Password</Label>{mode === "signin" && <Link to="/forgot-password" className="text-xs font-semibold text-primary">Forgot password?</Link>}</div><div className="relative mt-2"><Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required className="pr-11" /><Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 size-10" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff /> : <Eye />}</Button></div></div>}
            {mode === "signup" && <Field label="Confirm password" id="confirm-password" type="password" placeholder="••••••••" />}
            <Button className="w-full" type="submit">{mode === "signin" ? "Login" : mode === "signup" ? "Create account" : mode === "reset" ? "Send reset link" : "Save password"}</Button>
          </form>
        )}
        {(mode === "signin" || mode === "signup") && <p className="mt-6 text-center text-sm text-muted-foreground">{mode === "signin" ? "Not registered yet? " : "Already have an account? "}<Link to={mode === "signin" ? "/create-account" : "/sign-in"} className="font-semibold text-primary">{mode === "signin" ? "Create an account" : "Sign in"}</Link></p>}
      </div>
    </AuthFrame>
  );
}

function Field({ label, id, type = "text", placeholder }: { label: string; id: string; type?: string; placeholder: string }) {
  return <div><Label htmlFor={id}>{label}</Label><Input className="mt-2" id={id} type={type} placeholder={placeholder} required /></div>;
}

function AuthFrame({ children }: { children: ReactNode }) {
  return <main className="min-h-screen bg-surface"><header className="mx-auto flex h-20 max-w-[1240px] items-center border-b border-border px-6 lg:px-10"><BrandMark /></header><div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-background px-6 py-14">{children}</div></main>;
}