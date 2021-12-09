import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import LitJsSdk from "lit-js-sdk";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    LitJsSdk,
  },
});
