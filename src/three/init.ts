import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { Pass } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'

// wasm
// import Rapier from '@dimforge/rapier3d'

import GeneralLoader from './loaders/general-loader'

// import { GRAVITY } from './physics/utils/constants'
import { animateStars, init3DWorld } from './gui/init'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  controls: any,
  stats: Stats,
  gltfLoader: GLTFLoader,
  textureLoader: THREE.TextureLoader,
  generalLoader: GeneralLoader

const animatingModels: any = []
const size = {width: window.innerWidth, height: window.innerHeight}
const keysPressed:any = {}


let selectedObject:any;



export const initEngine = async () => {

    // r150
// THREE.ColorManagement.enabled = true;

// r139-r149
// THREE.ColorManagement.legacyMode = false;



  // rendering -> THREE.js
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });


  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(30, size.width / size.height, 0.1, 2000);
  camera.position.set(0, 0, -1)
  // scene.fog = new THREE.Fog('black', 0, 100000);


  controls = new OrbitControls( camera, renderer.domElement );
  controls.update();
  // Set initial distance from the model
  // const initialDistance = 10;
  // controls.distance = initialDistance;

  // Enable damping for smoother movement
  // controls.enableDamping = true;
  // controls.dampingFactor = 0.05;


  renderer.setSize(size.width, size.height)
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  // renderer.toneMapping = THREE.LinearToneMapping;
  // renderer.toneMapping = THREE.ReinhardToneMapping
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  let canvas = document.querySelector('.canvas')
  if(canvas){
      if(canvas.firstChild)canvas.removeChild(canvas.firstChild)
      canvas.appendChild(renderer.domElement)
  } 
  // canvas.innerHTML(this.renderer.domElement)
  else{
      canvas = document.createElement('div')
      canvas.classList.add('canvas')
      canvas.appendChild(renderer.domElement)
      document.body.appendChild(canvas);
  }



  stats = Stats()
  document.body.appendChild(stats.dom)

  // config
  generalLoader = new GeneralLoader()

  gltfLoader = new GLTFLoader()
  


  textureLoader= new THREE.TextureLoader()

  init3DWorld();
  startRenderLoop();

  return {
    scene, 
  }

}


const startRenderLoop = () => {
  
  const renderLoop = () => {
    // console.log(stars)
    stats.update()
    controls.update()
    animateStars()
    renderer.render(scene, camera)
    requestAnimationFrame(renderLoop)
  }
  renderLoop()
}
 

export const useRenderer = () => renderer

export const useScene = () => scene

export const useCamera = () => camera

export const useControls = () => controls

export const useStats = () => stats





export const useGltfLoader = () => gltfLoader
export const useTextureLoader = () => textureLoader
export const useLoader = () => generalLoader
export const useKeys = () => keysPressed
export const useSelectedObject = () => selectedObject
export const setSelectedObject = (obj:any) => selectedObject = obj
export const useAnimatingModels = () => animatingModels


