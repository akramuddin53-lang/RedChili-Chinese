import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Red Chili Restaurant" },
      { name: "description", content: "Authentic flavors at Red Chili Restaurant." },
      { property: "og:title", content: "Red Chili Restaurant" },
      { property: "og:description", content: "Authentic flavors at Red Chili Restaurant." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <iframe
      src="/restaurant.html"
      title="Red Chili Restaurant"
      style={{ border: 0, width: "100vw", height: "100vh", display: "block" }}
    />
  );
}
