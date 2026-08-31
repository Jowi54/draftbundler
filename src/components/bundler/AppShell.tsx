import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  CreditCard,
  Gem,
  Headphones,
  Home,
  LogOut,
  Menu,
  Receipt,
  Settings as SettingsIcon,
  Smartphone,
  MessageSquare,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { formatDate, useBundler } from "@/lib/bundler-store";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/subscription", label: "Manage Subscription", icon: CreditCard },
  { to: "/payments", label: "Payment History", icon: Receipt },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

function BundlerMark() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex size-7 items-center justify-center rounded-md bg-foreground">
        <span className="size-2.5 rounded-[3px] bg-background" />
      </span>
      <span className="text-xl font-extrabold tracking-tight">Bundler</span>
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { state } = useBundler();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center border-b border-sidebar-border px-6">
        <BundlerMark />
      </div>

      <nav className="flex flex-col gap-1 px-4 py-5">
        {navItems.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="size-[18px]" />
              {item.label}
            </Link>
          );
        })}

        <div className="my-3 h-px bg-sidebar-border" />

        <Link
          to="/subscription"
          search={{ upgrade: true }}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-accent"
        >
          <Gem className="size-[18px]" />
          {state.plan === "annual" ? "Annual Plan active" : "Upgrade to Annual Plan"}
        </Link>
      </nav>

      <div className="mt-auto space-y-4 px-4 pb-6">
        <div className="rounded-xl bg-mint/40 p-4">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-mint text-mint-foreground">
              <Headphones className="size-4" />
            </span>
            <p className="text-sm font-bold">Send us a feedback</p>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            We'd love to hear what feedback you have for us.
          </p>
          <Link
            to="/support"
            onClick={onNavigate}
            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            Get in touch <span aria-hidden>→</span>
          </Link>
        </div>

        <button
          onClick={() => toast.success("Install prompt sent", { description: "Check your device." })}
          className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-foreground"
        >
          <Smartphone className="size-[18px]" />
          Install App
        </button>
        <button
          onClick={() => {
            toast("Signed out", { description: "You have been logged out of Bundler." });
            navigate({ to: "/" });
            onNavigate?.();
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-foreground"
        >
          <LogOut className="size-[18px]" />
          Logout
        </button>
      </div>
    </div>
  );
}

function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { state, displayName, initials, unreadCount, markAllRead, updateSettings } = useBundler();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between gap-4 px-5 py-5 lg:px-10">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onOpenMenu}
        aria-label="Open menu"
      >
        <Menu />
      </Button>

      <div className="ml-auto flex items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="relative rounded-full p-2 transition-colors hover:bg-secondary"
              aria-label={`Notifications (${unreadCount} unread)`}
            >
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-88 p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <p className="text-sm font-bold">Notifications</p>
              <button
                onClick={markAllRead}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Mark all read
              </button>
            </div>
            <ScrollArea className="h-80">
              <ul className="divide-y">
                {state.notifications.map((n) => (
                  <li key={n.id} className={cn("px-4 py-3", !n.read && "bg-accent/40")}>
                    <p className="text-sm font-semibold">{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{formatDate(n.date)}</p>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        <span className="h-6 w-px bg-border" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-secondary">
              <span className="flex size-9 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                {initials}
              </span>
              <span className="hidden text-sm font-bold sm:block">{displayName}</span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-bold">{state.settings.fullName}</p>
              <p className="text-xs font-normal text-muted-foreground">{state.settings.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
              <SettingsIcon /> Account settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate({ to: "/subscription" })}>
              <CreditCard /> Manage subscription
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                updateSettings({ theme: state.settings.theme === "dark" ? "light" : "dark" })
              }
            >
              <Gem /> {state.settings.theme === "dark" ? "Light" : "Dark"} appearance
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast("Signed out")}>
              <LogOut /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function ContactWidget() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
      {open && (
        <div className="panel w-64 p-4 shadow-[var(--shadow-pop)]">
          <div className="flex items-start justify-between">
            <p className="text-sm font-bold">Need a hand?</p>
            <button onClick={() => setOpen(false)} aria-label="Close">
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Our team replies in under 5 minutes on average.
          </p>
          <Button
            size="sm"
            className="mt-3 w-full"
            onClick={() => {
              setOpen(false);
              navigate({ to: "/support" });
            }}
          >
            Start a conversation
          </Button>
        </div>
      )}
      {!open && (
        <span className="hidden rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background sm:block">
          Contact Us!
        </span>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Contact support"
        className="flex size-12 items-center justify-center rounded-full bg-foreground text-background shadow-[var(--shadow-pop)] transition-transform hover:scale-105"
      >
        <MessageSquare className="size-5" />
      </button>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent />
      </aside>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-72 bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent onNavigate={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="lg:pl-72">
        <TopBar onOpenMenu={() => setMenuOpen(true)} />
        <main className="mx-auto w-full max-w-4xl px-5 pb-24 lg:px-10">{children}</main>
      </div>

      <ContactWidget />
    </div>
  );
}

export function PageHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-extrabold tracking-tight lg:text-[2.1rem]">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
