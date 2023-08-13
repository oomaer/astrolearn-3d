import Rapier from '@dimforge/rapier3d'
import * as THREE from 'three'
import { RAPIER, useDebugMode, usePhysics, usePhysicsObjects, useScene } from '../init'

export interface PhysicsObject  {
  mesh: THREE.Mesh
  collider: Rapier.Collider
  rigidBody: Rapier.RigidBody
  fn?: Function
  autoAnimate: boolean,
  debugMesh?: THREE.Mesh
}

export const addPhysics = ({
  mesh, rigidBodyType, autoAnimate=true, postPhysicsFn, colliderType, colliderSettings
}:{
  mesh: THREE.Mesh,
  rigidBodyType: 'dynamic' | 'kinematicPositionBased' | 'kinematicVelocityBased' | 'fixed',
  autoAnimate?: boolean, // update the mesh's position and quaternion based on the physics world every frame
  postPhysicsFn?: Function,
  colliderType?: string,
  colliderSettings?: any
}) => {
  const physics = usePhysics()
  const physicsObjects = usePhysicsObjects()
  
  const debugMode = useDebugMode();
  const scene = useScene();

  const rigidBodyDesc = (RAPIER.RigidBodyDesc as any)[rigidBodyType]()
  rigidBodyDesc.setTranslation(mesh.position.x, mesh.position.y, mesh.position.z)
  rigidBodyDesc.setRotation({x: mesh.quaternion.x, y: mesh.quaternion.y, z: mesh.quaternion.z, w: mesh.quaternion.w})

  // * Responsible for collision response
  const rigidBody = physics.createRigidBody(rigidBodyDesc)

  let colliderDesc

  console.log(mesh)
  switch (colliderType) {
    case 'cuboid':
      {
        const { width, height, depth } = (mesh.geometry as THREE.BoxGeometry).parameters
        colliderDesc = RAPIER.ColliderDesc.cuboid(width, height, depth)
      }
      break

    case 'ball':
      {
        const { radius } = (mesh.geometry as THREE.SphereGeometry).parameters
        colliderDesc = RAPIER.ColliderDesc.ball(radius)
      }
      break

    case 'capsule':
      {
        const { halfHeight, radius } = colliderSettings
        colliderDesc = RAPIER.ColliderDesc.capsule(halfHeight, radius)
      }
      break

    default:
      {
        colliderDesc = RAPIER.ColliderDesc.trimesh(
          mesh.geometry.attributes.position.array as Float32Array,
          mesh.geometry.index?.array as Uint32Array
        )
      }
      break
  }

  if (!colliderDesc) {
    console.error('Collider Mesh Error: convex mesh creation failed.')
  }

  // * Responsible for collision detection
  const collider = physics.createCollider(colliderDesc, rigidBody)

  const physicsObject: PhysicsObject = { mesh, collider, rigidBody, fn: postPhysicsFn, autoAnimate }


  if(debugMode){
    const debugMesh = mesh.clone();
    debugMesh.material = new THREE.MeshBasicMaterial({ color: 'red', wireframe: true })
    debugMesh.position.copy(mesh.position)
    debugMesh.quaternion.copy(mesh.quaternion)
    debugMesh.scale.copy(mesh.scale)
    scene.add(debugMesh)
    physicsObject.debugMesh = debugMesh
  }

  physicsObjects.push(physicsObject)


  return physicsObject
}
