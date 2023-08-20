import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { Pass } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import TickManager from './controllers/tick-manager'

// wasm
// import Rapier from '@dimforge/rapier3d'

import GeneralLoader from './loaders/general-loader'
// import InitRapier from './physics/RAPIER'
import { type PhysicsObject } from './physics/physics'
// import { GRAVITY } from './physics/utils/constants'
import { addCharacter, init3DWorld } from './gui/init'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {DragControls} from 'three/examples/jsm/controls/DragControls.js'

import { AmmoPhysics } from '@enable3d/ammo-physics'
import { loadAllModels, useModels } from './gui/loadModels'
import { initEditor } from './gui/domEditor/sceneEditor'

let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  renderTarget: THREE.WebGLRenderTarget,
  controls: any,
  stats: Stats,
  renderWidth: number,
  renderHeight: number,
  gltfLoader: GLTFLoader,
  textureLoader: THREE.TextureLoader,
  generalLoader: GeneralLoader,
  physicsWorld: AmmoPhysics,
  physicsObjects: Array<PhysicsObject>,
  character: any

const draggableObjects: any = []
const debugMode = false;
const size = {width: window.innerWidth, height: window.innerHeight}
const keysPressed:any = {}


let selectedObject:any;



let rayCaster:any;
const renderTickManager = new TickManager()

export const initEngine = async () => {


  physicsObjects = [] // initializing physics objects array

  // rendering -> THREE.js
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  rayCaster = new THREE.Raycaster()
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(30, size.width / size.height, 0.1, 2000);
  camera.position.set(0, 13, -50)
  // scene.fog = new THREE.Fog('black', 0, 100000);

  physicsWorld = new AmmoPhysics(scene);
  // (physicsWorld as any).debug.enable()

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
  // renderer.toneMapping = THREE.ReinhardToneMapping;
  // renderer.toneMappingExposure = 5;
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

  const models = await loadAllModels()

  init3DWorld();
  character = addCharacter();
  addWindowEvents();

  addDragControls()
  renderTickManager.startLoop()

  return {
    models, scene, draggableObjects
  }

}



const addDragControls = () => {
  const models = useModels();
  const dragControls = new DragControls( draggableObjects, camera, renderer.domElement );
  dragControls.addEventListener( 'dragstart', function (e) {
    if(selectedObject) selectedObject.visible = false; //hide previous selected object
    e.object.visible = true; //show new selected object

    //update dom input fields
    (document.getElementById("show-wireframe") as HTMLInputElement).checked = true;
    (document.getElementById("rotation") as HTMLInputElement).value = e.object.model.rotation.y; 

    (document.getElementById("scale") as HTMLInputElement).value = e.object.model.scale.x;
    (document.getElementById("position") as HTMLElement).innerHTML = e.object.model.position.x.toFixed(2) + ", " + e.object.model.position.y.toFixed(2) + ", " + e.object.model.position.z.toFixed(2);
    selectedObject = e.object;
    //disable orbit controls
    controls.enabled = false; 
  } );
  dragControls.addEventListener( 'drag', onDragEvent );
  dragControls.addEventListener( 'dragend', function (e) { 
    controls.enabled = true;  
    e.object.model.position.set(e.object.position.x, e.object.position.y, e.object.position.z)
    // (document.getElementById("position") as HTMLElement).innerHTML = e.object.position.x.toFixed(2) + ", " + e.object.position.y.toFixed(2) + ", " + e.object.position.z.toFixed(2);
    // console.log(models[e.object.name].instances, e.object.index);
    models[e.object.name].instances[e.object.index].position = {x: e.object.position.x, y: e.object.position.y, z: e.object.position.z}
  });
 

  const mouse = new THREE.Vector2();
  const canvas = renderer.domElement;
  const canvasPosition = canvas.getBoundingClientRect();
  function onMouseMove(e:any) {
    mouse.x = ((e.clientX - canvasPosition.left) / canvas.width) * 2 - 1;
    mouse.y = -((e.clientY - canvasPosition.top) / canvas.height) * 2 + 1;
  }
  window.addEventListener( 'mousemove', onMouseMove, false );

  function onDragEvent(e:any) {
    rayCaster.setFromCamera(mouse, camera);
   
    const ground = scene.getObjectByName('ground')
    
    const intersects = rayCaster.intersectObject(ground, true);
    
    if (intersects.length > 0){
      e.object.position.set(intersects[0].point.x, 0, intersects[0].point.z);
    }

  }

}

export const useRenderer = () => renderer

export const useRenderSize = () => ({ width: renderWidth, height: renderHeight })

export const useScene = () => scene

export const useCamera = () => camera

export const useControls = () => controls

export const useStats = () => stats

export const useRenderTarget = () => renderTarget

export const useDraggableObjects = () => draggableObjects

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
export const useDebugMode = () => debugMode
export const useCharacter = () => character
export const useKeys = () => keysPressed
export const useSelectedObject = () => selectedObject
export const setSelectedObject = (obj:any) => selectedObject = obj

export { physicsWorld }


const addWindowEvents = () => {
  //DOM EVENTS
  // const onColorChange = (event) => {
  //     console.log(event.target.value)
  //     console.log(ground)
  //     ground.material.toneMapped = false
  //     ground.material.color.set(event.target.value)
  //     ground.material.needsUpdate = true

  // }

  // --- ON RESIZE
  // const onResize = () => {
  //     this.size.width = window.innerWidth;
  //     this.size.height = window.innerHeight;

   
  //     this.camera.aspect = this.size.width / this.size.height;
  //     this.camera.updateProjectionMatrix();


  //     this.renderer.setSize(this.size.width, this.size.height)
  //     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))	
  // }


  // window.addEventListener('resize', onResize)
  // onResize();


  // CONTROL KEYS
  document.addEventListener('keydown', (event) => {
      if (event.shiftKey) {
          character.characterControls.switchRunToggle()
      } else {
          (keysPressed)[event.key.toLowerCase()] = true
      }
  }, false);
  document.addEventListener('keyup', (event) => {
      (keysPressed)[event.key.toLowerCase()] = false
  }, false);


  const mousePosition = new THREE.Vector2();
  function getClicked3DPoint(evt:any) {
    evt.preventDefault();

    const canvas = renderer.domElement;
    const canvasPosition = canvas.getBoundingClientRect();

    mousePosition.x = ((evt.clientX - canvasPosition.left) / canvas.width) * 2 - 1;
    mousePosition.y = -((evt.clientY - canvasPosition.top) / canvas.height) * 2 + 1;

    rayCaster.setFromCamera(mousePosition, camera);
    const ground = scene.getObjectByName('ground')
    
    const intersects = rayCaster.intersectObject(ground, true);
    
    if (intersects.length > 0)
      console.log(intersects[0].point);
  };

  
  // window.addEventListener( 'click', getClicked3DPoint );




  //DOM EDIT EVENTS 
  initEditor()
  

}



const domThreeWorldPosition = (pos:any) => {
  const canvas = renderer.domElement
  const x = ( (pos.x - canvas.offsetLeft) / canvas.clientWidth ) * 2 - 1;
  const y = ( (pos.y - canvas.offsetTop) / canvas.clientHeight ) * -2 + 1;

  const vector = new THREE.Vector3(x, y, 0.5);
  vector.unproject( camera );
  const dir = vector.sub( camera.position ).normalize();
  const distance = - camera.position.z / dir.z;
  return camera.position.clone().add( dir.multiplyScalar( distance ) );

}