import { useSelectedObject } from "@/three/init";
import { useModels } from "../loadModels";
import { UPDATE_INSTANCES } from "@/services/api";

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
            models[selectedObject.name].instances[selectedObject.index].rotation.y = event.target.value;
            // console.log(models[selectedObject.name].instances[selectedObject.index])
        }
    })
    scale?.addEventListener('input', (event:any) => {
        const selectedObject = useSelectedObject();
        if(selectedObject){
            selectedObject.scale.set(event.target.value, event.target.value, event.target.value)
            selectedObject.model.scale.set(event.target.value, event.target.value, event.target.value)
            models[selectedObject.name].instances[selectedObject.index].scale = {x: event.target.value, y: event.target.value, z: event.target.value};
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
        const selectedObject = useSelectedObject();
        if(selectedObject){
            const saved = await UPDATE_INSTANCES(selectedObject.name, models[selectedObject.name].instances)
            console.log(saved)
        }
    })

}
