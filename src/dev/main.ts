import VueFormGenerator from "../index";
import App from "./App.vue";
import { createApp } from "vue";
import { router } from "@/dev/router";
import FieldAwesome from "@/dev/examples/FieldAwesome.vue";

const app = createApp(App);

app.use(router).use(VueFormGenerator);
app.component("FieldAwesome", FieldAwesome);
app.mount("#app");
