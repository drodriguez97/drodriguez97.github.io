import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";

const BASE_ROTATION = 0.65;

export default class Room {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.actualRoom = this.resources.items.room.scene;

        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        };

        this.setModel();
        this.onMouseMove();
    }

    setModel() {
        this.actualRoom.traverse((child) => {
            if (!child.isMesh) return;
            child.castShadow = true;
            child.receiveShadow = true;

            if (child.name === "Screen") {
                child.material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.screen,
                });
            }
        });

        this.scene.add(this.actualRoom);
        this.actualRoom.scale.set(0.64, 0.64, 0.64);
        this.actualRoom.rotation.y = BASE_ROTATION;
    }

    onMouseMove() {
        // Subtle parallax for mouse users only; touch devices have no hover
        if (!window.matchMedia("(hover: hover)").matches) return;

        window.addEventListener(
            "mousemove",
            (e) => {
                const offset = (e.clientX - window.innerWidth / 2) / window.innerWidth;
                this.lerp.target = offset * 0.3;
            },
            { passive: true }
        );
    }

    update() {
        if (Math.abs(this.lerp.target - this.lerp.current) < 0.0001) return;
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );
        this.actualRoom.rotation.y = BASE_ROTATION + this.lerp.current;
    }
}
