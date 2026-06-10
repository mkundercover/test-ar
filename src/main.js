import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
const onxrloaded = () => {
    window.XR8.addCameraPipelineModules([
        window.XR8.Threejs.xrPipelineModule(),
        window.XR8.XrController.xrPipelineModule(),
        window.XRExtras.AlmostThere.pipelineModule(),
        window.XRExtras.RuntimeError.pipelineModule(),
    ]);
    const canvas = document.getElementById('camerafeed');
    window.XR8.run({ canvas });
    const { scene, camera, renderer } = window.XR8.Threejs.xrScene();
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);
    const loader = new GLTFLoader();
    const modelUrl = new URL('./assets/models/animated_butterfly_fucsia.glb', import.meta.url).href;
    loader.load(modelUrl, (gltf) => {
        const butterfly = gltf.scene;
        butterfly.scale.set(0.1, 0.1, 0.1);
        scene.add(butterfly);
        if (gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(butterfly);
            gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
        }
    });
};
window.onload = () => {
    window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded);
};
