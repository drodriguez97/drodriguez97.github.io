import Experience from "../Experience.js";

import Room from "./Room.js";
import Floor from "./Floor.js";
import Controls from "./Controls.js";
import Environment from "./Environment.js";
import { EventEmitter } from "events";

export default class World extends EventEmitter {
    constructor() {
        super();
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.theme = this.experience.theme;

        this.resources.on("ready", () => {
            this.environment = new Environment();
            this.environment.switchTheme(this.theme.theme, true);
            this.room = new Room();
            this.floor = new Floor();
            this.controls = new Controls();
            this.emit("worldready");
        });

        this.theme.on("switch", (theme) => {
            this.environment?.switchTheme(theme);
        });
    }

    update() {
        this.room?.update();
    }
}
