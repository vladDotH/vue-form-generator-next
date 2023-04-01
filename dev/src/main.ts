import VueFormGenerator from "../../src";
import App from "./App.vue";
import { createApp } from "vue";
import { router } from "@/router";

const app = createApp(App);

app.use(router).use(VueFormGenerator);

app.mount("#app");
