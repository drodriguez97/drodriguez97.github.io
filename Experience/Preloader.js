import Experience from "./Experience.js";
import GSAP from "gsap";

export default class Preloader {
    constructor() {
        this.experience = new Experience();
        this.world = this.experience.world;
        this.resources = this.experience.resources;
        this.arrow = document.querySelector(".arrow-svg-wrapper");

        this.world.on("worldready", () => this.playIntro());
        // Never leave visitors stuck behind the loader if the model fails
        this.resources.on("error", () => this.playIntro());

        window.addEventListener("scroll", () => this.updateArrow(), {
            passive: true,
        });
    }

    updateArrow() {
        if (!this.introDone) return;
        this.arrow.style.opacity = window.scrollY > 50 ? 0 : 1;
    }

    playIntro() {
        if (this.introStarted) return;
        this.introStarted = true;

        GSAP.timeline()
            .to(".preloader", {
                opacity: 0,
                delay: 0.3,
                onComplete: () => {
                    document.querySelector(".preloader").classList.add("hidden");
                },
            })
            .to(".toggle-bar", { opacity: 1 }, "same")
            .to(
                this.arrow,
                {
                    opacity: window.scrollY > 50 ? 0 : 1,
                    onComplete: () => {
                        this.introDone = true;
                        this.arrow.style.transition = "opacity 0.3s";
                    },
                },
                "same"
            );
    }
}
