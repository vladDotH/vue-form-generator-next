import { createRouter, createWebHashHistory } from "vue-router";
import BasicComponents from "@/dev/examples/BasicComponents.vue";
import CheckList from "@/dev/examples/CheckList.vue";
import CoreComponents from "@/dev/examples/CoreComponents.vue";
import Full from "@/dev/examples/Full.vue";

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/basic", name: "basic", component: BasicComponents },
    { path: "/checklist", name: "checklist", component: CheckList },
    { path: "/core", name: "core", component: CoreComponents },
    { path: "/full", name: "full", component: Full }
  ]
});
