import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';

// 8th Wall si inizializza tramite l'SDK globale caricato nell'HTML
// Assicurati di sostituire YOUR_8THWALL_APP_KEY in index.html

const initAR = () => {
  const xrScene = (window as any).XR8.Threejs.xrScene();
  const { scene, camera, renderer } = xrScene;

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

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
};

const onxrloaded = () => {
  (window as any).XR8.addCameraPipelineModules([
    (window as any).XR8.Threejs.xrPipelineModule(),
    (window as any).XR8.XrController.xrPipelineModule(),
    (window as any).XRExtras.AlmostThere.pipelineModule(),
    (window as any).XRExtras.RuntimeError.pipelineModule(),
  ]);
  
  (window as any).XR8.run({ canvas: document.querySelector('canvas') });
};

window.onload = () => {
  (window as any).XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded);
};
