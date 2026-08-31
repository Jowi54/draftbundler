import { createFileRoute } from "@tanstack/react-router";
import { Download, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell, PageHeading } from "@/components/bundler/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, useBundler, type Payment } from "@/lib/bundler-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Payment History — Bundler" },
      {
        name: "description",
        content:
          "Browse, search and download every Bundler invoice, with totals for your subscription spend.",
      },
      { property: "og:title", content: "Payment History — Bundler" },
      {
        property: "og:description",
        content: "Every Bundler receipt in one place, downloadable as CSV.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PaymentsPage,
});

const statusStyles: Record<Payment["status"], string> = {
  paid: "bg-success/15 text-success",
  pending: "bg-warning/25 text-warning-foreground",
  failed: "bg-destructive/15 text-destructive",
};

function downloadCsv(rows: Payment[], filename: string) {
  const header = "Invoice,Date,Description,Amount,Method,Status";
  const body = rows
    .map((r) => [r.id, formatDate(r.date), r.description, `$${r.amount}`, r.method, r.status].join(","))
    .join("\n");
  const blob = new Blob([`${header}\n${body}`], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function PaymentsPage() {
  const { state } = useBundler();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | Payment["status"]>("all");

  const rows = useMemo(
    () =>
      state.payments.filter((p) => {
        const matchQuery = `${p.id} ${p.description} ${p.method}`
          .toLowerCase()
          .includes(query.toLowerCase());
        return matchQuery && (status === "all" || p.status === status);
      }),
    [state.payments, query, status],
  );

  const totalPaid = state.payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <AppShell>
      <PageHeading title="Payment History" subtitle="Every charge on your Bundler account." />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total paid", value: `$${totalPaid}` },
          { label: "Invoices", value: String(state.payments.length) },
          {
            label: "Failed charges",
            value: String(state.payments.filter((p) => p.status === "failed").length),
          },
        ].map((s) => (
          <div key={s.label} className="panel p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-1 text-2xl font-extrabold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search invoices"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses">
              {status === "all" ? "All statuses" : status[0]!.toUpperCase() + status.slice(1)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            downloadCsv(rows, "bundler-payments.csv");
            toast.success("Export started");
          }}
        >
          <Download className="size-4" /> Export CSV
        </Button>
      </div>

      <section className="panel mt-4 divide-y overflow-hidden">
        {rows.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            No invoices match your filters.
          </p>
        )}
        {rows.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
            <div className="min-w-44 flex-1">
              <p className="font-bold">{p.description}</p>
              <p className="text-xs text-muted-foreground">
                {p.id} · {formatDate(p.date)} · {p.method}
              </p>
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-bold capitalize",
                statusStyles[p.status],
              )}
            >
              {p.status}
            </span>
            <p className="w-20 text-right font-extrabold">${p.amount}</p>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Download invoice ${p.id}`}
              onClick={() => {
                downloadCsv([p], `${p.id}.csv`);
                toast.success(`${p.id} downloaded`);
              }}
            >
              <Download className="size-4" />
            </Button>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
