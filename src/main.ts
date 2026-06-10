import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';

// Sciame: configurazione
const BUTTERFLY_COUNT = 20;
const butterflies: THREE.Group[] = [];

// Funzione per avviare l'AR
const startExperience = () => {
    document.getElementById('start-btn')!.style.display = 'none';
    (window as any).XR8.run({ canvas: document.getElementById('camerafeed') });
};

// Pipeline 8th Wall
const onxrloaded = () => {
    (window as any).XR8.addCameraPipelineModules([
        (window as any).XR8.Threejs.xrPipelineModule(),
        (window as any).XR8.XrController.xrPipelineModule(),
        (window as any).XRExtras.AlmostThere.pipelineModule(),
        (window as any).XRExtras.RuntimeError.pipelineModule(),
        {
            name: 'swarm-manager',
            onStart: ({ canvas }) => {
                const { scene, camera, renderer } = (window as any).XR8.Threejs.xrScene();
                setupSwarm(scene);
                
                // Loop di animazione
                renderer.setAnimationLoop(() => {
                    animateSwarm();
                    renderer.render(scene, camera);
                });
            }
        }
    ]);
};

function setupSwarm(scene: THREE.Scene) {
    const loader = new GLTFLoader();
    loader.load('./assets/models/animated_butterfly_fucsia.glb', (gltf) => {
        for (let i = 0; i < BUTTERFLY_COUNT; i++) {
            const b = gltf.scene.clone();
            b.position.set(Math.random() * 10 - 5, Math.random() * 2 - 1, -Math.random() * 10 - 2);
            scene.add(b);
            butterflies.push(b);
        }
    });
}

function animateSwarm() {
    butterflies.forEach(b => {
        b.position.x -= 0.05; // Volo da destra a sinistra
        if (b.position.x < -10) b.position.x = 10; // Reset posizione
    });
}

window.onload = () => {
    document.getElementById('start-btn')!.addEventListener('click', startExperience);
    (window as any).XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded);
};
