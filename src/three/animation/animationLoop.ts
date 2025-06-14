import { useScene, useRenderer, useCamera, useControls, useStats } from '../init'
import { animateStars } from '../gui/init'
import * as THREE from 'three'

// Store all shader materials that need animation
const shaderMaterials: THREE.ShaderMaterial[] = []

// Store planet meshes and their orbital data
interface PlanetOrbit {
    mesh: THREE.Mesh;
    speed: number;  // Orbital speed in radians per second
    radius: number; // Distance from sun
    rotationSpeed: number; // Self-rotation speed in radians per second
}

const planetOrbits: PlanetOrbit[] = [];

// Speed multiplier for orbital animations
let speedMultiplier = 6;

// Camera target planet
let targetPlanet: THREE.Mesh | THREE.Group | null = null;

// Add a planet to the orbital system
export const addPlanetOrbit = (mesh: THREE.Mesh, speed: number, radius: number, rotationSpeed: number) => {
    planetOrbits.push({ mesh, speed, radius, rotationSpeed });
}

// Function to set the target planet
export const setTargetPlanet = (mesh: THREE.Mesh | THREE.Group | null) => {
    targetPlanet = mesh;
    if (mesh){
        const isConstellation = mesh.userData.type === "constellation"
        const planetPosition = mesh.position.clone();
        const camera = useCamera();
        const controls = useControls();
        const distance =  isConstellation ? 10 : 20;
        const offset = new THREE.Vector3(0, isConstellation ? 0 : distance * 0.5, distance);
        
        // Animate camera to planet
        startCameraAnimation(
            camera.position.clone(),
            planetPosition.clone().add(offset),
            controls.target.clone(),
            planetPosition.clone(),
            1000
        );
    } else {
        // When target is null, animate camera to center view
        const camera = useCamera();
        const controls = useControls();
        const defaultPosition = new THREE.Vector3(0, 0, 20);
        const defaultTarget = new THREE.Vector3(0, 0, 0);
        
        startCameraAnimation(
            camera.position.clone(),
            defaultPosition,
            controls.target.clone(),
            defaultTarget,
            1000
        );
    }
}

// Camera animation state
interface CameraAnimation {
    startPosition: THREE.Vector3;
    endPosition: THREE.Vector3;
    startLookAt: THREE.Vector3;
    endLookAt: THREE.Vector3;
    startTime: number;
    duration: number;
}

let currentCameraAnimation: CameraAnimation | null = null;

// Add a shader material to the animation loop
export const addShaderMaterial = (material: THREE.ShaderMaterial) => {
    shaderMaterials.push(material)
}

// Remove a shader material from the animation loop
export const removeShaderMaterial = (material: THREE.ShaderMaterial) => {
    const index = shaderMaterials.indexOf(material)
    if (index !== -1) {
        shaderMaterials.splice(index, 1)
    }
}

// Function to start camera animation
export const startCameraAnimation = (
    startPosition: THREE.Vector3,
    endPosition: THREE.Vector3,
    startLookAt: THREE.Vector3,
    endLookAt: THREE.Vector3,
    duration: number = 1000
) => {
    currentCameraAnimation = {
        startPosition,
        endPosition,
        startLookAt,
        endLookAt,
        startTime: performance.now(),
        duration
    };
}

// Main animation loop that handles all animations
const animationLoop = () => {
    const scene = useScene()
    const renderer = useRenderer()
    const camera = useCamera()
    const controls = useControls()
    const stats = useStats()

    // Update shader uniforms
    const time = performance.now() * 0.001 // Convert to seconds
    shaderMaterials.forEach(material => {
        material.uniforms.time.value = time
    })

    // Update planet orbits and rotations with speed multiplier
    planetOrbits.forEach(planet => {
        // Calculate orbital angle based on time, speed, and multiplier
        const angle = (time * planet.speed * speedMultiplier) % (Math.PI * 2);
        // Update position using the calculated angle
        planet.mesh.position.x = Math.cos(angle) * planet.radius;
        planet.mesh.position.z = Math.sin(angle) * planet.radius;

        // Update self-rotation
        planet.mesh.rotation.y += planet.rotationSpeed;
    });

    if (targetPlanet) {
        // Update controls target to the planet
        controls.target.copy(targetPlanet.position);
    }

    // Handle camera animation
    if (currentCameraAnimation) {
        const elapsed = performance.now() - currentCameraAnimation.startTime;
        const progress = Math.min(elapsed / currentCameraAnimation.duration, 1);
        
        // Smooth easing function
        const easeProgress = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        // Interpolate camera position and lookAt
        camera.position.lerpVectors(
            currentCameraAnimation.startPosition,
            currentCameraAnimation.endPosition,
            easeProgress
        );
        controls.target.lerpVectors(
            currentCameraAnimation.startLookAt,
            currentCameraAnimation.endLookAt,
            easeProgress
        );
        
        // Clear animation when complete
        if (progress >= 1) {
            currentCameraAnimation = null;
        }
    }

    // Update controls and stats
    controls.update()
    stats.update()

    // Animate stars
    animateStars()

    // Render the scene
    renderer.render(scene, camera)

    // Continue the animation loop
    requestAnimationFrame(animationLoop)
}

// Start the animation loop
export const startAnimationLoop = () => {
    animationLoop()
} 