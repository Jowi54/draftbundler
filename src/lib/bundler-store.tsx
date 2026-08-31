import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ServiceId =
  | "netflix"
  | "prime-video"
  | "disney-plus"
  | "espn"
  | "hulu"
  | "hbo-max"
  | "spotify"
  | "youtube-premium";

export type Service = {
  id: ServiceId;
  name: string;
  short: string;
  tagline: string;
  bg: string;
  fg: string;
  email: string;
  password: string;
  profile: string;
  pin: string;
  supportsOtp: boolean;
};

export type Payment = {
  id: string;
  date: string;
  description: string;
  amount: number;
  method: string;
  status: "paid" | "pending" | "failed";
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
};

export type Referral = {
  id: string;
  name: string;
  email: string;
  status: "joined" | "invited";
  reward: number;
  date: string;
};

export type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  primary: boolean;
};

export type PlanId = "monthly" | "annual";

export type Settings = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  emailNotifications: boolean;
  productUpdates: boolean;
  expiryReminders: boolean;
  twoFactor: boolean;
  theme: "light" | "dark";
};

export type BundlerState = {
  plan: PlanId;
  memberSince: string;
  renewsAt: string;
  autoRenew: boolean;
  services: Service[];
  payments: Payment[];
  notifications: NotificationItem[];
  referrals: Referral[];
  methods: PaymentMethod[];
  settings: Settings;
  otps: Record<string, { code: string; expiresAt: number }>;
};

export const PLAN_PRICES: Record<PlanId, { label: string; price: number; cadence: string }> = {
  monthly: { label: "Bundler Monthly Plan", price: 29, cadence: "month" },
  annual: { label: "Bundler Annual Plan", price: 168, cadence: "year" },
};

const SERVICES: Service[] = [
  {
    id: "netflix",
    name: "Netflix",
    short: "N",
    tagline: "Get your Netflix sign in details and enjoy your movies",
    bg: "#000000",
    fg: "#E50914",
    email: "bundle.tv+netflix@bundler.co",
    password: "Nfx!2026-Bundle",
    profile: "Profile 4 — Segun",
    pin: "4821",
    supportsOtp: true,
  },
  {
    id: "prime-video",
    name: "Prime Video",
    short: "pv",
    tagline: "Get your Prime Video sign in details and generate OTPs for sign-in",
    bg: "#1399FF",
    fg: "#FFFFFF",
    email: "bundle.tv+prime@bundler.co",
    password: "Prm!2026-Bundle",
    profile: "Profile 2 — Segun",
    pin: "1190",
    supportsOtp: true,
  },
  {
    id: "disney-plus",
    name: "Disney Plus",
    short: "D+",
    tagline: "Get your Disney+ sign in details and generate OTPs for sign-in",
    bg: "#0C1B58",
    fg: "#FFFFFF",
    email: "bundle.tv+disney@bundler.co",
    password: "Dsn!2026-Bundle",
    profile: "Profile 3 — Segun",
    pin: "7742",
    supportsOtp: true,
  },
  {
    id: "espn",
    name: "ESPN+",
    short: "E+",
    tagline: "Get your ESPN+ sign in details and generate OTPs for sign-in",
    bg: "#0B2545",
    fg: "#FFFFFF",
    email: "bundle.tv+espn@bundler.co",
    password: "Esp!2026-Bundle",
    profile: "Profile 1 — Segun",
    pin: "3355",
    supportsOtp: true,
  },
  {
    id: "hulu",
    name: "Hulu",
    short: "h",
    tagline: "Get your Hulu sign in details and generate OTPs for sign-in",
    bg: "#1CE783",
    fg: "#0B0B0B",
    email: "bundle.tv+hulu@bundler.co",
    password: "Hlu!2026-Bundle",
    profile: "Profile 5 — Segun",
    pin: "9021",
    supportsOtp: true,
  },
  {
    id: "hbo-max",
    name: "HBO Max",
    short: "HB",
    tagline: "Get your HBO Max sign in details and generate OTPs for sign-in",
    bg: "#5B21B6",
    fg: "#FFFFFF",
    email: "bundle.tv+hbo@bundler.co",
    password: "Hbo!2026-Bundle",
    profile: "Profile 2 — Segun",
    pin: "6614",
    supportsOtp: true,
  },
  {
    id: "spotify",
    name: "Spotify",
    short: "S",
    tagline: "Get your spotify sign in details and generate OTPs for sign-in",
    bg: "#111111",
    fg: "#1DB954",
    email: "bundle.tv+spotify@bundler.co",
    password: "Spt!2026-Bundle",
    profile: "Family member 4",
    pin: "2087",
    supportsOtp: true,
  },
  {
    id: "youtube-premium",
    name: "YouTube Premium",
    short: "YT",
    tagline: "Get your YouTube premium sign in details and generate OTPs for sign-in",
    bg: "#FFFFFF",
    fg: "#FF0000",
    email: "bundle.tv+youtube@bundler.co",
    password: "Ytp!2026-Bundle",
    profile: "Family member 2",
    pin: "5533",
    supportsOtp: true,
  },
];

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const initialState: BundlerState = {
  plan: "monthly",
  memberSince: "2022-11-14T00:00:00.000Z",
  renewsAt: daysFromNow(23),
  autoRenew: true,
  services: SERVICES,
  payments: [
    {
      id: "INV-10428",
      date: "2026-08-14T09:12:00.000Z",
      description: "Bundler Monthly Plan",
      amount: 29,
      method: "Visa •••• 4242",
      status: "paid",
    },
    {
      id: "INV-10311",
      date: "2026-07-14T09:11:00.000Z",
      description: "Bundler Monthly Plan",
      amount: 29,
      method: "Visa •••• 4242",
      status: "paid",
    },
    {
      id: "INV-10197",
      date: "2026-06-14T09:10:00.000Z",
      description: "Bundler Monthly Plan",
      amount: 29,
      method: "Visa •••• 4242",
      status: "paid",
    },
    {
      id: "INV-10066",
      date: "2026-05-14T09:08:00.000Z",
      description: "Bundler Monthly Plan",
      amount: 29,
      method: "Mastercard •••• 8891",
      status: "failed",
    },
    {
      id: "INV-09954",
      date: "2026-04-14T09:07:00.000Z",
      description: "Bundler Monthly Plan",
      amount: 29,
      method: "Visa •••• 4242",
      status: "paid",
    },
  ],
  notifications: Array.from({ length: 6 }).map((_, i) => ({
    id: `n-${i}`,
    title:
      [
        "Your plan renews in 23 days",
        "New: HBO Max profile assigned",
        "Referral reward credited",
        "Payment receipt available",
        "Spotify password rotated",
        "Install the Bundler app",
      ][i] ?? "Update",
    body:
      [
        "Renew in advance to keep uninterrupted access to all 8 services.",
        "Profile 2 is now reserved for your household.",
        "You earned $10 from Ada's subscription.",
        "Invoice INV-10428 is ready to download.",
        "We rotate shared passwords monthly for security.",
        "Get OTPs instantly on your phone.",
      ][i] ?? "",
    date: daysFromNow(-i - 1),
    read: false,
  })),
  referrals: [
    {
      id: "r-1",
      name: "Ada Nwosu",
      email: "ada@example.com",
      status: "joined",
      reward: 10,
      date: daysFromNow(-21),
    },
    {
      id: "r-2",
      name: "Tunde B.",
      email: "tunde@example.com",
      status: "joined",
      reward: 10,
      date: daysFromNow(-48),
    },
    {
      id: "r-3",
      name: "Marta L.",
      email: "marta@example.com",
      status: "invited",
      reward: 0,
      date: daysFromNow(-4),
    },
  ],
  methods: [
    { id: "pm-1", brand: "Visa", last4: "4242", expiry: "09/28", primary: true },
    { id: "pm-2", brand: "Mastercard", last4: "8891", expiry: "01/27", primary: false },
  ],
  settings: {
    fullName: "Segun Okafor",
    email: "segun.o@example.com",
    phone: "+1 (415) 555-0142",
    country: "United States",
    emailNotifications: true,
    productUpdates: true,
    expiryReminders: true,
    twoFactor: false,
    theme: "light",
  },
  otps: {},
};

const STORAGE_KEY = "bundler-state-v1";

type Ctx = {
  state: BundlerState;
  update: (patch: Partial<BundlerState>) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  daysLeft: number;
  displayName: string;
  initials: string;
  unreadCount: number;
  markAllRead: () => void;
  generateOtp: (id: ServiceId) => string;
  renew: (months?: number) => void;
  switchPlan: (plan: PlanId) => void;
  addPaymentMethod: (m: Omit<PaymentMethod, "id">) => void;
  removePaymentMethod: (id: string) => void;
  makePrimary: (id: string) => void;
  inviteFriend: (name: string, email: string) => void;
  reset: () => void;
};

const BundlerContext = createContext<Ctx | null>(null);

export function BundlerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BundlerState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as BundlerState;
        setState({ ...initialState, ...parsed, services: SERVICES });
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("dark", state.settings.theme === "dark");
  }, [state.settings.theme, hydrated]);

  const update = useCallback((patch: Partial<BundlerState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  }, []);

  const value = useMemo<Ctx>(() => {
    const days = Math.max(
      0,
      Math.ceil((new Date(state.renewsAt).getTime() - Date.now()) / 86_400_000),
    );
    const parts = state.settings.fullName.trim().split(/\s+/);
    const displayName = parts.length > 1 ? `${parts[0]} ${parts[1]![0]}.` : parts[0]!;
    const initials = (parts[0]![0]! + (parts[1]?.[0] ?? "")).toUpperCase();

    return {
      state,
      update,
      updateSettings,
      daysLeft: days,
      displayName,
      initials,
      unreadCount: state.notifications.filter((n) => !n.read).length,
      markAllRead: () =>
        setState((s) => ({
          ...s,
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),
      generateOtp: (id) => {
        const code = String(Math.floor(100000 + Math.random() * 900000));
        setState((s) => ({
          ...s,
          otps: { ...s.otps, [id]: { code, expiresAt: Date.now() + 120_000 } },
        }));
        return code;
      },
      renew: (months = 1) =>
        setState((s) => {
          const base = new Date(Math.max(Date.now(), new Date(s.renewsAt).getTime()));
          base.setMonth(base.getMonth() + months);
          const price = PLAN_PRICES[s.plan].price;
          const payment: Payment = {
            id: `INV-${Math.floor(10000 + Math.random() * 89999)}`,
            date: new Date().toISOString(),
            description: `${PLAN_PRICES[s.plan].label} — renewal`,
            amount: price,
            method: s.methods.find((m) => m.primary)
              ? `${s.methods.find((m) => m.primary)!.brand} •••• ${s.methods.find((m) => m.primary)!.last4}`
              : "Wallet",
            status: "paid",
          };
          return { ...s, renewsAt: base.toISOString(), payments: [payment, ...s.payments] };
        }),
      switchPlan: (plan) =>
        setState((s) => {
          const next = new Date();
          next.setDate(next.getDate() + (plan === "annual" ? 365 : 30));
          const payment: Payment = {
            id: `INV-${Math.floor(10000 + Math.random() * 89999)}`,
            date: new Date().toISOString(),
            description: `${PLAN_PRICES[plan].label} — ${plan === "annual" ? "upgrade" : "downgrade"}`,
            amount: PLAN_PRICES[plan].price,
            method: s.methods.find((m) => m.primary)
              ? `${s.methods.find((m) => m.primary)!.brand} •••• ${s.methods.find((m) => m.primary)!.last4}`
              : "Wallet",
            status: "paid",
          };
          return { ...s, plan, renewsAt: next.toISOString(), payments: [payment, ...s.payments] };
        }),
      addPaymentMethod: (m) =>
        setState((s) => ({
          ...s,
          methods: [
            ...s.methods.map((x) => ({ ...x, primary: m.primary ? false : x.primary })),
            { ...m, id: `pm-${Date.now()}` },
          ],
        })),
      removePaymentMethod: (id) =>
        setState((s) => {
          const methods = s.methods.filter((m) => m.id !== id);
          if (methods.length && !methods.some((m) => m.primary)) methods[0]!.primary = true;
          return { ...s, methods };
        }),
      makePrimary: (id) =>
        setState((s) => ({
          ...s,
          methods: s.methods.map((m) => ({ ...m, primary: m.id === id })),
        })),
      inviteFriend: (name, email) =>
        setState((s) => ({
          ...s,
          referrals: [
            {
              id: `r-${Date.now()}`,
              name,
              email,
              status: "invited",
              reward: 0,
              date: new Date().toISOString(),
            },
            ...s.referrals,
          ],
        })),
      reset: () => setState(initialState),
    };
  }, [state, update, updateSettings]);

  return <BundlerContext.Provider value={value}>{children}</BundlerContext.Provider>;
}

export function useBundler() {
  const ctx = useContext(BundlerContext);
  if (!ctx) throw new Error("useBundler must be used inside BundlerProvider");
  return ctx;
}

export const referralCode = "SEGUN10";

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMonthYear(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
