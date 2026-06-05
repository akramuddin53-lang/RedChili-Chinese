// Lovable's TanStack config defaults Nitro to the Cloudflare preset.
// We override it to target Vercel. NITRO_PRESET env var also works
// (Vercel sets it automatically when deploying TanStack Start).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: process.env.NITRO_PRESET ?? "vercel",
  },
});
