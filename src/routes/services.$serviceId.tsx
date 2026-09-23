import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronDown, Copy, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/bundler/AppShell";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useBundler, type Service, type ServiceId } from "@/lib/bundler-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services/$serviceId")({
  head: ({ params }) => {
    const name = params.serviceId.replace(/-/g, " ");
    return {
      meta: [
        { title: `${name} sign-in details — Bundler` },
        { name: "description", content: `Access your ${name} sign-in details through Bundler.` },
        { property: "og:title", content: `${name} sign-in details — Bundler` },
        { property: "og:description", content: `Access your ${name} sign-in details through Bundler.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ServicePage,
});

function PageTitle() {
  return (
    <div className="flex items-center gap-5">
      <Button asChild variant="ghost" size="icon" className="-ml-2 size-7" aria-label="Back to home">
        <Link to="/"><ArrowLeft className="size-5" /></Link>
      </Button>
      <h1 className="font-display text-[22px] font-semibold leading-none lg:text-[26px]">Get Sign-in Details</h1>
    </div>
  );
}

async function copyValue(value: string, label: string) {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  } catch {
    toast.error("Copy failed", { description: "Your browser blocked clipboard access." });
  }
}

function LoginDetails({ service }: { service: Service }) {
  return (
    <section className="overflow-hidden rounded-lg bg-surface">
      <h2 className="px-6 pb-5 pt-7 font-display text-base font-semibold lg:px-9 lg:pb-6 lg:pt-9 lg:text-lg">Your login details</h2>
      <div className="border-t border-border px-6 lg:px-9">
        <div className="grid gap-2 border-b border-border py-5 sm:grid-cols-[120px_1fr] sm:items-center">
          <p className="text-base text-muted-foreground">Username</p>
          <div className="flex min-w-0 items-center gap-4">
            <p className="min-w-0 flex-1 truncate text-base text-service-detail">{service.email}</p>
            <Button variant="link" className="h-auto shrink-0 px-0 text-base font-normal" onClick={() => copyValue(service.email, "Username")}>Copy</Button>
          </div>
        </div>
        <div className="grid gap-2 py-5 sm:grid-cols-[120px_1fr] sm:items-center">
          <p className="text-base text-muted-foreground">Password</p>
          <div className="flex min-w-0 items-center gap-4">
            <p className="min-w-0 flex-1 truncate text-base text-service-detail">{service.password}</p>
            <Button variant="link" className="h-auto shrink-0 px-0 text-base font-normal" onClick={() => copyValue(service.password, "Password")}>Copy</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const netflixTravelSteps = [
  <>Click on <strong>“I'm Traveling” / “Watch Temporarily”</strong> to obtain a verification link here.</>,
  <>Click the <strong>“Send Email”</strong> button on device, and Bundler will collect the email for you.</>,
  <>Come back to this page and click the <strong>“Get Login Verification Link”</strong> button to obtain the verification link. Link may take up to 4 minutes.</>,
  <>Click <strong>“Open link to view verification code”</strong> after successfully obtaining the verification link.</>,
  <>Enter verification code into your TV or device to continue enjoying Netflix!</>,
  <>Repeat the whole steps in few minutes or <Link to="/support" className="text-primary">“speak to support”</Link> if the link is yet to be obtained.</>,
];

const netflixHouseholdSteps = [
  <>Click <strong>“Update My Netflix Household”</strong> to obtain a verification link.</>,
  <>Click the <strong>“Send Email”</strong> button on device, and Bundler will collect the email for you.</>,
  <>Come back to this page and click the <strong>“Get Login Verification Link”</strong> button to obtain the verification link. Link may take up to 4 minutes.</>,
  <>Click <strong>“Open link to view verification code”</strong> after successfully obtaining the verification link.</>,
  <>Click <strong>“Update your Netflix household”</strong> on the webpage.</>,
  <>Repeat the whole steps in few minutes or <Link to="/support" className="text-primary">“speak to support”</Link> if the link is yet to be obtained.</>,
];

function NetflixVerification() {
  const [openSection, setOpenSection] = useState<"travel" | "household" | null>(null);
  const [requestState, setRequestState] = useState<"idle" | "loading" | "ready">("idle");
  const steps = openSection === "travel" ? netflixTravelSteps : netflixHouseholdSteps;

  function requestLink() {
    setRequestState("loading");
    window.setTimeout(() => setRequestState("ready"), 1100);
  }

  return (
    <section className="rounded-lg bg-surface p-6 lg:p-9">
      <h2 className="font-display text-base font-semibold lg:text-lg">Get Login Verification Link</h2>
      <p className="mt-7 max-w-[709px] text-sm leading-6 text-muted-foreground">
        You may encounter the message <strong className="font-medium text-foreground">“This TV/device is not part of the household”</strong> upon login to your Netflix account, don’t worry, follow these steps to regain access through the verification link:
      </p>

      <div className="mt-6 border-y border-border">
        <Button variant="ghost" className="h-auto w-full justify-between whitespace-normal rounded-none px-0 py-5 text-left text-sm font-medium lg:text-base" onClick={() => setOpenSection(openSection === "travel" ? null : "travel")}>
          <span>My TV/Device have ‘I'm Traveling’ or ‘Watch Temporarily’</span>
          <ChevronDown className={cn("size-5 shrink-0 transition-transform", openSection === "travel" && "rotate-180 text-primary")} />
        </Button>
        {openSection === "travel" && <NetflixSteps intro="If your Netflix login verification screen have 'I'm Traveling' or 'Watch Temporarily', kindly follow these steps to regain access:" steps={steps} requestState={requestState} onRequest={requestLink} />}
      </div>

      <div className="border-b border-border">
        <Button variant="ghost" className="h-auto w-full justify-between whitespace-normal rounded-none px-0 py-5 text-left text-sm font-medium lg:text-base" onClick={() => setOpenSection(openSection === "household" ? null : "household")}>
          <span>My TV/device doesn’t have 'I'm Traveling' or 'Watch Temporarily'</span>
          <ChevronDown className={cn("size-5 shrink-0 transition-transform", openSection === "household" && "rotate-180 text-primary")} />
        </Button>
        {openSection === "household" && <NetflixSteps intro="If your Netflix login verification screen does not have 'I'm Traveling' or 'Watch Temporarily', kindly follow these steps to regain access:" steps={steps} requestState={requestState} onRequest={requestLink} />}
      </div>
    </section>
  );
}

function NetflixSteps({ intro, steps, requestState, onRequest }: { intro: string; steps: React.ReactNode[]; requestState: "idle" | "loading" | "ready"; onRequest: () => void }) {
  return (
    <div className="border-t border-border pb-7 pl-6 pt-5 lg:pl-[42px]">
      <p className="max-w-[709px] text-sm leading-6 text-muted-foreground">{intro}</p>
      <ol className="mt-6 space-y-5">
        {steps.map((step, index) => <li key={index}><p className="text-base font-medium text-primary">Step {index + 1}:</p><p className="mt-2 max-w-[690px] text-sm leading-6 text-muted-foreground">{step}</p></li>)}
      </ol>
      <Button className="mt-7 h-14 w-full text-base" disabled={requestState === "loading"} onClick={onRequest}>
        {requestState === "loading" && <LoaderCircle className="animate-spin" />}
        {requestState === "loading" ? "Requesting link, kindly wait..." : requestState === "ready" ? "Open the link to view the verification code" : "Get Login Verification Link"}
      </Button>
      {requestState === "ready" && <div className="mt-5 flex items-center gap-4"><a href="https://www.netflix.com/account/travel" target="_blank" rel="noreferrer" className="truncate text-sm text-primary">www.netflix.com/account/travel...</a><Button variant="link" className="h-auto px-0 text-base font-normal" onClick={() => copyValue("https://www.netflix.com/account/travel", "Link")}>Copy</Button></div>}
    </div>
  );
}

function OtpRequest({ service }: { service: Service }) {
  const { state, generateOtp } = useBundler();
  const [channel, setChannel] = useState("email");
  const [loading, setLoading] = useState(false);
  const otp = state.otps[service.id];

  function requestCode() {
    if (channel === "phone") {
      toast.info("Contact Support to get OTP from Phone No.");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      generateOtp(service.id);
      setLoading(false);
    }, 900);
  }

  return (
    <section className="rounded-lg bg-surface p-6 lg:p-9">
      <h2 className="font-display text-base font-semibold lg:text-lg">Request OTP</h2>
      <RadioGroup value={channel} onValueChange={setChannel} className="mt-6 gap-5">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground"><RadioGroupItem value="email" />Request OTP from Email Address</label>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground"><RadioGroupItem value="phone" />Request OTP from Phone Number</label>
      </RadioGroup>
      <Button className="mt-8 h-14 w-full text-base" onClick={requestCode} disabled={loading}>
        {loading && <LoaderCircle className="animate-spin" />}
        {loading ? "Requesting code, kindly wait..." : channel === "phone" ? "Contact Support to get OTP from Phone No." : "Send Request"}
      </Button>
      {otp && <div className="mt-5 flex items-center gap-5"><span className="font-display text-xl font-semibold">{otp.code}</span><Button variant="link" className="h-auto px-0 text-base font-normal" onClick={() => copyValue(otp.code, "OTP")}>Copy</Button></div>}
    </section>
  );
}

function FamilyFlow({ service }: { service: Service }) {
  const youtube = service.id === "youtube-premium";
  const [step, setStep] = useState<"choice" | "new" | "current" | "sent" | "details">("choice");
  const [lastForm, setLastForm] = useState<"new" | "current">("new");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [learnOpen, setLearnOpen] = useState(false);

  const choiceTitle = youtube ? "Request to be added to YouTube family plan" : "Request to be added to the family plan";

  if (step === "details") return <div className="space-y-6"><LoginDetails service={service} /></div>;

  return (
    <>
      {step === "choice" && <section>
        <h2 className="font-display text-base font-semibold lg:text-xl">{choiceTitle}</h2>
        <p className="mt-3 max-w-[620px] text-sm leading-[22px] text-muted-foreground">Kindly choose an option to submit your details to be added to the family plan.</p>
        <Button variant="link" className="h-auto px-0 py-0 text-sm font-normal" onClick={() => setLearnOpen(true)}>Learn more</Button>
        <div className="mt-8 grid max-w-[613px] gap-5 sm:grid-cols-2">
          <FamilyChoice number="01" onClick={() => { setLastForm("new"); setStep("new"); }}>{youtube ? "Submit a new gmail address details" : "Submit a new email not registered with Spotify"}</FamilyChoice>
          <FamilyChoice number="02" onClick={() => { setLastForm("current"); setStep("current"); }}>Submit login details to your current {youtube ? "gmail" : "Spotify"} account</FamilyChoice>
        </div>
        <p className="mt-8 text-sm leading-[22px] text-muted-foreground lg:ml-[42px]">Not sure of what option to choose? <Link to="/support" className="text-primary">Speak to Support</Link></p>
      </section>}

      {(step === "new" || step === "current") && <form onSubmit={(event) => { event.preventDefault(); setStep("sent"); }}>
        <h2 className="font-display text-base font-semibold lg:text-xl">{step === "new" ? "Submit New Login Details" : youtube ? "Submit current Login Details" : "Submit current Spotify login details"}</h2>
        <p className="mt-3 max-w-[650px] text-sm leading-[22px] text-muted-foreground">{step === "new" ? youtube ? "Kindly submit a new google email address. We will add the gmail to the YouTube family plan." : "Kindly submit a new email address that is not registered on Spotify. We will add the email to the Spotify plan and send your login details via email." : `Kindly submit your current ${youtube ? "YouTube" : "Spotify"} login details to be added to the family plan`}</p>
        <div className="mt-8 max-w-[650px] space-y-5">
          <div><Label htmlFor="family-email" className="text-sm font-normal text-muted-foreground">{step === "new" ? "New Email Address" : "Email Address"}</Label><Input id="family-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-14 bg-surface px-5 text-base" /></div>
          <div><Label htmlFor="family-password" className="text-sm font-normal text-muted-foreground">{step === "new" ? "Preferred Password" : "Password"}</Label><Input id="family-password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-14 bg-surface px-5 text-base" /></div>
          <Button type="submit" className="h-14 w-full text-base">Submit</Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground lg:ml-[42px]">Encounter any issue? <Link to="/support" className="text-primary">Speak to Support</Link></p>
      </form>}

      {step === "sent" && <section>
        <h2 className="font-display text-base font-semibold lg:text-xl">Request Sent</h2>
        <p className="mt-3 max-w-[739px] text-sm leading-[22px] text-muted-foreground">You have submitted your details successfully. You will be added to the family plan soon and you will get a confirmation email.</p>
        <div className="mt-8 grid max-w-[420px] gap-4 sm:grid-cols-2"><Button className="h-14 text-base" onClick={() => setStep("details")}>Okay</Button><Button variant="outline" className="h-14 text-base" onClick={() => setStep(lastForm)}>Change details</Button></div>
      </section>}

      <Dialog open={learnOpen} onOpenChange={setLearnOpen}>
        <DialogContent className="max-w-[612px] gap-0 p-10 sm:p-14">
          <DialogHeader><DialogTitle className="font-display text-xl">Why We Need Your {youtube ? "Google" : "Spotify"} Login Details</DialogTitle></DialogHeader>
          <DialogDescription asChild><div className="mt-5 space-y-4 text-sm leading-[22px] text-foreground">{youtube ? <><p>To provide you with seamless access to YouTube as part of your Bundler subscription, we need to add your Google email to the YouTube family plan.</p><p>This ensures you enjoy uninterrupted access to premium content without needing separate subscriptions.</p><p>You can either:<br />Provide your current Google email and password for us to connect or<br />Share a new Google email that we can add to the family plan.</p><p>Rest assured, your details are handled with the utmost care and privacy, and are only used for setting up your access.</p></> : <><p>To give you premium access to Spotify as part of your Bundler subscription, we need to add your Spotify account to the Spotify family plan. This guarantees your access to ad-free music and premium features without extra fees.</p><p>You can either:<br />Provide your current Spotify login details.<br />Share new login details that we can use to add you to the family plan.</p><p>Your account information will be securely handled and used solely to activate your premium access.</p></>}</div></DialogDescription>
          <DialogFooter className="mt-8"><Button className="h-14 w-full text-base" onClick={() => setLearnOpen(false)}>Okay</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function FamilyChoice({ number, children, onClick }: { number: string; children: React.ReactNode; onClick: () => void }) {
  return <Button variant="outline" onClick={onClick} className="h-[152px] items-start justify-start whitespace-normal rounded-lg bg-surface p-5 text-left font-normal shadow-none"><span className="flex h-full flex-col items-start"><span className="flex size-8 items-center justify-center rounded-full bg-secondary text-sm font-medium text-foreground">{number}</span><span className="mt-3 max-w-[215px] text-sm leading-[22px] text-muted-foreground">{children}</span></span></Button>;
}

function ServicePage() {
  const { serviceId } = Route.useParams();
  const { state } = useBundler();
  const service = state.services.find((item) => item.id === (serviceId as ServiceId));

  if (!service) return <AppShell><div className="rounded-lg bg-surface p-8 text-center"><h1 className="font-display text-2xl font-semibold">Service not found</h1><Button asChild className="mt-6"><Link to="/">Return home</Link></Button></div></AppShell>;

  const familyService = service.id === "spotify" || service.id === "youtube-premium";
  return (
    <AppShell>
      <div className="space-y-8">
        <PageTitle />
        <div className="space-y-6">
          {familyService ? <FamilyFlow service={service} /> : <><LoginDetails service={service} />{service.id === "netflix" ? <NetflixVerification /> : <OtpRequest service={service} />}</>}
        </div>
      </div>
    </AppShell>
  );
}