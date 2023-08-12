import type { RigidBody, World } from '@dimforge/rapier3d';
import * as THREE from 'three'

export function createBody(RAPIER:any, scene: THREE.Scene, world: World,
    bodyType: 'dynamic' | 'static' | 'kinematicPositionBased',
    colliderType: 'cube' | 'sphere' | 'cylinder' | 'cone', dimension: any,
    translation: { x: number, y: number, z: number },
    rotation: { x: number, y: number, z: number }): { rigid: RigidBody } {

    let bodyDesc

    if (bodyType === 'dynamic') {
        bodyDesc = RAPIER.RigidBodyDesc.dynamic();
    } else if (bodyType === 'kinematicPositionBased') {
        bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased();

    } else if (bodyType === 'static') {
        bodyDesc = RAPIER.RigidBodyDesc.fixed();
        bodyDesc.setCanSleep(false);
    }




    if (translation) {
        bodyDesc.setTranslation(translation.x, translation.y, translation.z)
    }
    if(rotation) {
        const q = new THREE.Quaternion().setFromEuler(
            new THREE.Euler( rotation.x, rotation.y, rotation.z, 'XYZ' )
        )
        bodyDesc.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w })
    }

    const rigidBody:any = world.createRigidBody(bodyDesc);

    let collider;
    if (colliderType === 'cube') {
        collider = RAPIER.ColliderDesc.cuboid(dimension.hx, dimension.hy, dimension.hz);
    } else if (colliderType === 'sphere') {
        collider = RAPIER.ColliderDesc.ball(dimension.radius);
    } else if (colliderType === 'cylinder') {
        collider = RAPIER.ColliderDesc.cylinder(dimension.hh, dimension.radius);
    } else if (colliderType === 'cone') {
        collider = RAPIER.ColliderDesc.cone(dimension.hh, dimension.radius);
        // cone center of mass is at bottom
        collider.centerOfMass = {x:0, y:0, z:0}
    }
    world.createCollider(collider, rigidBody.handle);

    // let bufferGeometry;
    // if (colliderType === 'cube') {
    //     bufferGeometry = new THREE.BoxBufferGeometry(dimension.hx * 2, dimension.hy * 2, dimension.hz * 2);
    // } else if (colliderType === 'sphere') {
    //     bufferGeometry = new THREE.SphereBufferGeometry(dimension.radius, 32, 32);
    // } else if (colliderType === 'cylinder') {
    //     bufferGeometry = new THREE.CylinderBufferGeometry(dimension.radius, 
    //         dimension.radius, dimension.hh * 2,  32, 32);
    // } else if (colliderType === 'cone') {
    //     bufferGeometry = new THREE.ConeBufferGeometry(dimension.radius, dimension.hh * 2,  
    //         32, 32);
    // }

    // const threeMesh = new THREE.Mesh(bufferGeometry, new THREE.MeshPhongMaterial({ color: color }));
    // threeMesh.castShadow = true;
    // threeMesh.receiveShadow = true;
    // scene.add(threeMesh);

    return { rigid: rigidBody };
}
