import * as THREE from 'three'
import { useDraggleObjects, useScene } from '../init';
export const createBoundingBoxMesh = ({group, position, show=false, draggable=false}:
    {
        group: THREE.Group,
        position: {x: number, y: number, z: number},
        show?: boolean,
        draggable?: boolean
    }): THREE.Mesh => {

    const scene = useScene();
    const draggleObjects = useDraggleObjects();
    // Get the bounding box of the loaded model group
    const boundingBox = new THREE.Box3().setFromObject(group);
    // console.log(boundingBox)
    // Calculate the dimensions of the bounding box
    const dimensions = new THREE.Vector3();
    boundingBox.getSize(dimensions);

    // Create a box geometry with the calculated dimensions
    const boxGeometry = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z, 50, 50);

    // Create a material for the box (you can replace this with your desired material)
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false });

    // Create a mesh using the box geometry and material
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.position.set(position.x, position.y, position.z)
    if(show) scene.add(boxMesh)
    if(draggable) draggleObjects.push(boxMesh)

    return boxMesh

    // Position the box at the center of the loaded model
    // boxMesh.position.copy(boundingBox.getCenter());
}