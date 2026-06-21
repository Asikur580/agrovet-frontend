import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      devOptions: {
        enabled: true, // Enables PWA in development mode
      },
      manifest: {
        name: "Radian agrovet",
        short_name: "Radiant agrovet",
        description: "This is radiant agrovet's app",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            // src: "/pwa-192x192.png",
            src: "/profile.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            // src: "/pwa-512x512.png",
            src: "/profile.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg}"],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4MB
      },
    }),
  ],
  //==> change port for preview
  preview: {
    port: 5000,
  },
  //==> change port for development
  server: {
    port: 3000,
  },
});
