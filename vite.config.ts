import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 5173;
const basePath = process.env.BASE_PATH || "/dart-guide/";
export default defineConfig({
  base: basePath,
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  plugins: [react(), tailwindcss()],
  server: { host: "0.0.0.0", port, allowedHosts: true },
  build: { outDir: "dist", emptyOutDir: true, target: "esnext" },
});
