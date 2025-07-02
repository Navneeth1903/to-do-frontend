import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    // Replit-specific plugins removed for local/dev/prod compatibility
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
    },
  },
  root: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    proxy: {
      '/api': 'https://to-do-backend-klga.onrender.com',
    },
  },
  define: {
    // Define environment variables for the frontend
    __API_BASE_URL__: JSON.stringify(process.env.VITE_API_BASE_URL || 'http://localhost:5000'),
  },
}); 
