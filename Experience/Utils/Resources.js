import * as THREE from "three";
import { EventEmitter } from "events";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export default class Resources extends EventEmitter {
    constructor(assets) {
        super();
        this.assets = assets;
        this.items = {};

        this.setLoaders();
        this.startLoading();
    }

    setLoaders() {
        this.loaders = {};
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.dracoLoader = new DRACOLoader();
        this.loaders.dracoLoader.setDecoderPath("/draco/");
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
    }

    startLoading() {
        const promises = this.assets.map((asset) => {
            if (asset.type === "glbModel") {
                return this.loaders.gltfLoader
                    .loadAsync(asset.path)
                    .then((file) => [asset.name, file]);
            }
            if (asset.type === "videoTexture") {
                return [asset.name, this.loadVideoTexture(asset)];
            }
            return Promise.reject(new Error(`Unknown asset type: ${asset.type}`));
        });

        Promise.all(promises)
            .then((loaded) => {
                this.items = Object.fromEntries(loaded);
                this.loaders.dracoLoader.dispose();
                this.emit("ready");
            })
            .catch((error) => {
                console.error("Failed to load 3D assets", error);
                this.emit("error", error);
            });
    }

    loadVideoTexture(asset) {
        const video = document.createElement("video");
        video.src = asset.path;
        video.muted = true;
        video.playsInline = true;
        video.loop = true;
        video.play().catch(() => {});

        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.flipY = false;
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.generateMipmaps = false;
        videoTexture.encoding = THREE.sRGBEncoding;

        return videoTexture;
    }
}
