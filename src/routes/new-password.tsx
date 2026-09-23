import { createFileRoute } from "@tanstack/react-router";

import { AuthScreen } from "@/components/bundler/AuthScreen";

export const Route = createFileRoute("/new-password")({
  head: () => ({ meta: [
    { title: "Create a new password — Bundler" },
    { name: "description", content: "Create a new password for your Bundler account." },
    { property: "og:title", content: "Create a new password — Bundler" },
    { property: "og:description", content: "Create a new password for your Bundler account." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <AuthScreen mode="password" />,
});