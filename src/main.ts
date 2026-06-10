import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
const butterflies: THREE.Group[] = [];

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Bottone AR
    document.body.appendChild(ARButton.createButton(renderer, { 
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
        domOverlay: { root: document.body }
    }));

    // Carica modello
    const loader = new GLTFLoader();
    loader.load('./assets/models/animated_butterfly_fucsia.glb', (gltf) => {
        const model = gltf.scene;
        for (let i = 0; i < 50; i++) {
            const b = model.clone();
            b.scale.set(0.2, 0.2, 0.2);
            // Tunnel: 28m lunghezza, 5m larghezza, Y 1-3m
            b.position.set(
                (Math.random() - 0.5) * 28,
                Math.random() * 2 + 1,
                (Math.random() - 0.5) * 5 - 5
            );
            scene.add(b);
            butterflies.push(b);
        }
    });

    renderer.setAnimationLoop(animate);
}

function animate(timestamp: number, frame: any) {
    // Sciame movimento
    butterflies.forEach(b => {
        b.position.x -= 0.05;
        if (b.position.x < -14) b.position.x = 14;
    });
    renderer.render(scene, camera);
}

init();
