import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// Accessing environment variables
import dotenv from 'dotenv'
dotenv.config()
const ENV = process.env;
const _string = (v) => JSON.stringify(v);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define:{
    DEBUG: false, // <==== CHANGE THIS (debug_false.sh, debug_true.sh)
    ENV: ENV,
    API_DEV: _string(ENV.API_DEV),
  },
  jsxInject: [
    `import LitJsSdk from 'lit-js-sdk' `,
  ],
});