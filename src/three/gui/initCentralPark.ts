
import { useScene } from "../init";
import { useModels } from "./loadModels";

import * as THREE from 'three'
import { createBoundingMesh, displayModelWithBoundingMesh } from "./utils";
import { physicsWorld } from "../init";
import { addPhysics } from "../physics/physics";

export const initCentralPark = () => {

    const scene = useScene()
    const models = useModels()
    
    displayModelWithBoundingMesh('fence1', models, scene)
    // addPineTress(scene, models)
    displayModelWithBoundingMesh('pineTree1', models, scene)
    displayModelWithBoundingMesh('lampPost1', models, scene)
    displayModelWithBoundingMesh('bonFire', models, scene)
    displayModelWithBoundingMesh('bench1', models, scene)
    displayModelWithBoundingMesh('ThreePlane1', models, scene)

    // addMysticTree(scene, models)
    // addMarketStalls(scene, models)
    // addSittingArea(scene, models)
    // addLampPosts(scene, models)
    // addPineTress(scene, models)

}



const addFence = (scene:THREE.Scene, models:any) => {  

    // const fences = [
    //     {
    //         position: {x: 14, y: 0, z: 30},
    //         scale: {x: 2, y: 2, z: 2}
    //     },
    //     {
    //         position: {x: -14, y: 0, z: 30},
    //         scale: {x: 2, y: 2, z: 2}
    //     },
    //     {
    //         position: {x: 2, y: 0, z: 30},
    //         scale: {x: 2, y: 2, z: 2}
    //     },
    //     {
    //         position: {x: 14, y: 0, z: -30},
    //         scale: {x: 2, y: 2, z: 2}
    //     },
    //     {
    //         position: {x: -14, y: 0, z: -30},
    //         scale: {x: 2, y: 2, z: 2}
    //     },
    //     {
    //         position: {x: -2, y: 0, z: -30},
    //         scale: {x: 2, y: 2, z: 2}
    //     },
    //     {
    //         position: {x: 20, y: 0, z: 24},
    //         scale: {x: 2, y: 2, z: 2},
    //         rotation: {x: 0, y: Math.PI/2, z: 0}
    //     },
    //     {
    //         position: {x: 20, y: 0, z: 12},
    //         scale: {x: 2, y: 2, z: 2},
    //         rotation: {x: 0, y: Math.PI/2, z: 0}
    //     },
    //     {
    //         position: {x: 20, y: 0, z: -12},
    //         scale: {x: 2, y: 2, z: 2},
    //         rotation: {x: 0, y: Math.PI/2, z: 0}
    //     },
    //     {
    //         position: {x: 20, y: 0, z: -24},
    //         scale: {x: 2, y: 2, z: 2},
    //         rotation: {x: 0, y: Math.PI/2, z: 0}
    //     },
    //     {
    //         position: {x: -20, y: 0, z: 24},
    //         scale: {x: 2, y: 2, z: 2},
    //         rotation: {x: 0, y: Math.PI/2, z: 0}
    //     },
    //     {
    //         position: {x: -20, y: 0, z: 12},
    //         scale: {x: 2, y: 2, z: 2},
    //         rotation: {x: 0, y: Math.PI/2, z: 0}
    //     },
    //     {
    //         position: {x: -20, y: 0, z: -12},
    //         scale: {x: 2, y: 2, z: 2},
    //         rotation: {x: 0, y: Math.PI/2, z: 0}
    //     },
    //     {
    //         position: {x: -20, y: 0, z: -24},
    //         scale: {x: 2, y: 2, z: 2},
    //         rotation: {x: 0, y: Math.PI/2, z: 0}
    //     }
    // ]
    // console.log(JSON.stringify(fences))

    for(let i = 0; i < models['fence1'].instances.length; i++) {
        const fence = models['fence1'].data.scene.clone();
        const attributes = models['fence1'].instances[i]
        const scale = attributes.scale ? attributes.scale : {x: 1, y: 1, z: 1}
        const mesh:any = createBoundingMesh({name: models['fence1'].name, group: fence, show: false, draggable: true, attributes})
        if(attributes.rotation) {
            fence.rotation.set(attributes.rotation.x, attributes.rotation.y, attributes.rotation.z)
        }
        if(attributes.scale){
            fence.scale.set(scale.x, scale.y, scale.z)
        }
        fence.position.set(attributes.position.x, attributes.position.y, attributes.position.z)
        scene.add(fence)
        // mesh.scale.y = 5
        // physicsWorld.add.existing(mesh)
        // mesh.body.setCollisionFlags(2)
        // (mesh as any).body.setCollisionFlags(2)
    }

    
}



// const addMysticTree = (scene: THREE.Scene, models:any) => {
//     const model = models['fountain'].data.scene;
//     // 11,16,17
//     const group = new THREE.Group()
//     model.traverse((child:any) => {
//         if(child.isMesh){
//             if(child.name === "mesh558070164_7" || child.name === "mesh558070164_6") return;
//             group.add(child.clone())
//         }
//     })
//     group.scale.set(15, 15, 15)
//     group.position.set(0, 2, 0)
//     const mesh:any = createBoundingMesh({group: group, position: group.position, show: false, draggable: false, type: "sphere"})
//     mesh.position.set(mesh.position.x + 1, mesh.position.y, mesh.position.z)
//     addPhysics({
//         mesh: mesh,
//         rigidBodyType: 'kinematic',
//     })
//     scene.add(group)
// }


// const addMarketStalls = (scene: THREE.Scene, models:any) => {
    
//     const model = models['marketStalls'].data.scene;
//     model.scale.set(8, 8, 8)
//     model.position.set(11.5, 0, -22)
//     const mesh:any = createBoundingMesh({group: model, position: model.position, show: false, draggable: false, type: "box"})
//     scene.add(model)
// }

// const addSittingArea = (scene: THREE.Scene, models:any) => {

//     const bonFire = models['bonFire'].data.scene;
//     bonFire.scale.set(8, 8, 8)
//     bonFire.position.set(12, 0, 19)
//     const mesh:any = createBoundingMesh({group: bonFire, position: bonFire.position, show: false, draggable: false, type: "box"})
//     scene.add(bonFire)

//     const bench = models['bench'].data.scene;
//     bench.scale.set(7, 7, 7)
//     bench.rotation.y = 0.46
//     bench.position.set(13, 0, 21)
//     const mesh2:any = createBoundingMesh({group: bench, position: bench.position, show: false, draggable: false, type: "box"})
//     scene.add(bench)

// }


// const addLampPosts = (scene: THREE.Scene, models:any) => {

//     const posts = [
//         {
//             position: {x: 9.20, y: 3.89, z: 23.80},
//         },
//         {
//             position: {x: 13.65, y: 3.89, z: -19.80},
//         }
//     ]

//     for(const i of posts) {
//         const lampPost = models['lampPost'].data.scene.clone();
//         lampPost.scale.set(0.8, 0.8, 0.8)
//         lampPost.position.set(i.position.x, i.position.y, i.position.z)
//         const mesh:any = createBoundingMesh({group: lampPost, position: lampPost.position, show: false, draggable: false, type: "box"})
//         scene.add(lampPost)
//     }

// }

const addPineTress = (scene: THREE.Scene, models:any) => {

    // for(let i = 0; i < models['pineTree1'].instances.length; i++) {
    //     const fence = models['pineTree1'].data.scene.clone();
    //     const attributes = models['pineTree1'].instances[i]

    //     const scale = attributes.scale ? attributes.scale : {x: 1, y: 1, z: 1}
    //     const mesh:any = createBoundingMesh({name: models['pineTree1'].name, group: fence, show: false, draggable: true, attributes, instanceIndex: i})
    //     if(attributes.rotation) {
    //         fence.rotation.set(attributes.rotation.x, attributes.rotation.y, attributes.rotation.z)
    //     }
    //     if(attributes.scale){
    //         fence.scale.set(scale.x, scale.y, scale.z)
    //     }
    //     fence.position.set(attributes.position.x, attributes.position.y, attributes.position.z)
    //     scene.add(fence)
    //     // mesh.scale.y = 5
    //     // physicsWorld.add.existing(mesh)
    //     // mesh.body.setCollisionFlags(2)
    //     // (mesh as any).body.setCollisionFlags(2)
    // }

}