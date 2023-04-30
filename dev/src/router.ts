import { createRouter, createWebHashHistory } from "vue-router";
import BasicComponents from "@/examples/BasicComponents.vue";
import CheckList from "@/examples/CheckList.vue";

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/basic", name: "basic", component: BasicComponents },
    { path: "/checklist", name: "checklist", component: CheckList }
  ]
});
