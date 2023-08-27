import { GET_MODELS } from "@/services/api"
import { useGltfLoader, useScene } from "../init"
import * as THREE from "three"

// const models:any = {
//     'fence': {
//       path: 'models/Fence.glb',
//     },
//     'mysticTree': {
//       path: 'models/trees/MysticTree.glb',
//     },
//     'wishingWell': {
//       path: 'models/WishingWell.glb',
//     },
//     'pond': {
//       path: 'models/Pond.glb',
//     },
//     'fountain': {
//       path: 'models/Fountain.glb',
//     },
//     'bonFire': {
//       path: 'models/Bonfire.glb',
//     },
//     'bench': {
//       path: 'models/Bench.glb'
//     },
//     'marketStalls': {
//       path: 'models/MarketStalls.glb'
//     },
//     'lampPost':{
//       path: 'models/LampPost.glb'
//     },
//     'oakTree': {
//       path: 'models/trees/Oak_Tree.gltf',
//     },
//     'pineTree': {
//       path: 'models/trees/PineTree.gltf'
//     },
//     'poplarTree': {
//       path: 'models/trees/Poplar_Tree.gltf'
//     }
  
// }


let models:any;

export const loadAllModels = async () => {

    models = await GET_MODELS();

    const gltfLoader = useGltfLoader()
    const modelPromises = []
  
    for(const model of Object.keys(models)){        
        const modelPath = models[model].path
        const type = models[model].type
        if(type === "threemesh"){
          generateThreeMesh(models, model)
          continue;
        }
        const modelPromise = new Promise((resolve, reject) => {
            gltfLoader.load(modelPath, (gltf) => {
              if(model === 'pineTree1'){
                gltf.scene.traverse((child:any) => {
                  if(child.isMesh){
                    if(child.name==="Cylinder034_1"){
                      child.material = new THREE.MeshToonMaterial({color: '#1f5643'})
                      child.material.color.setHex(0x1f5643).convertSRGBToLinear()
                    }
                    else if(child.name==="Cylinder034"){
                      child.material = new THREE.MeshToonMaterial({color: '#915734'})
                      child.material.color.setHex(0x915734).convertSRGBToLinear()
                    }
                    child.castShadow = true;
                    child.receiveShadow = true;
                  }
                })
              }
                models[model].data = gltf
                resolve(gltf)
            })
        })
        modelPromises.push(modelPromise)
    }
  
    await Promise.all(modelPromises)
  
    return models
  
}


const generateThreeMesh = (models:any, model:string) => {
  if(models[model].subtype === "plane"){
  
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshStandardMaterial({color: 'black', side: THREE.DoubleSide})
    )

    mesh.position.set(0, 3, 0)
    

    models[model].data = {scene: mesh}

  }
}

export const useModels = () => models


