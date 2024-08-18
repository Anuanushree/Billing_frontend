import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Define your Vite configuration
export default defineConfig({
  plugins: [react()],
  build: {
    minify: "terser", // Minification tool to use, options are 'terser' or 'esbuild'
    terserOptions: {
      compress: {
        drop_console: true, // Optionally remove console statements
      },
    },
    sourcemap: true, // Enable source maps for easier debugging
  },
});
