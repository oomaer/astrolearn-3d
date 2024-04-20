import { GET_MODELS } from "@/services/api"
import { useAnimatingModels, useGltfLoader, useScene } from "../init"
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

    const animatingModels = useAnimatingModels();
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
              if(model === 'pineTree1' || model === "CPRoundTree" || model === "PoplarTree" || model === "CPOakTree"){
                
                gltf.scene.traverse((child:any) => {
                  if(child.isMesh){
                    if(child.name==="Cylinder034_1"){      
                      //pine leaves
                      child.material = new THREE.MeshStandardMaterial({color: new THREE.Color('#01776A')})
                      // child.material.color.setHex(0x27a799).convertSRGBToLinear()
                    }
                    else if(child.name==="Cylinder034"){
                      child.material = new THREE.MeshStandardMaterial({color: '#915734'})
                      // child.material.color.setHex(0x915734).convertSRGBToLinear()
                    }
                    if(child.name === "Icosphere003"){ 
                      //round tree leaves
                      child.material = new THREE.MeshStandardMaterial({color: '#B57200'})
                      // animatingModels.push({
                      //   mesh: child,
                      //   type: "spring"
                      // })
                      // child.material.color.setHex(0xD62C08).convertSRGBToLinear()
                    }
                    if(child.material.name === 'OakTree_Trunk'){
                      child.material = new THREE.MeshStandardMaterial({color: '#815137'})
                    }
                    if(child.material.name === 'OakTree_Leaves'){
                      child.material = new THREE.MeshStandardMaterial({color: new THREE.Color(0xCD1212).convertSRGBToLinear()})
                    }
                    console.log(child.material.name)
                    if(child.name === 'PoplarLeaves1'){
                      child.material = new THREE.MeshStandardMaterial({color: new THREE.Color('#0AC600')})
                    }
                    if(child.name === 'PoplarLeaves2'){
                      child.material = new THREE.MeshStandardMaterial({color: new THREE.Color('#0AC600').convertSRGBToLinear()})
                    }
                    child.castShadow = true;
                    child.receiveShadow = true;
                  }
                })
              }
              else if(model === "roadPiece"){
                gltf.scene.traverse((child:any) => {
                  if(child.isMesh){
                    if(child.name === "mesh1357725606_1"){
                      child.material = new THREE.MeshBasicMaterial({color: 0x817D28})
                      child.position.y = child.position.y + 0.01
                    }
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
    )
    if(model === "ThreePathPlane"){
      const texture = new THREE.TextureLoader().load('textures/stonepath.jpg', )
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set( 1, 10 );
      mesh.material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide})
      models[model].isTextured = true
    }

    // if(model === "ThreeGrassTexturePlane"){
    //   const texture = new THREE.TextureLoader().load('textures/grass1.png', )
    //   texture.wrapS = THREE.RepeatWrapping
    //   texture.wrapT = THREE.RepeatWrapping
    //   texture.repeat.set( 10, 10 );
    //   mesh.material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide})
    //   models[model].isTextured = true
    // }

    mesh.position.set(0, 3, 0)
    

    models[model].data = {scene: mesh}

  }
  if(models[model].subtype === "box"){
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshToonMaterial({color: 'black', side: THREE.DoubleSide})
    )
    mesh.position.set(0, 3, 0)
    models[model].data = {scene: mesh}
  }
}

export const useModels = () => models


