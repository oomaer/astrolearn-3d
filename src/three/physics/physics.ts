// import Rapier, { ActiveCollisionTypes } from '@dimforge/rapier3d'
import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import { useDebugMode, usePhysics, usePhysicsObjects, useScene } from '../init'

// export interface PhysicsObject  {
//   mesh: THREE.Mesh
//   collider: Rapier.Collider
//   rigidBody: Rapier.RigidBody
//   fn?: Function
//   autoAnimate: boolean,
//   debugMesh?: THREE.Mesh
// }
export interface PhysicsObject  {
  mesh: THREE.Mesh
  collider?: any
  rigidBody: CANNON.Body
  fn?: Function
  autoAnimate: boolean,
  debugMesh?: THREE.Mesh
}

const activeCollisionsObject = {
  'DYNAMIC_DYNAMIC': 1,
  'DYNAMIC_KINEMATIC': 12,
  'DYNAMIC_FIXED': 2,
  'KINEMATIC_KINEMATIC': 52224,
  'KINEMATIC_FIXED': 8704,
  'FIXED_FIXED': 32,
  'DEFAULT': 15,
  'ALL': 60943
}

export type activeCollisionStringType = 'DYNAMIC_DYNAMIC'|
'DYNAMIC_KINEMATIC'|
'DYNAMIC_FIXED'|
'KINEMATIC_KINEMATIC'|
'KINEMATIC_FIXED'|
'FIXED_FIXED'|
'DEFAULT'|
'ALL'
export interface PhysicsObjectOptions {
  mass?: number,
  activeCollisionTypes?: activeCollisionStringType
}

// export const addPhysics = ({
//   mesh, rigidBodyType, autoAnimate=true, postPhysicsFn, colliderType="trimesh", mass=1, options
// }:{
//   mesh: THREE.Mesh,
//   rigidBodyType: 'dynamic' | 'kinematicPositionBased' | 'kinematicVelocityBased' | 'fixed',
//   autoAnimate?: boolean, // update the mesh's position and quaternion based on the physics world every frame
//   postPhysicsFn?: Function,
//   colliderType?: string,
//   mass?: number,
//   options?: PhysicsObjectOptions
// }) => {
//   const physics = usePhysics()
//   const physicsObjects = usePhysicsObjects()
  
//   const debugMode = useDebugMode();
//   const scene = useScene();

//   const rigidBodyDesc = (RAPIER.RigidBodyDesc as any)[rigidBodyType]()
//   rigidBodyDesc.setTranslation(mesh.position.x, mesh.position.y, mesh.position.z)
//   rigidBodyDesc.setRotation({x: mesh.quaternion.x, y: mesh.quaternion.y, z: mesh.quaternion.z, w: mesh.quaternion.w})

//   // * Responsible for collision response
//   const rigidBody = physics.createRigidBody(rigidBodyDesc)

//   let colliderDesc


//   switch (colliderType) {
//     case 'cuboid':
//       {
//         const { width, height, depth } = (mesh.geometry as THREE.BoxGeometry).parameters
//         colliderDesc = RAPIER.ColliderDesc.cuboid(width/2, height/2, depth/2)
//       }
//       break

//     case 'ball':
//       {
//         const { radius } = (mesh.geometry as THREE.SphereGeometry).parameters
//         colliderDesc = RAPIER.ColliderDesc.ball(radius)
//       }
//       break

//     case 'capsule':
//       {
//         const params:any = (mesh.geometry as THREE.CapsuleGeometry).parameters
//         colliderDesc = RAPIER.ColliderDesc.capsule(params.height/2, params.radius)
//       }
//       break

//     default:
//       {
//         colliderDesc = RAPIER.ColliderDesc.trimesh(
//           mesh.geometry.attributes.position.array as Float32Array,
//           mesh.geometry.index?.array as Uint32Array
//         )
//       }
//       break
//   }


//   if (!colliderDesc) {
//     console.error('Collider Mesh Error: convex mesh creation failed.')
//   }

//   if(options){
//     if(options.mass) mass = options.mass
//     if(options.activeCollisionTypes) {
//       colliderDesc.setActiveCollisionTypes(activeCollisionsObject[options.activeCollisionTypes])
//     }
//   }
//   colliderDesc.setMass(mass)
//   // * Responsible for collision detection
//   const collider = physics.createCollider(colliderDesc, rigidBody)

//   const physicsObject: PhysicsObject = { mesh, collider, rigidBody, fn: postPhysicsFn, autoAnimate }

//   if(debugMode){
//     // if(colliderType === 'trimesh') {
//     //     const geometry = new THREE.BufferGeometry();
//     //     const triMesh = (colliderDesc as any).shape;
//     //     geometry.setIndex(triMesh.indices);
//     //     geometry.setAttribute( 'position', new THREE.BufferAttribute( triMesh.vertices, 3 ) );
//     //     const material = new THREE.MeshBasicMaterial( { color: 'red', wireframe: true } );
//     //     debugMesh = new THREE.Mesh( geometry, material );
        
//     // }
//     // else{
//     //   debugMesh = mesh.clone();      
//     // }
//     const debugMesh = mesh.clone();
//     debugMesh.material = new THREE.MeshBasicMaterial({ color: 'red', wireframe: true })
//     debugMesh.position.copy(mesh.position)
//     debugMesh.quaternion.copy(mesh.quaternion)
//     debugMesh.scale.copy(mesh.scale)
//     debugMesh.castShadow = false
//     scene.add(debugMesh)
//     physicsObject.debugMesh = debugMesh
//   }

//   physicsObjects.push(physicsObject)


//   return physicsObject
// }


export const addPhysics = ({
  mesh, rigidBodyType, autoAnimate=true, postPhysicsFn, colliderType="trimesh", mass=1, options
}:{
  mesh: THREE.Mesh,
  rigidBodyType: 'dynamic' | 'static' | 'kinematic',
  autoAnimate?: boolean, // update the mesh's position and quaternion based on the physics world every frame
  postPhysicsFn?: Function,
  colliderType?: string,
  mass?: number,
  options?: PhysicsObjectOptions
}) => {

  
  const world = usePhysics();
  const physicsObjects = usePhysicsObjects()
  

  const debugMode = useDebugMode();
  const scene = useScene();

  let bodyType: CANNON.BodyType;
  switch(rigidBodyType){
    case 'dynamic':
      bodyType = CANNON.Body.DYNAMIC
      break
    case 'static':
      bodyType = CANNON.Body.STATIC
      break
    case 'kinematic':
      bodyType = CANNON.Body.KINEMATIC
      break
  }



  let shape:CANNON.Shape;
  switch (colliderType) {
    case 'cuboid':
      {
        const { width, height, depth } = (mesh.geometry as THREE.BoxGeometry).parameters
        shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2))
      }
      break

    case 'ball':
      {
        const { radius } = (mesh.geometry as THREE.SphereGeometry).parameters
        shape = new CANNON.Sphere(radius)
      }
      break


    default:
      {
       
        const vertices = mesh.geometry.attributes.position.array as number[]
        const indices = mesh.geometry.index?.array as number[]
        shape = new CANNON.Trimesh(vertices, indices)
      }
      break
  }

  const body = new CANNON.Body({
    mass: mass,
    position: new CANNON.Vec3(mesh.position.x, mesh.position.y, mesh.position.z),
    quaternion: new CANNON.Quaternion(mesh.quaternion.x, mesh.quaternion.y, mesh.quaternion.z, mesh.quaternion.w),
    type: bodyType,
    shape: shape
  })

  const physicsObject: PhysicsObject = { mesh, rigidBody: body, fn: postPhysicsFn, autoAnimate }
  if(debugMode){
    const debugMesh = mesh.clone();
    debugMesh.material = new THREE.MeshBasicMaterial({ color: 'red', wireframe: true })
    debugMesh.position.copy(mesh.position)
    debugMesh.quaternion.copy(mesh.quaternion)
    debugMesh.scale.copy(mesh.scale)
    debugMesh.castShadow = false
    scene.add(debugMesh)
    physicsObject.debugMesh = debugMesh
  }

  world.addBody(body)
  physicsObjects.push(physicsObject)


  return physicsObject
}