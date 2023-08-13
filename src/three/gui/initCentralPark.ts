
import { useDraggleObjects, useGltfLoader, useModels, useScene } from "../init";

import * as THREE from 'three'
import { createBoundingBoxMesh } from "./utils";

export const initCentralPark = () => {

    addFence()

}



const addFence = () => {
    
    const scene = useScene()
    const models = useModels()
    const draggleObjects = useDraggleObjects()

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
        fence.scale.set(2,2,2)
        fence.position.set(i.position.x, i.position.y, i.position.z)
        if(i.rotation) {
            fence.rotation.set(i.rotation.x, i.rotation.y, i.rotation.z)
        }
        scene.add(fence)
        createBoundingBoxMesh(fence, i.position)
    }

    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(40, 1, 60),
        new THREE.MeshStandardMaterial({color: 'yellow'}),
    )
    cube.position.set(0, 0, 0)
    scene.add(cube)
    // addPhysics({mesh:fence, rigidBodyType:"fixed", colliderType: 'cuboid'})
}