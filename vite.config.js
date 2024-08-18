import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Define your Vite configuration
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // Enable source maps for easier debugging
  },
});
