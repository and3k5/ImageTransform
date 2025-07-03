import "./assets/main.css";

import { createApp, h } from "vue";
import { createPinia } from "pinia";
import { createWebHashHistory, createRouter, RouterView } from "vue-router";

import { matchDark, setDarkModeOnDocument } from "./color-mode";
import { defaultAlgoId } from "./core/algorithms";

const pinia = createPinia();
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import("./App.vue"),
            props(route) {
                return {
                    algoid: (route.query.algoid as string | undefined) ?? defaultAlgoId,
                };
            },
        },
    ],
});

const app = createApp({
    render: () => h(RouterView),
});

setDarkModeOnDocument(matchDark.matches);

app.use(pinia);
app.use(router);

app.mount("#app");
