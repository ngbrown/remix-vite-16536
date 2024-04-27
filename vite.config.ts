import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [remix(), tsconfigPaths()],
  server: {
    hmr: {
      // where I want to be able to set headers:
      //headers: {
      //  "cross-origin-resource-policy": "cross-origin",
      //}
      port: 8002,
    },
  },
});
