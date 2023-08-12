import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { Pass } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import TickManager from './controllers/tick-manager'

// wasm
import Rapier from '@dimforge/rapier3d'

import { _addCapsule } from './controllers/utils/meshes'
import GeneralLoader from './loaders/general-loader'
import InitRapier from './physics/RAPIER'
import { type PhysicsObject } from './physics/physics'
import { GRAVITY } from './physics/utils/constants'
import { init3DWorld } from './gui/init'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {Character} from './controllers/character-controller';


let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  renderTarget: THREE.WebGLRenderTarget,
  // composer: EffectComposer,
  controls: any,
  stats: Stats,
  renderWidth: number,
  renderHeight: number,
  renderAspectRatio: number,
  gltfLoader: GLTFLoader,
  textureLoader: THREE.TextureLoader,
  generalLoader: GeneralLoader,
  RAPIER: typeof Rapier,
  physicsWorld: Rapier.World,
  physicsObjects: Array<PhysicsObject>
  
const size = {width: window.innerWidth -100, height: window.innerHeight - 100}

const renderTickManager = new TickManager()

export const initEngine = async () => {
  // physics -> Rapier
  RAPIER = await InitRapier()
  physicsWorld = new RAPIER.World(GRAVITY)
  physicsObjects = [] // initializing physics objects array

  // rendering -> THREE.js
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(30, size.width / size.height, 0.1, 2000);
  camera.position.set(0, 13, -50)
  // scene.fog = new THREE.Fog('black', 0, 100000);


  controls = new OrbitControls( camera, renderer.domElement );
  controls.update();

  renderer.setSize(size.width, size.height)
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 5;
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


  init3DWorld();

  const character = new Character();

  stats = Stats()
  document.body.appendChild(stats.dom)


  // controls
  const capsule = _addCapsule(1.5, 0.5, 10, 10)
  // controls = new AvatarController(capsule, camera)

  // config
  generalLoader = new GeneralLoader()

  gltfLoader = new GLTFLoader()
  textureLoader= new THREE.TextureLoader()

  renderTickManager.startLoop()
}

export const useRenderer = () => renderer

export const useRenderSize = () => ({ width: renderWidth, height: renderHeight })

export const useScene = () => scene

export const useCamera = () => camera

export const useControls = () => controls

export const useStats = () => stats

export const useRenderTarget = () => renderTarget

// export const useComposer = () => composer


// export const addPass = (pass: Pass) => {
//   composer.addPass(pass)
// }

export const useTick = (fn: Function) => {
  if (renderTickManager) {
    const _tick = (e: any) => {
      fn(e.data)
    }
    renderTickManager.addEventListener('tick', _tick)
  }
}

export const useGltfLoader = () => gltfLoader
export const useTextureLoader = () => textureLoader
export const useLoader = () => generalLoader
export const usePhysics = () => physicsWorld
export const usePhysicsObjects = () => physicsObjects

export { RAPIER }
