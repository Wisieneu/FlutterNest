import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 6700,
    host: "0.0.0.0",
    allowedHosts: ["flutternest.wise-ee.com"],
  },
});
