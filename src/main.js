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
      component: () => import("./components/Watch.vue"),
    },
    {
      path: "/stream",
      name: "Stream",
      component: () => import("./components/Upload.vue"),
      children: [
        {
          path: "upload",
          component: () => import("./components/upload/Upload.vue"),
        },
        {
          path: "token-gate",
          component: () => import("./components/upload/AccessControl.vue"),
        },
        {
          path: "submit",
          component: () => import("./components/upload/Submit.vue"),
          props: true,
        },
        {
          path: "auth",
          component: () => import("./components/upload/Authentication.vue"),
        },
      ],
    },
  ],
});

const app = createApp(App).use(router).mount("#app");
