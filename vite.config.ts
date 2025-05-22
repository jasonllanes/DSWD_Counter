import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  // REPO-NAME
  base: "/dswd-counter",
  plugins: [react()],
  server: {
    host: "0.0.0.0", // IP address, 0.0.0.0 makes it accessible on your local network
    port: 3001, // specify the port you want here
    hmr: {
      overlay: true
    },
    watch: {
      usePolling: true
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          ui: ['@radix-ui/react-dropdown-menu', '@radix-ui/react-dialog']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts']
  }
});
