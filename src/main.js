import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import { createRouter, createWebHistory } from "vue-router";
// import Upload from "./components/Upload.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/upload",
      name: "Upload",
      component: () => import("./components/Upload.vue"),
    },
    {
      path: "/token-gate",
      name: "Token Gate",
      component: () => import("./components/AccessControl.vue"),
    },
    {
      path: "/submit",
      name: "Submit",
      component: () => import("./components/Submit.vue"),
    },
  ],
});

createApp(App).use(router).mount("#app");
