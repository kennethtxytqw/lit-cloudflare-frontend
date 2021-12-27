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
    DEBUG: _string(ENV.ENVIRONMENT) != 'dev',
    API_DEV: _string(ENV.API_DEV),
    NS_VIDEO_DEV: _string(ENV.NS_VIDEO_DEV),
    API_PROD: _string(ENV.API_PROD),
    NS_VIDEO_PROD: _string(ENV.NS_VIDEO_PROD),
  },
  jsxInject: [
    `import LitJsSdk from 'lit-js-sdk' `,
  ],
});