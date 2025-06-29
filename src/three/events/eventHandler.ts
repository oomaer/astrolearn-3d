import * as THREE from 'three'
import { useCamera, useControls } from '../init'
import { setTargetObject, startCameraAnimation } from '../animation/animationLoop'
import { useSelectedObjectStore } from '../../stores/selectedObject'

interface ClickableObject {
    object: THREE.Object3D
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let clickableObjects: ClickableObject[] = [];
let canvas: HTMLCanvasElement | null = null;

const initEventHandler = () => {
    canvas = document.querySelector('canvas');
    if (canvas) {
        canvas.addEventListener('click', handleClick);
        console.log('Event handler initialized with canvas');
    } else {
        console.error('Canvas element not found for event handler');
    }
};

const addClickableObject = (clickableObject: ClickableObject) => {
    clickableObjects.push(clickableObject);
    console.log('Added clickable object:', clickableObject.object.userData.name || 'unnamed');
};

const removeClickableObject = (object: THREE.Object3D) => {
    clickableObjects = clickableObjects.filter(item => item.object !== object);
    console.log('Removed clickable object:', object.userData.name || 'unnamed');
};

const clearClickableObjects = () => {
    clickableObjects = [];
    console.log('Cleared all clickable objects');
};

const handleClick = (event: MouseEvent) => {
    const selectedObjectStore = useSelectedObjectStore()
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    console.log('Click detected at:', mouse.x, mouse.y);
    console.log('Clickable objects:', clickableObjects.length);

    raycaster.setFromCamera(mouse, useCamera());

    const objects = clickableObjects.map(item => item.object);
    
    const intersects = raycaster.intersectObjects(objects);
    console.log('Intersections:', intersects.length);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;

        const matchingIndex = clickableObjects.findIndex(item => 
            item.object === clickedObject || item.object === clickedObject.parent
        );
        
        if (matchingIndex !== -1) {
            const clickableObject = clickableObjects[matchingIndex];
            const targetObject = clickableObject.object === clickedObject.parent 
                ? clickedObject.parent 
                : clickedObject;
            
            selectedObjectStore.setSelectedObject(targetObject.userData.id)
            console.log(targetObject)
            setTargetObject(targetObject as THREE.Group);
        }
    } 
};

const dispose = () => {
    if (canvas) {
        canvas.removeEventListener('click', handleClick);
        console.log('Event handler disposed');
    }
};

export const eventHandler = {
    addClickableObject,
    removeClickableObject,
    clearClickableObjects,
    dispose
};

export { initEventHandler };

export default eventHandler; 