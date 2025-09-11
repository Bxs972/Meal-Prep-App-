import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // ✅ permet l'accès depuis Codespaces / Docker / réseau externe
    port: 3000,      // ✅ fixe le port à 3000
  },
  preview: {
    host: "0.0.0.0", // ✅ idem pour "vite preview"
    port: 3000,
  },
});
