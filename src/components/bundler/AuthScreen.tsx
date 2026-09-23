import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Check, Eye, EyeOff, LoaderCircle } from "lucide-react";
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
  const [annual, setAnnual] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (mode === "reset") {
      setSent(true);
      return;
    }
    if (password.length < 8) {
      setError(mode === "signin" ? "Your password is incorrect" : "Password must be at least 8 characters");
      return;
    }
    if (mode === "signup") navigate({ to: "/choose-plan" });
    else {
      toast.success(mode === "password" ? "Password saved" : "Welcome back");
      navigate({ to: "/" });
    }
  };

  if (mode === "plans") {
    const proceed = () => {
      setLoading(true);
      window.setTimeout(() => {
        toast.success("Plan selected");
        navigate({ to: "/" });
      }, 900);
    };
    return (
      <AuthFrame>
        <div className="mx-auto w-full max-w-[546px] text-center">
          <BrandMark />
          <section className="mt-10 rounded-lg bg-surface px-6 py-9 shadow-[var(--shadow-card)] sm:px-[52px] sm:py-[52px]">
            <h1 className="font-display text-[28px] font-semibold">Welcome to Bundler</h1>
            <p className="mt-2 text-sm text-muted-foreground">To get started. Kindly select a plan to subscribe.</p>
            <div className="mt-11 grid gap-5 text-left sm:grid-cols-2">
            {[{ annual: false, name: "Monthly Plan", price: "$30/mo", cadence: "(paid monthly)" }, { annual: true, name: "Yearly Plan", price: "$15/mo", cadence: "(paid yearly)" }].map((plan) => (
              <button key={plan.name} type="button" onClick={() => setAnnual(plan.annual)} className={cn("relative h-[193px] rounded-lg border bg-surface p-4 transition-colors", annual === plan.annual ? "border-primary ring-2 ring-primary/15" : "border-border hover:border-muted-foreground")}> 
                <span className={cn("absolute right-4 top-4 size-5 rounded-full border", annual === plan.annual && "border-[6px] border-primary")} />
                <p className="font-semibold">{plan.name}</p>
                <p className="mt-14 text-center font-display text-2xl font-semibold text-primary">{plan.price}</p>
                {plan.annual && <span className="absolute right-4 top-[104px] rounded-full bg-primary px-2 py-1 text-xs font-semibold text-white">Save 50%</span>}
                <p className="mt-8 text-center text-xs text-muted-foreground">{plan.cadence}</p>
              </button>
            ))}
            </div>
            <Button className="mt-11 w-full" disabled={loading} onClick={proceed}>{loading && <LoaderCircle className="animate-spin" />}{loading ? "Redirecting to Stripe" : "Proceed to Pay"}</Button>
          </section>
          <p className="mt-10 text-xs leading-5 text-muted-foreground">By clicking “Proceed to Pay,” you agree to our Terms of Service and Privacy Policy.<br className="hidden sm:block" /> You will be charged immediately and your subscription will auto-renew unless canceled.</p>
          <p className="mt-5 text-xs text-muted-foreground">Payment is powered by <strong className="text-[#0a2540]">stripe</strong></p>
        </div>
      </AuthFrame>
    );
  }

  const copy = {
    signin: ["Sign in to Bundler", "Sign in with your email address and password"],
    signup: ["Create an account", "Enter your details to get started with Bundler"],
    reset: ["Reset Password", "Enter your email address to reset password"],
    password: ["Reset Password", "Enter your email address to reset password"],
  }[mode];

  return (
    <AuthFrame>
      <div className="w-full max-w-[504px] text-center">
        <BrandMark />
        <section className="mt-10 rounded-lg bg-surface px-6 py-9 text-left shadow-[var(--shadow-card)] sm:px-[52px] sm:py-[52px]">
        <h1 className="text-center font-display text-[28px] font-semibold">{copy[0]}</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">{copy[1]}</p>
        {sent ? <div className="mt-8"><div className="rounded-lg border border-success bg-success/10 p-4"><p className="font-semibold text-success">Reset link sent</p><p className="mt-1 text-sm text-muted-foreground">Please check your email for instructions to reset your password</p></div><Button asChild variant="outline" className="mt-5 w-full"><Link to="/sign-in">Return to log in</Link></Button></div> : (
          <form className="mt-8 space-y-5" onSubmit={submit}>
            {mode !== "password" && mode !== "reset" && <Button type="button" variant="outline" className="w-full bg-surface"><span className="text-lg font-bold text-primary">G</span> Sign {mode === "signup" ? "up" : "in"} with Google</Button>}
            {mode !== "password" && mode !== "reset" && <div className="flex items-center gap-4 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>}
            {mode === "signup" && <Field label="Full name" id="name" placeholder="John Doe" />}
            {mode !== "password" && <Field label="Email address" id="email" type="email" placeholder="email@gmail.com" value={email} onChange={setEmail} />}
            {mode !== "reset" && <div><div className="flex items-center justify-between"><Label htmlFor="password">{mode === "password" ? "New password" : "Password"}</Label>{mode === "signin" && <Link to="/forgot-password" className="text-xs font-semibold text-primary">Forgot password?</Link>}</div><div className="relative mt-2"><Input id="password" type={showPassword ? "text" : "password"} placeholder="********" required className={cn("pr-11", error && "border-destructive")} value={password} onChange={(e) => setPassword(e.target.value)} /><Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 size-10" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff /> : <Eye />}</Button></div>{error && <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive"><AlertCircle className="size-3.5" />{error}</p>}</div>}
            <Button className="w-full" type="submit">{mode === "signin" ? "Login" : mode === "signup" ? "Create an account" : mode === "reset" ? "Send reset link" : "Submit"}</Button>
          </form>
        )}
        {(mode === "signin" || mode === "signup") && <p className="mt-6 text-center text-sm text-muted-foreground">{mode === "signin" ? "Not registered yet? " : "Already have an account? "}<Link to={mode === "signin" ? "/create-account" : "/sign-in"} className="font-semibold text-primary">{mode === "signin" ? "Create an account" : "Sign in"}</Link></p>}
        </section>
      </div>
    </AuthFrame>
  );
}

function Field({ label, id, type = "text", placeholder, value, onChange }: { label: string; id: string; type?: string; placeholder: string; value?: string; onChange?: (value: string) => void }) {
  return <div><Label htmlFor={id}>{label}</Label><Input className="mt-2" id={id} type={type} placeholder={placeholder} required value={value} onChange={onChange ? (e) => onChange(e.target.value) : undefined} /></div>;
}

function AuthFrame({ children }: { children: ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10">{children}</main>;
}