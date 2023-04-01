import { createRouter, createWebHashHistory } from "vue-router";
import BasicComponents from "@/examples/BasicComponents.vue";

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: "/basic", name: "basic", component: BasicComponents }]
});
