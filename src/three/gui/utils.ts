import * as THREE from 'three'
import { useDraggleObjects, useScene, useShowBoundingBox } from '../init';
export const createBoundingMesh = ({group, position, show=false, wireframe=true, draggable=false, type="box"}:
    {
        group: THREE.Group,
        position: {x: number, y: number, z: number},
        show?: boolean,
        wireframe?: boolean,
        draggable?: boolean,
        type?: "box" | "sphere",
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

    mesh.position.set(position.x, position.y, position.z)
    
    mesh.model = group
    if(show) scene.add(mesh)
    if(draggable) draggleObjects.push(mesh)

    return mesh

    // Position the box at the center of the loaded model
    // boxMesh.position.copy(boundingBox.getCenter());
}

