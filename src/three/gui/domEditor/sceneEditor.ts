import { useDraggableObjects, useScene, useSelectedObject } from "@/three/init";
import { useModels } from "../loadModels";
import {  UPDATE_INSTANCES } from "@/services/api";
import * as THREE from "three"

export const initEditor = () => {

    const models = useModels();

    const show = document.getElementById('show-wireframe');
    const draggable = document.getElementById('draggable');
    const savebtn = document.getElementById('save-btn');

    const positionX = document.getElementById('positionX');
    const positionY = document.getElementById('positionY');
    const positionZ = document.getElementById('positionZ');

    const scaleX = document.getElementById('scaleX');
    const scaleY = document.getElementById('scaleY');
    const scaleZ = document.getElementById('scaleZ');

    const rotationX = document.getElementById('rotationX');
    const rotationY = document.getElementById('rotationY');
    const rotationZ = document.getElementById('rotationZ');

    const color = document.getElementById('color');

    rotationX?.addEventListener('input', (event:any) => {
        changeRotation(event.target.value, 'x')
    })
    rotationY?.addEventListener('input', (event:any) => {
        changeRotation(event.target.value, 'y')
    })
    rotationZ?.addEventListener('input', (event:any) => {
        changeRotation(event.target.value, 'z')
    })

    positionX?.addEventListener('input', (event:any) => {
        changePosition(event.target.value, 'x')
    })
    positionY?.addEventListener('input', (event:any) => {
        changePosition(event.target.value, 'y')
    })
    positionZ?.addEventListener('input', (event:any) => {
        changePosition(event.target.value, 'z')
    })

    scaleX?.addEventListener('input', (event:any) => {
        changeScale(event.target.value, 'x')
    })
    scaleY?.addEventListener('input', (event:any) => {
        changeScale(event.target.value, 'y')
    })
    scaleZ?.addEventListener('input', (event:any) => {
        changeScale(event.target.value, 'z')
    })
    

    color?.addEventListener('input', (event:any) => {
        const selectedObject = useSelectedObject();
        if(selectedObject && selectedObject.type === "threemesh"){
            // selectedObject.material.color.set(new THREE.Color(event.target.value).convertLinearToSRGB())
            selectedObject.model.material.color.set(new THREE.Color(event.target.value).convertSRGBToLinear())
            const selectedInstaceindex = getSelectedInstanceIndex(models, selectedObject)
            models[selectedObject.name].instances[selectedInstaceindex].color = event.target.value;
        }
    })

    // scale?.addEventListener('input', (event:any) => {
    //     const selectedObject = useSelectedObject();
    //     if(selectedObject){
    //         selectedObject.scale.set(event.target.value, event.target.value, event.target.value)
    //         selectedObject.model.scale.set(event.target.value, event.target.value, event.target.value)
    //         const selectedInstaceindex = getSelectedInstanceIndex(models, selectedObject)
    //         models[selectedObject.name].instances[selectedInstaceindex].scale = {x: event.target.value, y: event.target.value, z: event.target.value};
    //     }
    // })

    show?.addEventListener("change", (event:any) => {
        const selectedObject = useSelectedObject();
        const showBoundingBox = event.target.checked
        if(selectedObject){
            selectedObject.visible = showBoundingBox
        }
    })

    draggable?.addEventListener("change", (event:any) => {
        const selectedObject = useSelectedObject();
        const draggable = event.target.checked
        if(selectedObject){
            selectedObject.isDraggable = draggable
        }
    })


    const changeRotation = (value:string, axis:string) => {
        const selectedObject = useSelectedObject();
        if(selectedObject){
            selectedObject.rotation[axis] = value;
            selectedObject.model.rotation[axis] = value;
            // find index of selected instance in models with the help of _id
            const selectedInstaceindex = getSelectedInstanceIndex(models, selectedObject)
            models[selectedObject.name].instances[selectedInstaceindex].rotation[axis] = value;
        }
    }

    const changePosition = (value:string, axis:string) => {
        const selectedObject = useSelectedObject();
        if(selectedObject){
            selectedObject.position[axis] = value
            selectedObject.model.position[axis] = value
            const selectedInstaceindex = getSelectedInstanceIndex(models, selectedObject)
            models[selectedObject.name].instances[selectedInstaceindex].position[axis] = value;
        }
    }

    const changeScale = (value:string, axis:string) => {
        const selectedObject = useSelectedObject();
        if(selectedObject){
            selectedObject.scale[axis] = value
            selectedObject.model.scale[axis] = value
            const selectedInstaceindex = getSelectedInstanceIndex(models, selectedObject)
            models[selectedObject.name].instances[selectedInstaceindex].scale[axis] = value
        }
    }

    // positionX?.addEventListener("input", (event:any) => {
    //     const selectedObject = useSelectedObject();
    //     if(selectedObject){
    //         selectedObject.position.x = event.target.value
    //         selectedObject.model.position.x = event.target.value
    //         const selectedInstaceindex = getSelectedInstanceIndex(models, selectedObject)
    //         models[selectedObject.name].instances[selectedInstaceindex].position.x = event.target.value;
    //     }
    // })


    savebtn?.addEventListener("click", async () => {
        // const selectedObject = useSelectedObject();
        // if(selectedObject){
        //     const saved = await UPDATE_INSTANCES(selectedObject.name, models[selectedObject.name].instances)
        //     console.log(models)
        // }
        console.log(models)
        for(const i of Object.keys(models)){
            const saved = await UPDATE_INSTANCES(i, models[i].instances)
            console.log(saved)
        }
    })

    document.addEventListener('keydown', (event) => {
        if(event.key === "Delete"){
            const selectedObject = useSelectedObject();
            const scene = useScene();
            const draggableObjects = useDraggableObjects();
            if(selectedObject){
                const selectedInstaceindex = getSelectedInstanceIndex(models, selectedObject)
                models[selectedObject.name].instances.splice(selectedInstaceindex, 1)
                scene.remove(selectedObject.model)
                scene.remove(selectedObject)
                const index = draggableObjects.indexOf(selectedObject)
                draggableObjects.splice(index, 1)
            }
        }
    })

}


export const getSelectedInstanceIndex = (models:any, selectedObject:any) => {
    let selectedInstaceindex = 0;
    models[selectedObject.name].instances.find((instance:any, index:number) => {
        if(instance._id === selectedObject._id){
            selectedInstaceindex = index;
        }
    })
    return selectedInstaceindex
}