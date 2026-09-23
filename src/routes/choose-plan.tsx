import { createFileRoute } from "@tanstack/react-router";

import { AuthScreen } from "@/components/bundler/AuthScreen";

export const Route = createFileRoute("/choose-plan")({
  head: () => ({ meta: [
    { title: "Choose your plan — Bundler" },
    { name: "description", content: "Choose a monthly or annual Bundler streaming plan." },
    { property: "og:title", content: "Choose your plan — Bundler" },
    { property: "og:description", content: "Choose a monthly or annual Bundler streaming plan." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <AuthScreen mode="plans" />,
});