import * as THREE from 'three'
import { useCamera, useControls } from '../init'
import { setTargetObject, startCameraAnimation } from '../animation/animationLoop'
import { useSelectedObjectStore } from '../../stores/selectedObject'

interface ClickableObject {
    object: THREE.Object3D
}

// State
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let clickableObjects: ClickableObject[] = [];
let canvas: HTMLCanvasElement | null = null;

// Initialize the event handler
const initEventHandler = () => {
    canvas = document.querySelector('canvas');
    
    if (canvas) {
        canvas.addEventListener('click', handleClick);
        console.log('Event handler initialized with canvas');
    } else {
        console.error('Canvas element not found for event handler');
    }
};

// Add an object to be clickable
const addClickableObject = (clickableObject: ClickableObject) => {
    clickableObjects.push(clickableObject);
    console.log('Added clickable object:', clickableObject.object.userData.name || 'unnamed');
};

// Remove an object from clickable objects
const removeClickableObject = (object: THREE.Object3D) => {
    clickableObjects = clickableObjects.filter(item => item.object !== object);
    console.log('Removed clickable object:', object.userData.name || 'unnamed');
};

// Clear all clickable objects
const clearClickableObjects = () => {
    clickableObjects = [];
    console.log('Cleared all clickable objects');
};


// Handle click event
const handleClick = (event: MouseEvent) => {
    const selectedObjectStore = useSelectedObjectStore()
    if (!canvas) return;

    // Calculate mouse position in normalized device coordinates
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    console.log('Click detected at:', mouse.x, mouse.y);
    console.log('Clickable objects:', clickableObjects.length);

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, useCamera());

    // Get all objects that can be clicked
    const objects = clickableObjects.map(item => item.object);
    
    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(objects);
    console.log('Intersections:', intersects.length);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;

        // Find the matching clickable object
        const matchingIndex = clickableObjects.findIndex(item => 
            item.object === clickedObject || item.object === clickedObject.parent
        );
        
        if (matchingIndex !== -1) {
            const clickableObject = clickableObjects[matchingIndex];
            // Use parent object if it matches, otherwise use clicked object
            const targetObject = clickableObject.object === clickedObject.parent 
                ? clickedObject.parent 
                : clickedObject;
            
            selectedObjectStore.setSelectedObject(targetObject.userData.id)
            // Set the target planet
            console.log(targetObject)
            setTargetObject(targetObject as THREE.Group);
        }
    } 
};

// Clean up event listeners
const dispose = () => {
    if (canvas) {
        canvas.removeEventListener('click', handleClick);
        console.log('Event handler disposed');
    }
};

// Export the functions
export const eventHandler = {
    addClickableObject,
    removeClickableObject,
    clearClickableObjects,
    dispose
};

export { initEventHandler };

export default eventHandler; 