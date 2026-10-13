import { EventEmitter } from "events";

const STORAGE_KEY = "theme";

export default class Theme extends EventEmitter {
    constructor() {
        super();
        this.toggleButton = document.querySelector(".toggle-button");
        this.theme = this.getInitialTheme();
        this.apply();

        this.toggleButton.addEventListener("click", () => {
            this.theme = this.theme === "light" ? "dark" : "light";
            this.apply();
            try {
                localStorage.setItem(STORAGE_KEY, this.theme);
            } catch {}
            this.emit("switch", this.theme);
        });
    }

    getInitialTheme() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === "light" || saved === "dark") return saved;
        } catch {}
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }

    apply() {
        const dark = this.theme === "dark";
        document.body.classList.toggle("dark-theme", dark);
        document.body.classList.toggle("light-theme", !dark);
        this.toggleButton.setAttribute("aria-pressed", String(dark));
    }
}
