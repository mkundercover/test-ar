import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    const button = ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] });
    document.body.appendChild(button);

    const loader = new GLTFLoader();
    loader.load('./assets/models/animated_butterfly_fucsia.glb', (gltf) => {
        const butterfly = gltf.scene;
        butterfly.scale.set(0.1, 0.1, 0.1);
        scene.add(butterfly);
        
        if (gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(butterfly);
            gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
        }
    }, undefined, (error) => {
        console.error('An error happened', error);
    });

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();

renderer.setAnimationLoop((timestamp: number, frame: any) => {
    renderer.render(scene, camera);
});
