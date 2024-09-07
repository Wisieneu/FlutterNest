import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.REACT_APP_S3_BUCKET_URL": JSON.stringify(
        env.REACT_APP_S3_BUCKET_URL,
      ),
    },
    plugins: [react(), tsconfigPaths()],
  };
});
