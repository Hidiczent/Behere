// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // ✅ ใช้ปลั๊กอิน React
import path from "node:path";             // ✅ import จาก node:

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"), // ถ้าจะใช้ @assets/...
    },
  },
});
