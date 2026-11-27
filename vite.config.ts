// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { discoverProjectSlugs } from "./src/data/projects/discover-slugs";

const STATIC_ASSET_EXT_RE =
  /\.(pdf|png|jpe?g|gif|webp|svg|ico|zip|txt|xml|json|css|js|mp4|webm|mov|ogg)$/i;

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    pages: [
      { path: "/" },
      ...discoverProjectSlugs().map((slug) => ({ path: `/projetos/${slug}` })),
    ],
    prerender: {
      enabled: true,
      autoStaticPathsDiscovery: true,
      autoSubfolderIndex: true,
      filter: ({ path }: { path: string }) =>
        !STATIC_ASSET_EXT_RE.test(path) && !path.includes("#"),
    },
  },
});
