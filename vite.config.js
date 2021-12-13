import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const API_DEV = 'http://127.0.0.1:8787';
const API_PROD = 'https://cf-worker.gtc-lightanson.workers.dev';

// can be found in your wrangler.toml
const NS_VIDEO_DEV = '0a8b02e7c74b41b09a8afee1caaed4dc';
const NS_VIDEO_PROD = 'dde3a62fc20a4fee993d83b7baf5755d';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define:{
    DEBUG: true, // <== CHANGE THIS FOR PRODUCTION
    API_DEV: JSON.stringify(API_DEV),
    API_PROD: JSON.stringify(API_PROD),
    NS_VIDEO_DEV: JSON.stringify(NS_VIDEO_DEV),
    NS_VIDEO_PROD: JSON.stringify(NS_VIDEO_PROD),
  },
  jsxInject: [
    `import LitJsSdk from 'lit-js-sdk' `,
  ],
});