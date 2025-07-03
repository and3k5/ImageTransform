import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import { matchDark, setDarkModeOnDocument } from "./color-mode";

const pinia = createPinia();
const app = createApp(App);

setDarkModeOnDocument(matchDark.matches);

app.use(pinia);

app.mount("#app");
