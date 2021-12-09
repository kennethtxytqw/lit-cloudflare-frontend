import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import { createRouter, createWebHistory } from "vue-router";
// import Upload from "./components/Upload.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "App",
      component: () => import("./components/Watch.vue"),
    },
    {
      path: "/upload",
      name: "Upload",
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
        },
      ],
    },
    // {
    //   path: "/token-gate",
    //   name: "Token Gate",
    //   component: () => import("./components/AccessControl.vue"),
    // },
    // {
    //   path: "/submit",
    //   name: "Submit",
    //   component: () => import("./components/Submit.vue"),
    // },
  ],
});

createApp(App).use(router).mount("#app");
