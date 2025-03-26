import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Sitemap from "vite-plugin-sitemap";

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: "https://iifmglobleverification.web.app", // Your Firebase Hosting URL
      include: ["/", "/about", "/contact", "/login"], // Publicly accessible routes
      exclude: [
        "/dashboard",
        "/dashboard/manage-candidate",
        "/dashboard/add-candidate",
        "/dashboard/search-candidate",
        "/dashboard/candidate/:candidateId"
      ], // Excluding protected admin routes

      // disable automatic robots.txt creation
      generateRobotsTxt : false,
    }),
  ],
});
