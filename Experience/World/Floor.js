import * as THREE from "three";
import Experience from "../Experience.js";

export default class Floor {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.setFloor();
        this.setCircles();
    }

    setFloor() {
        this.geometry = new THREE.PlaneGeometry(100, 100);
        this.material = new THREE.MeshStandardMaterial({
            color: 0xffe6a2,
            side: THREE.BackSide,
        });
        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.plane);
        this.plane.rotation.x = Math.PI / 2;
        this.plane.position.y = -0.3;
        this.plane.receiveShadow = true;
    }

    setCircles() {
        const geometry = new THREE.CircleGeometry(5, 64);
        const make = (color, y, x = 0) => {
            const circle = new THREE.Mesh(
                geometry,
                new THREE.MeshStandardMaterial({ color })
            );
            circle.position.set(x, y, 0);
            circle.scale.set(0, 0, 0);
            circle.rotation.x = -Math.PI / 2;
            circle.receiveShadow = true;
            this.scene.add(circle);
            return circle;
        };

        // One circle per section; each sits just above the previous one
        this.circleFirst = make(0xffd966, -0.29);
        this.circleSecond = make(0x8395cd, -0.28, 2);
        this.circleThird = make(0x7ad0ac, -0.27);
        this.circleFourth = make(0xf4a261, -0.26, -2);
    }
}
