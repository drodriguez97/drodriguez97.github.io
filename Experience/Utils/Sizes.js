import { EventEmitter } from "events";

export default class Sizes extends EventEmitter {
    constructor() {
        super();
        this.frustrum = 5;
        this.measure();

        window.addEventListener("resize", () => {
            this.measure();
            this.emit("resize");
        });
    }

    measure() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.aspect = this.width / this.height;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    }
}
