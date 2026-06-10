import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

if (isIOS) {
    document.getElementById('ios-view')!.style.display = 'block';
} else {
    document.getElementById('android-view')!.style.display = 'block';
    
    // Logica WebXR (Android)
    document.getElementById('start-btn')!.addEventListener('click', () => {
        document.getElementById('start-btn')!.style.display = 'none';
        startAndroidAR();
    });
}

function startAndroidAR() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.getElementById('android-view')!.appendChild(renderer.domElement);
    document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const loader = new GLTFLoader();
    loader.load('./assets/models/animated_butterfly_fucsia.glb', (gltf) => {
        for (let i = 0; i < 20; i++) {
            const b = gltf.scene.clone();
            b.position.set(Math.random() * 4 - 2, Math.random() * 2 - 1, -Math.random() * 5 - 2);
            scene.add(b);
        }
    });

    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });
}
