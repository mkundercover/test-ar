import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
// Debug UI
const debugDiv = document.createElement('div');
debugDiv.style.position = 'absolute';
debugDiv.style.top = '10px';
debugDiv.style.left = '10px';
debugDiv.style.color = 'white';
debugDiv.style.backgroundColor = 'rgba(0,0,0,0.5)';
debugDiv.style.padding = '10px';
debugDiv.style.zIndex = '9999';
document.body.appendChild(debugDiv);
function log(msg) {
    debugDiv.innerHTML += msg + '<br>';
    console.log(msg);
}
log("Script caricato.");
let camera;
let scene;
let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
function init() {
    log("Inizializzazione Three.js...");
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
    log("Aggiunta ARButton...");
    const button = ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] });
    document.body.appendChild(button);
    const loader = new GLTFLoader();
    // Path relativo per garantire compatibilità con base path
    const modelUrl = new URL('../assets/models/animated_butterfly_fucsia.glb', import.meta.url).href;
    log("Caricamento modello: " + modelUrl);
    loader.load(modelUrl, (gltf) => {
        log("Modello caricato!");
        scene.add(gltf.scene);
    }, undefined, (error) => {
        log("Errore caricamento: " + error.message);
    });
}
init();
renderer.setAnimationLoop((timestamp, frame) => {
    renderer.render(scene, camera);
});
