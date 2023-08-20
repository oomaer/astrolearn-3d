import { useDraggableObjects, useScene, useSelectedObject } from "@/three/init";
import { useModels } from "../loadModels";
import { UPDATE_ALL, UPDATE_INSTANCES } from "@/services/api";

export const initEditor = () => {

    const models = useModels();

    const show = document.getElementById('show-wireframe');
    const rotation = document.getElementById('rotation');
    const scale = document.getElementById('scale');
    const savebtn = document.getElementById('save-btn');

    rotation?.addEventListener('input', (event:any) => {
        const selectedObject = useSelectedObject();
        if(selectedObject){
            selectedObject.rotation.y = event.target.value;
            selectedObject.model.rotation.y = event.target.value;
            // find index of selected instance in models with the help of _id
            const selectedInstaceindex = getSelectedInstanceIndex(models, selectedObject)
            models[selectedObject.name].instances[selectedInstaceindex].rotation = {x: 0, y: event.target.value, z: 0};
        }
    })
    scale?.addEventListener('input', (event:any) => {
        const selectedObject = useSelectedObject();
        if(selectedObject){
            selectedObject.scale.set(event.target.value, event.target.value, event.target.value)
            selectedObject.model.scale.set(event.target.value, event.target.value, event.target.value)
            const selectedInstaceindex = getSelectedInstanceIndex(models, selectedObject)
            models[selectedObject.name].instances[selectedInstaceindex].scale = {x: event.target.value, y: event.target.value, z: event.target.value};
        }
    })

    show?.addEventListener("change", (event:any) => {
        const selectedObject = useSelectedObject();
        const showBoundingBox = event.target.checked
        if(selectedObject){
            selectedObject.visible = showBoundingBox
        }
    })

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