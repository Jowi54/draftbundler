import { createFileRoute } from "@tanstack/react-router";

import { AuthScreen } from "@/components/bundler/AuthScreen";

export const Route = createFileRoute("/sign-in")({
  head: () => ({ meta: [
    { title: "Sign in — Bundler" },
    { name: "description", content: "Sign in to your Bundler account." },
    { property: "og:title", content: "Sign in — Bundler" },
    { property: "og:description", content: "Sign in to your Bundler account." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <AuthScreen mode="signin" />,
});