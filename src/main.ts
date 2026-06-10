// 1. Registrazione Componente Personalizzato per il Colore
(AFRAME as any).registerComponent('butterfly-color', {
  schema: { color: { type: 'color', default: '#ce0058' } },
  init: function () { this.el.addEventListener('model-loaded', () => this.applyColor()); },
  update: function () { this.applyColor(); },
  applyColor: function () {
    const mesh = this.el.getObject3D('mesh');
    if (!mesh) return;
    const newColor = new (THREE as any).Color(this.data.color);
    newColor.convertSRGBToLinear();
    mesh.traverse((node: any) => {
      if (node.isMesh && node.material && node.material.name === 'Wings') {
        node.material.color.copy(newColor);
        node.material.emissive.copy(newColor); 
        node.material.emissiveIntensity = 15;        
      }
    });
  }
});

let experienceRequested = false;

// 2. Gestione Ibrida
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

window.addEventListener('load', () => {
    if (isIOS) {
        document.getElementById('ios-view')!.style.display = 'block';
        document.getElementById('overlay')!.classList.add('hidden');
    } else {
        document.getElementById('android-view')!.style.display = 'block';
        const startBtn = document.getElementById('start-btn');
        const overlay = document.getElementById('overlay');
        const swarm = document.querySelector('#swarm');
        const scene = document.querySelector('a-scene');

        startBtn!.addEventListener('click', () => {
            experienceRequested = true;
            overlay!.classList.add('hidden');
        });

        // Garantisce che lo sciame parta SOLO quando AR.js è pronto
        scene!.addEventListener('arjs-video-loaded', () => {
            if (experienceRequested) {
                createSwarm(swarm!);
            }
        });
    }
});

// 3. Logica dello Sciame (Android)
function createSwarm(swarmContainer: Element) {
  const numButterflies = 90;
  const tunnelLength = 28; 
  const tunnelWidth = 7.5;
  const tunnelHeight = 3.3;
  const groundOffset = 0.5;
  const povDistance = 1;

  const rows = 12; 
  const cols = 13;
  
  let grid: {y: number, z: number}[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      grid.push({ 
        y: (r / (rows - 1)) * tunnelHeight + groundOffset,
        z: -((c / (cols - 1)) * tunnelWidth + povDistance)
      });
    }
  }
  grid.sort(() => Math.random() - 0.5);

  for (let i = 0; i < numButterflies; i++) {
    let butterfly = document.createElement('a-entity');
    const slot = grid[i % grid.length];
    
    butterfly.setAttribute('gltf-model', '#butterflyModel');
    butterfly.setAttribute('animation-mixer', 'clip: Flying');
    butterfly.setAttribute('scale', '0.2 0.15 0.2');
    butterfly.setAttribute('butterfly-color', 'color: #ce0058');

    const resetButterfly = (el: any, isFirstSpawn = false) => {
      const startX = tunnelLength / 2;
      const endX = -(tunnelLength / 2);
      const currentSpawnX = isFirstSpawn ? (Math.random() * tunnelLength - startX) : startX;
      
      const moveDuration = Math.random() * 4000 + 10000;
      const distanceRatio = isFirstSpawn ? Math.abs(currentSpawnX - endX) / tunnelLength : 1;
      const currentDuration = moveDuration * distanceRatio;

      el.setAttribute('position', `${currentSpawnX} ${slot.y} ${slot.z}`);
      el.setAttribute('rotation', '0 -90 0');
      
      el.setAttribute('animation__move', {
        property: 'position', 
        to: `${endX} ${slot.y} ${slot.z}`,
        dur: currentDuration, 
        easing: 'linear'
      });
      
      el.setAttribute('animation__color', {
        property: 'butterfly-color.color', 
        from: '#ce0058', 
        to: '#fe5000',
        dur: currentDuration * 0.5, 
        easing: 'linear',
        loop: false
      });
    };

    butterfly.addEventListener('animationcomplete__move', () => {
      resetButterfly(butterfly, false);
    });

    swarmContainer.appendChild(butterfly);
    resetButterfly(butterfly, true);
  }
}
