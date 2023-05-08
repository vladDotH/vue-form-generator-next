import VueFormGenerator from "../index";
import App from "./App.vue";
import { createApp } from "vue";
import { router } from "@/dev/router";

const app = createApp(App);

app.use(router).use(VueFormGenerator);

app.mount("#app");
