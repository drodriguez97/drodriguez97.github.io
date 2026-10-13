import { EventEmitter } from "events";

export default class Time extends EventEmitter {
    constructor() {
        super();
        this.start = performance.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16;

        this.update = this.update.bind(this);
        window.requestAnimationFrame(this.update);
    }

    update(now) {
        this.delta = now - this.current;
        this.current = now;
        this.elapsed = this.current - this.start;
        this.emit("update");
        window.requestAnimationFrame(this.update);
    }
}
