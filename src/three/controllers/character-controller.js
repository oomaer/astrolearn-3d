import * as THREE from  "three";

// import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.125.0/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useCamera, useControls, useScene } from "../init";

export class Character {
    constructor() {
        this.model = null;
        this.mixer = null;
        this.camera = useCamera();
        this.controls = useControls();
        this.animationsMap = new Map()
        this.characterControls;
        this.velocity = {x: 0, z: 0}
        this.loadModel()
    }

    loadModel() {
        
        const scene = useScene();
        const funct = () => {
        
            // this.characterControls = new CharacterControls(this.model, this.mixer, this.animationsMap, this.camera, this.controls,  'Idle')
        }

        //initialze gltf loader
        const LoadingManager = new THREE.LoadingManager(funct)
        const gltfLoader = new GLTFLoader(LoadingManager);

        gltfLoader.load('models/character/Cowboy_Male.gltf', (model) => {
           
            model.scene.position.set(0, 0, 1)
            model.scene.traverse(function (object) {
                if (object.isMesh){
                    object.castShadow = true;
                    if(object.name === 'Cube004') object.material.color.set(0xFFAB27);
                    if(object.name === 'Cube004_6') object.material.color.set(0x000000);
                } 
            });

            this.model = model.scene;

            scene.add(model.scene)
            
        
            const gltfAnimations = model.animations;

            this.mixer = new THREE.AnimationMixer(model.scene);
        
            gltfAnimations.filter(a => a.name != 'TPose').forEach((a) => {
                this.animationsMap.set(a.name, this.mixer.clipAction(a))
            })
        
            
        });
        
    }

    

}


class CharacterControls {

    model
    mixer
    animationsMap = new Map() // Walk, Run, Idle
    orbitControl
    camera

    // state
    toggleRun = true
    currentAction
    
    // temporary data
    walkDirection = new THREE.Vector3()
    rotateAngle = new THREE.Vector3(0, 1, 0)
    rotateQuarternion= new THREE.Quaternion()
    cameraTarget = new THREE.Vector3()
    
    // constants
    fadeDuration = 0
    runVelocity = 15
    walkVelocity = 5

    constructor(model, mixer, animationsMap, camera, orbitControl, currentAction) {
        this.model = model
        this.mixer = mixer
        this.animationsMap = animationsMap
        this.currentAction = currentAction
        this.animationsMap.forEach((value, key) => {
            if (key == currentAction) {
                value.play()
            }
        })
        this.orbitControl = orbitControl
        this.camera = camera
        this.updateCameraTarget(0,0)
        this.DIRECTIONS = ['forward', 'backward', 'right', 'left']
        this.keyBidings = {'forward': 'arrowup', 'backward': 'arrowdown', 'left': 'arrowleft', 'right': 'arrowright'}
        this.prevZ = 0
    }

    switchRunToggle() {
        this.toggleRun = !this.toggleRun
    }

    update(delta, keysPressed, characterSphere) {
        
        
        this.model.position.x = characterSphere.position.x
        this.model.position.z = characterSphere.position.z
        this.model.position.y = characterSphere.position.y - 1.5


        const directionPressed = this.DIRECTIONS.some(direction => keysPressed[this.keyBidings[direction]] == true)

        var play = '';
        if (directionPressed && this.toggleRun) {
            play = 'Run'
        } else if (directionPressed) {
            play = 'Walk'
        } else {
            play = 'Idle'
        }


        if (this.currentAction != play) {
            const toPlay = this.animationsMap.get(play)
            // toPlay.timeScale = 8
            const current = this.animationsMap.get(this.currentAction)

            current.clampWhenFinished = true;
            current.fadeOut(this.fadeDuration)
            toPlay.clampWhenFinished = true;
            toPlay.reset().fadeIn(this.fadeDuration).play();
            
            this.currentAction = play
        }

        this.mixer.update(delta)

        if (this.currentAction == 'Run' || this.currentAction == 'Walk') {
            // calculate towards camera direction
            var angleYCameraDirection = Math.atan2(
                    (this.camera.position.x - this.model.position.x), 
                    (this.camera.position.z - this.model.position.z))
            // diagonal movement angle offset
            var directionOffset = this.directionOffset(keysPressed)

            // rotate model
            this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffset)
            this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.2)

            // calculate direction
            this.camera.getWorldDirection(this.walkDirection)
            this.walkDirection.y = 0
            this.walkDirection.normalize()
            this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset)

            // run/walk velocity
            const velocity = this.currentAction == 'Run' ? this.runVelocity : this.walkVelocity

            // move model & camera
            const moveX = this.walkDirection.x * -velocity * delta
            let moveZ = this.walkDirection.z * -velocity * delta
    
            // characterSphere.position.x += moveX
            // characterSphere.position.z += moveZ

            const translation = characterSphere.body.translation();
            characterSphere.body.setNextKinematicTranslation({x: translation.x + moveX, y: translation.y, z: translation.z + moveZ})

    
            if(Math.round(characterSphere.position.z * 1000) / 1000 === Math.round(this.prevZ * 1000) / 1000) {
                moveZ = 0
            }
            this.prevZ = characterSphere.position.z
            this.updateCameraTarget(moveX, moveZ)
        }
        else{
            // characterSphere.body.setNextKinematicTranslation(characterSphere.position.x, characterSphere.position.y, characterSphere.position.z)
            // characterSphere.body.setVelocityX(0)
            // characterSphere.body.setVelocityY(-10)
            // characterSphere.body.setVelocityZ(0)
        }
    }

    updateCameraTarget( moveX, moveZ) {
        // move camera
        this.camera.position.x += moveX 
        this.camera.position.z += moveZ 

        // update camera target
        this.cameraTarget.x = this.model.position.x
        this.cameraTarget.y = this.model.position.y + 1
        this.cameraTarget.z = this.model.position.z
        this.orbitControl.target = this.cameraTarget
    }

    // directionOffset(keysPressed) {
    //     var directionOffset = 0 // w

    //     if (keysPressed['arrowup']) {
    //         if (keysPressed['arrowleft']) {
    //             directionOffset = Math.PI / 4 // w+a
    //         } else if (keysPressed['arrowright']) {
    //             directionOffset = - Math.PI / 4 // w+d
    //         }
    //     } else if (keysPressed['arrowdown']) {
    //         if (keysPressed['arrowleft']) {
    //             directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
    //         } else if (keysPressed['arrowright']) {
    //             directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d
    //         } else {
    //             directionOffset = Math.PI // s
    //         }
    //     } else if (keysPressed['arrowleft']) {
    //         directionOffset = Math.PI / 2 // a
    //     } else if (keysPressed['arrowright']) {
    //         directionOffset = - Math.PI / 2 // d
    //     }

    //     return directionOffset
    // }

    directionOffset(keysPressed) {
        var directionOffset =  0// w

        if (keysPressed['arrowdown']) {
            if (keysPressed['arrowright']) {
                directionOffset = Math.PI / 4 // w+a
            } else if (keysPressed['arrowleft']) {
                directionOffset = - Math.PI / 4 // w+d
            }
        } else if (keysPressed['arrowup']) {
            if (keysPressed['arrowright']) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
            } else if (keysPressed['arrowleft']) {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d
            } else {
                directionOffset = Math.PI // s
            }
        } else if (keysPressed['arrowright']) {
            directionOffset = Math.PI / 2 // a
        } else if (keysPressed['arrowleft']) {
            directionOffset = - Math.PI / 2 // d
        }

        return directionOffset
    }

}



