import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
let container;
let camera;
let scene;
let renderer = null;
function init() {
    container = document.createElement('div');
    document.body.appendChild(container);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);
    document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));
    const loader = new GLTFLoader();
    loader.load('./assets/models/animated_butterfly_fucsia.glb', (gltf) => {
        const butterfly = gltf.scene;
        butterfly.scale.set(0.1, 0.1, 0.1);
        scene.add(butterfly);
        if (gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(butterfly);
            gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
        }
    });
    window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    if (renderer)
        renderer.setSize(window.innerWidth, window.innerHeight);
}
init();
if (renderer !== null) {
    renderer.setAnimationLoop((timestamp, frame) => {
        renderer?.render(scene, camera);
    });
}
