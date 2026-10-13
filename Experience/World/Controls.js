import Experience from "../Experience.js";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";

GSAP.registerPlugin(ScrollTrigger);

// Each ".xxx-move" spacer drives one camera/room transition as it scrolls past
const moveTrigger = (trigger) => ({
    scrollTrigger: {
        trigger,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        invalidateOnRefresh: true,
    },
});

export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.camera = this.experience.camera.orthographicCamera;
        this.room = this.experience.world.room.actualRoom;
        this.floor = this.experience.world.floor;

        this.setScrollTrigger();
    }

    setScrollTrigger() {
        const mm = GSAP.matchMedia();

        mm.add("(min-width: 969px)", () => {
            this.camera.position.set(0, 6.7, 9);
            this.room.position.set(0, 0, 0);
            this.room.scale.set(0.64, 0.64, 0.64);

            // About: room slides right
            GSAP.timeline(moveTrigger(".first-move"))
                .to(this.room.position, { x: 2.5, z: () => window.innerHeight * 0.00005 }, "same")
                .to(this.room.scale, { x: 0.5, y: 0.5, z: 0.5 }, "same");

            // Experience: room slides left
            GSAP.timeline(moveTrigger(".second-move")).to(this.room.position, {
                x: -2.5,
                z: () => window.innerHeight * 0.0015,
            });

            // Projects: camera pans so the room sits on the right
            GSAP.timeline(moveTrigger(".third-move")).to(this.camera.position, {
                x: -5,
                y: 6.5,
            });

            // Contact: camera pans back so the room sits on the left
            GSAP.timeline(moveTrigger(".fourth-move")).to(this.camera.position, {
                x: 0,
            });
        });

        mm.add("(max-width: 968px)", () => {
            // Fit the room to narrow portrait screens instead of cropping it
            const scale = Math.min(0.4, (window.innerWidth / window.innerHeight) * 0.6);
            this.room.scale.set(scale, scale, scale);
            this.room.position.set(0, 0, 0);
            this.camera.position.set(0, 6.5, 10);

            GSAP.timeline(moveTrigger(".first-move")).to(this.room.scale, {
                x: 0.25,
                y: 0.25,
                z: 0.25,
            });

            GSAP.timeline(moveTrigger(".second-move")).to(this.room.position, {
                x: 1.5,
            });

            GSAP.timeline(moveTrigger(".third-move")).to(this.room.position, {
                x: -1.5,
            });

            GSAP.timeline(moveTrigger(".fourth-move")).to(this.room.position, {
                x: 0,
            });
        });

        mm.add("all", () => {
            document.querySelectorAll(".section").forEach((section) => {
                const side = section.classList.contains("right") ? "Left" : "Right";

                GSAP.to(section, {
                    [`borderTop${side}Radius`]: 10,
                    scrollTrigger: {
                        trigger: section,
                        start: "top bottom",
                        end: "top top",
                        scrub: 0.6,
                    },
                });
                GSAP.to(section, {
                    [`borderBottom${side}Radius`]: 700,
                    scrollTrigger: {
                        trigger: section,
                        start: "bottom bottom",
                        end: "bottom top",
                        scrub: 0.6,
                    },
                });
                GSAP.from(section.querySelector(".progress-bar"), {
                    scaleY: 0,
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        pin: section.querySelector(".progress-wrapper"),
                        pinSpacing: false,
                    },
                });
            });

            const circles = [
                [".first-move", this.floor.circleFirst],
                [".second-move", this.floor.circleSecond],
                [".third-move", this.floor.circleThird],
                [".fourth-move", this.floor.circleFourth],
            ];
            for (const [trigger, circle] of circles) {
                GSAP.timeline(moveTrigger(trigger)).to(circle.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                });
            }

            GSAP.timeline(moveTrigger(".second-move")).to(this.room.position, {
                y: 0.7,
            });
        });
    }
}
