import * as THREE from  "https://cdn.skypack.dev/three@0.125.0";
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.125.0/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.125.0/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "https://cdn.skypack.dev/three@0.125.0/examples/jsm/loaders/DRACOLoader";
import  Stats from "https://cdn.skypack.dev/three@0.125.0/examples/js/libs/stats.min.js";


import {Character} from "./character.js";
import {World} from './generateStuff.js'
import {createBody} from './createBody'

   

const pathToModels = [
    // {name: 'OakTree', path: './models/Oak_Tree.gltf', groupName : 'trees'},
    // {name: 'PineTree', path: './models/PineTree.gltf', groupName : 'trees'},
    // {name: 'PoplarTree', path: './models/Poplar_Tree.gltf', groupName : 'trees'},
]

class ThreeMain {

    constructor(){
        this.scene = new THREE.Scene();
        this.camera
        this.controls
        this.character
        this.characterSphere
        this.physicsWorld
        this.clock = new THREE.Clock()


        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        this.loadedModels = []

        this.size = {width: window.innerWidth -100, height: window.innerHeight - 100}

        this.gameWorld

        this.keysPressed = {}

        
    }




    async init(RAPIER){
       
        let gravity = { x: 0.0, y: -9.81, z: 0.0 };
        this.physicsWorld = new RAPIER.World(gravity);

        


        this.camera = new THREE.PerspectiveCamera(30, this.size.width / this.size.height, 0.1, 2000);
        this.camera.position.set(0, 13, -50)
        this.scene.fog = new THREE.Fog('black', 0, 100000);

        this.gameWorld = new World(this.scene, this.physics)

        // const riverPlaneBB = this.gameWorld.generateRiverPlane()

        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.update();

        const characterLoaded = () => {
        }
        
        
        this.characterSphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1.5, 1.5, 1.5), new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0, transparent: true }))
        this.characterSphere.position.set(30, 5, 35)
        this.scene.add(this.characterSphere)
        
        // The gap the controller will leave between the character and its environment.
        let offset = 0.01;
        // Create the controller.
        let characterController = this.physicsWorld.createCharacterController(offset);
        console.log(characterController)

        const sphereBody = createBody(RAPIER, this.scene, this.physicsWorld, 'kinematicPositionBased', 'sphere',
        { radius: 0.7 }, { x: 4, y: 15, z: 2 },
        { x: 0, y: 1, z: 0 }, 'blue');
        this.characterSphere.body = sphereBody.rigid;
       

        this.character = new Character(this.camera, this.controls, this.characterSphere);
        this.character.loadModel(this.scene, characterLoaded)

        

    }

    loadModels(){
        const LoadingManager = new THREE.LoadingManager(()=>this.addModelsToScene())
        const gltfLoader = new GLTFLoader(LoadingManager);
        const dracoloader = new DRACOLoader();
        dracoloader.setDecoderPath('./node_modules/three/examples/js/libs/draco/gltf/');
        gltfLoader.setDRACOLoader(dracoloader);


        pathToModels.forEach(item => {
            gltfLoader.load(item.path, (model) => {
            
                if(!this.loadedModels[item.groupName]) this.loadedModels[item.groupName] = {group: new THREE.Group(), models: []}
                this.loadedModels[item.groupName].models.push(model)
            })
        })
    }


    addModelsToScene () {

        for(let modelGroup in this.loadedModels){
            
            let mGroup = this.loadedModels[modelGroup]

            if(modelGroup === 'trees'){
                // this.gameWorld.generateTrees({modelGroup: mGroup})
            }
            else if(modelGroup === 'flowers'){
                // this.gameWorld.generateFlowers({modelGroup: mGroup})
            }
            else if(modelGroup === 'grass'){
                // this.gameWorld.generateGrass({modelGroup: mGroup})
            }
            else if(modelGroup === 'rocks'){
                // gameWorld.generateRiverRocks({modelGroup: mGroup, riverBB: riverPlaneBB})
                // gameWorld.testRockPhysics({modelGroup: mGroup})
            }
            else if(modelGroup === 'fences'){
                // gameWorld.generateFences({model, item, path1BB, path2BB})
            }
            else if(modelGroup === 'island'){
                this.gameWorld.generateIsland({modelGroup: mGroup})
            }
            else if(modelGroup === 'waterfall'){
                this.gameWorld.generateWaterfall({modelGroup: mGroup})
            }
            else if(modelGroup === 'mountains'){
                this.gameWorld.generateMountains({modelGroup: mGroup})
            }
            else if(modelGroup === 'bridges'){
                this.gameWorld.generateBridge({modelGroup: mGroup})
            }
            else if(modelGroup === 'woodenSign'){
                this.gameWorld.generateWoodenSigns({modelGroup: mGroup})
            }
            else if(modelGroup === 'lamps'){
                this.gameWorld.generateLamps({modelGroup: mGroup})
            } 

            this.scene.add(mGroup.group)
                 

        }    

    }



    startRenderer() {
       
        this.renderer.setSize(this.size.width, this.size.height)
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.renderer.toneMappingExposure = 5;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        let canvas = document.querySelector('.canvas')
        if(canvas){
            if(canvas.firstChild)canvas.removeChild(canvas.firstChild)
            canvas.appendChild(this.renderer.domElement)
        } 
        // canvas.innerHTML(this.renderer.domElement)
        else{
            canvas = document.createElement('div')
            canvas.classList.add('canvas')
            canvas.appendChild(this.renderer.domElement)
            document.body.appendChild(canvas);
        }
        

    }


    renderContent(){
        
        const stats = new Stats()
        stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(stats.dom)

       
        // loop
        const animate = () => {
            
            // this.characterSphere.position.set(this.characterSphere.body.translation().x, this.characterSphere.body.translation().y, this.characterSphere.body.translation().z)
           
            let delta = this.clock.getDelta()

            this.physicsWorld.step();

            // this.physics.update(delta * 1000)
            
            // this.physics.updateDebugger()
            
            // if (this.character.characterControls) {
            //     this.character.characterControls.update(delta, this.keysPressed, this.characterSphere);
            // }

            this.renderer.setViewport(0, 0, this.size.width, this.size.height)
            this.renderer.render(this.scene, this.camera);
    
            // stats.update()
            requestAnimationFrame(animate)
          }
        requestAnimationFrame(animate)


    }

    addWindowEvents() {
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
            // keyDisplayQueue.down(event.key)
            if (event.shiftKey) {
                this.character.characterControls.switchRunToggle()
            } else {
                (this.keysPressed)[event.key.toLowerCase()] = true
            }
        }, false);
        document.addEventListener('keyup', (event) => {
            // keyDisplayQueue.up(event.key);
            (this.keysPressed)[event.key.toLowerCase()] = false
        }, false);


    }


    

}


export default ThreeMain;