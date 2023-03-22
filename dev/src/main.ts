import Vue, { configureCompat } from "vue";
import VueFormGenerator from "../../src";

Vue.use(VueFormGenerator);

// import { configureCompat } from "@vue/compat";

configureCompat({ MODE: 2 });

import App from "./app.vue";

new Vue({
  ...App
}).$mount("#app");
