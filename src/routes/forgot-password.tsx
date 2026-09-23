import { createFileRoute } from "@tanstack/react-router";

import { AuthScreen } from "@/components/bundler/AuthScreen";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [
    { title: "Reset password — Bundler" },
    { name: "description", content: "Request a secure Bundler password reset link." },
    { property: "og:title", content: "Reset password — Bundler" },
    { property: "og:description", content: "Request a secure Bundler password reset link." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <AuthScreen mode="reset" />,
});