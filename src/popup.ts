import App from "./popup.svelte";
import type { Actions } from './$types';
import "./tailwind.css";

const app = new App(
    {
        target: document.body,
        //    props: {},
    }
);

export default app;