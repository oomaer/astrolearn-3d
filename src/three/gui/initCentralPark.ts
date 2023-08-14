
import { useDraggleObjects, useModels, usePhysics, useScene } from "../init";

import * as THREE from 'three'
import { createBoundingMesh } from "./utils";
import { physicsWorld } from "../init";
import { addPhysics } from "../physics/physics";

export const initCentralPark = () => {

    const scene = useScene()
    const models = useModels()
    addFence(scene, models)
    addMysticTree(scene, models)

}



const addFence = (scene:THREE.Scene, models:any) => {  

    const fences = [
        {
            position: {x: 14, y: 0, z: 30},
        },
        {
            position: {x: -14, y: 0, z: 30},
        },
        {
            position: {x: 2, y: 0, z: 30},
        },
        {
            position: {x: 14, y: 0, z: -30},
        },
        {
            position: {x: -14, y: 0, z: -30},
        },
        {
            position: {x: -2, y: 0, z: -30},
        },
        {
            position: {x: 20, y: 0, z: 24},
            rotation: {x: 0, y: Math.PI/2, z: 0}
        },
        {
            position: {x: 20, y: 0, z: 12},
            rotation: {x: 0, y: Math.PI/2, z: 0}
        },
        {
            position: {x: 20, y: 0, z: -12},
            rotation: {x: 0, y: Math.PI/2, z: 0}
        },
        {
            position: {x: 20, y: 0, z: -24},
            rotation: {x: 0, y: Math.PI/2, z: 0}
        },
        {
            position: {x: -20, y: 0, z: 24},
            rotation: {x: 0, y: Math.PI/2, z: 0}
        },
        {
            position: {x: -20, y: 0, z: 12},
            rotation: {x: 0, y: Math.PI/2, z: 0}
        },
        {
            position: {x: -20, y: 0, z: -12},
            rotation: {x: 0, y: Math.PI/2, z: 0}
        },
        {
            position: {x: -20, y: 0, z: -24},
            rotation: {x: 0, y: Math.PI/2, z: 0}
        }
    ]

    for(const i of fences) {
        const fence = models['fence'].data.scene.clone();
        const scale = {x: 2, y: 2, z: 2}
        fence.scale.set(scale.x, scale.y, scale.z)
        fence.position.set(i.position.x, i.position.y, i.position.z)
        if(i.rotation) {
            fence.rotation.set(i.rotation.x, i.rotation.y, i.rotation.z)
        }
        scene.add(fence)
        const mesh:any = createBoundingMesh({group: fence, position: i.position,  show: false, draggable: false})
        mesh.scale.y = 5
        
        physicsWorld.add.existing(mesh)
        mesh.body.setCollisionFlags(2)
        
        // (mesh as any).body.setCollisionFlags(2)
    }

    
}



const addMysticTree = (scene: THREE.Scene, models:any) => {
    const model = models['fountain'].data.scene;
    // 11,16,17
    const group = new THREE.Group()
    console.log(model.traverse)
    model.traverse((child:any) => {
        if(child.isMesh){
            if(child.name === "mesh558070164_7" || child.name === "mesh558070164_6") return;
            group.add(child.clone())
        }
    })
    group.scale.set(15, 15, 15)
    group.position.set(0, 2, 0)
    const mesh:any = createBoundingMesh({group: group, position: group.position, show: false, draggable: false, type: "sphere"})
    mesh.position.set(mesh.position.x + 1, mesh.position.y, mesh.position.z)
    addPhysics({
        mesh: mesh,
        rigidBodyType: 'kinematic',
    })
    scene.add(group)
}