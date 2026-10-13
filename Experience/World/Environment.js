import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";

const THEMES = {
    light: { color: { r: 1, g: 1, b: 1 }, intensity: 1 },
    dark: {
        color: { r: 0.17254901960784313, g: 0.23137254901960785, b: 0.6862745098039216 },
        intensity: 0.78,
    },
};

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.setSunlight();
    }

    setSunlight() {
        this.sunLight = new THREE.DirectionalLight("#ffffff", 1);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 20;
        this.sunLight.shadow.mapSize.set(1024, 1024);
        this.sunLight.shadow.normalBias = 0.05;

        this.sunLight.position.set(1.5, 7, 3);
        this.scene.add(this.sunLight);

        this.ambientLight = new THREE.AmbientLight("#ffffff", 1);
        this.scene.add(this.ambientLight);
    }

    switchTheme(theme, instant = false) {
        const { color, intensity } = THEMES[theme];
        const duration = instant ? 0 : 0.5;
        for (const light of [this.sunLight, this.ambientLight]) {
            GSAP.to(light.color, { ...color, duration });
            GSAP.to(light, { intensity, duration });
        }
    }
}
