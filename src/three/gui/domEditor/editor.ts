import { useSelectedObject } from "@/three/init";
import { useModels } from "../loadModels";

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
            console.log(selectedObject)
        }
    })
    scale?.addEventListener('input', (event:any) => {
        const selectedObject = useSelectedObject();
        if(selectedObject){
            selectedObject.scale.set(event.target.value, event.target.value, event.target.value)
            selectedObject.model.scale.set(event.target.value, event.target.value, event.target.value)
        }
    })

    show?.addEventListener("change", (event:any) => {
        const selectedObject = useSelectedObject();
        const showBoundingBox = event.target.checked
        if(selectedObject){
            selectedObject.visible = showBoundingBox
        }
    })

}
