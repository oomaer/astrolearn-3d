import * as THREE from 'three'
import { useDraggleObjects, useScene } from '../init';
export const createBoundingMesh = ({group, name, show=false, wireframe=false, draggable=false, type="box", attributes, instanceIndex}:
    {
        name: string,
        group: THREE.Group,
        show?: boolean,
        wireframe?: boolean,
        draggable?: boolean,
        attributes: {
            position: {x: number, y: number, z: number},
            scale?: {x: number, y: number, z: number}
            rotation?: {x: number, y: number, z: number}
        }
        type?: "box" | "sphere",
        instanceIndex: number //will be used to edit attributes specific instance of the model
        // scale: number
    }): THREE.Mesh => {

    const scene = useScene();
    const draggleObjects = useDraggleObjects();
    // Get the bounding box of the loaded model group
    const boundingBox = new THREE.Box3().setFromObject(group);
    // console.log(boundingBox)
    // Calculate the dimensions of the bounding box
    const dimensions = new THREE.Vector3();
    boundingBox.getSize(dimensions);

    let mesh:any;

    if(type==="sphere"){
        const sphereGeometry = new THREE.SphereGeometry(dimensions.x/2);
        // Create a material for the box (you can replace this with your desired material)
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: wireframe });
        // Create a mesh using the box geometry and material
        mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    }
    else{
        // Create a box geometry with the calculated dimensions
        const boxGeometry = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z);
        // Create a material for the box (you can replace this with your desired material)
        const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: wireframe });
        // Create a mesh using the box geometry and material
        mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    }

    mesh.position.set(attributes.position.x, attributes.position.y, attributes.position.z)
    if(attributes.scale)
    mesh.scale.set(attributes.scale.x, attributes.scale.y, attributes.scale.z)

    if(attributes.rotation)
    mesh.rotation.set(attributes.rotation.x, attributes.rotation.y, attributes.rotation.z)

    mesh.model = group
    // if(show) scene.add(mesh)
    mesh.visible = false
    mesh.name = name
    mesh.index = instanceIndex
    scene.add(mesh)
    if(draggable) draggleObjects.push(mesh)

    return mesh

    // Position the box at the center of the loaded model
    // boxMesh.position.copy(boundingBox.getCenter());
}

