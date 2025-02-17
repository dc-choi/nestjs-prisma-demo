import { resolve } from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
        },
        alias: {
            "~": resolve(__dirname, "./src"),
        },
    },
    plugins: [tsconfigPaths()],
});
