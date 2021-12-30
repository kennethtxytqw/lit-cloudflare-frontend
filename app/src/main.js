import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "App",
      component: () => import("./pages/Watch.vue"),
    },
    {
      path: "/stream",
      name: "Stream",
      component: () => import("./pages/Stream.vue"),
      children: [
        {
          path: "upload",
          component: () => import("./pages/upload/Upload.vue"),
        },
        {
          path: "token-gate",
          component: () => import("./pages/upload/AccessControl.vue"),
        },
        {
          path: "submit",
          component: () => import("./pages/upload/Submit.vue"),
          props: true,
        },
      ],
    },
    {
      path: "/plugin",
      name: "Plugin",
      component: () => import("./pages/Plugin.vue"),
    },
  ],
});

const app = createApp(App).use(router).mount("#app");
