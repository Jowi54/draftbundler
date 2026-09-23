import { createFileRoute } from "@tanstack/react-router";

import { AuthScreen } from "@/components/bundler/AuthScreen";

export const Route = createFileRoute("/create-account")({
  head: () => ({ meta: [
    { title: "Create an account — Bundler" },
    { name: "description", content: "Create your Bundler account and choose a streaming plan." },
    { property: "og:title", content: "Create an account — Bundler" },
    { property: "og:description", content: "Create your Bundler account and choose a streaming plan." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <AuthScreen mode="signup" />,
});