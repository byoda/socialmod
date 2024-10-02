import App from "./lib/config.svelte";
import "./tailwind.css";

const app = new App(
    {
        target: document.body,
        props: {
            name: "world",
        }
    }
);

export default app;