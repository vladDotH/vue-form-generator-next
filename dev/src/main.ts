import VueFormGenerator from "../../src";
import App from "./app.vue";
import { createApp } from "vue";

const app = createApp(App);
app.use(VueFormGenerator);
app.mount("#app");
