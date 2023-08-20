import * as THREE from 'three'
import { useDraggableObjects, useScene } from '../init';
import { useModels } from './loadModels';
export const createBoundingMesh = ({group, name, show=false, wireframe=true, draggable=false, type="box", attributes, instanceIndex}:
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
    const draggableObjects = useDraggableObjects();
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
    show ? mesh.visible = true: mesh.visible = false
    mesh.name = name
    mesh.index = instanceIndex
    scene.add(mesh)
    if(draggable) draggableObjects.push(mesh)

    return mesh

    // Position the box at the center of the loaded model
    // boxMesh.position.copy(boundingBox.getCenter());
}

export const addModelToSceneWithBoundingMesh = (modelName:string, attributes:any) => {
    const models = useModels();
    const scene = useScene();

    models[modelName].instances = [...models[modelName].instances, attributes]
    const model = models[modelName].data.scene.clone();
    createBoundingMesh({
      name: models['fence1'].name, 
      group: model, 
      show: false, 
      draggable: true, 
      attributes, 
      instanceIndex: models[modelName].instances.length - 1
    })
    model.rotation.set(attributes.rotation.x, attributes.rotation.y, attributes.rotation.z)
    model.scale.set(attributes.scale.x, attributes.scale.y, attributes.scale.z)
    model.position.set(attributes.position.x, attributes.position.y, attributes.position.z)
    scene.add(model)
}