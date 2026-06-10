import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;

const setupScene = () => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));
};

const loadButterfly = () => {
  const loader = new GLTFLoader();
  loader.load('/assets/models/animated_butterfly_fucsia.glb', (gltf) => {
    const butterfly = gltf.scene;
    butterfly.position.set(0, 0, -2); // Posizionato davanti all'utente
    scene.add(butterfly);
  });
};

const setupUI = () => {
  const button = document.createElement('button');
  button.innerText = 'Start AR';
  button.style.position = 'absolute';
  button.style.top = '50%';
  button.style.left = '50%';
  button.style.transform = 'translate(-50%, -50%)';
  button.style.padding = '20px';
  button.style.fontSize = '20px';
  button.style.zIndex = '1000';
  document.body.appendChild(button);

  button.addEventListener('click', () => {
    button.remove();
    setupScene();
    loadButterfly();
    animate();
  });
};

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

document.addEventListener('DOMContentLoaded', () => {
  setupUI();
});
