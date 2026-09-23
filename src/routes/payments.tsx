import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Download } from "lucide-react";
import { toast } from "sonner";

import { AppShell, PageHeading } from "@/components/bundler/AppShell";
import { Button } from "@/components/ui/button";
import { formatDate, useBundler } from "@/lib/bundler-store";

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

function downloadCsv(rows: ReturnType<typeof useBundler>["state"]["payments"], filename: string) {
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
  return (
    <AppShell>
      <PageHeading title="Payment History" />
      <section className="panel overflow-hidden p-4 sm:p-6">
        <div className="hidden grid-cols-[1.7fr_1fr_.55fr_1.05fr_.7fr] border-b bg-secondary text-sm font-medium sm:grid">
          {['Description','Date issued','Price','Payment type','Receipt'].map(x => <div key={x} className="px-6 py-4">{x}</div>)}
        </div>
        <div className="divide-y">
          {state.payments.map((p) => (
            <div key={p.id} className="grid gap-2 py-4 text-sm sm:grid-cols-[1.7fr_1fr_.55fr_1.05fr_.7fr] sm:items-center sm:gap-0 sm:py-0">
              <div className="font-medium text-muted-foreground sm:px-6 sm:py-4">{p.description}</div>
              <div className="text-muted-foreground sm:px-6 sm:py-4">{formatDate(p.date)}</div>
              <div className="font-medium text-muted-foreground sm:px-6 sm:py-4">${p.amount}</div>
              <div className="flex items-center gap-2 text-muted-foreground sm:px-6 sm:py-4"><CreditCard className="size-4" />•••• {p.method.slice(-4)}</div>
              <Button variant="ghost" className="h-auto justify-start px-0 text-muted-foreground sm:justify-center sm:px-6 sm:py-4" onClick={() => { downloadCsv([p], `${p.id}.csv`); toast.success(`${p.id} downloaded`); }}>View details</Button>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-6 gap-2" onClick={() => downloadCsv(state.payments, "bundler-payments.csv")}><Download className="size-4" /> Export CSV</Button>
      </section>
    </AppShell>
  );
}
