import { useScene, useRenderer, useCamera, useControls, useStats } from '../init'
import { animateStars } from '../gui/init'
import * as THREE from 'three'
import gsap from 'gsap'

const shaderMaterials: THREE.ShaderMaterial[] = []

const planetOrbits: PlanetOrbit[] = [];

let speedMultiplier = 6;

let targetObject: THREE.Mesh | THREE.Group | null = null;
let isAnimating = false;

export const addPlanetOrbit = (mesh: THREE.Mesh, speed: number, radius: number, rotationSpeed: number) => {
    planetOrbits.push({ mesh, speed, radius, rotationSpeed });
}

export const setTargetObject = (mesh: THREE.Mesh | THREE.Group | null) => {
    targetObject = mesh;
    if (mesh){
        const isConstellation = mesh.userData.type === "constellation"
        const objectPosition = mesh.position.clone();
        const distance =  isConstellation ? 10 : 20;
        const offset = new THREE.Vector3(0, isConstellation ? 0 : distance * 0.5, distance);
        startCameraAnimation(
            objectPosition.clone().add(offset),
            objectPosition.clone(),
            1000
        );
    } else {
        const defaultPosition = new THREE.Vector3(0, 0, 20);
        const defaultTarget = new THREE.Vector3(0, 0, 0);
        startCameraAnimation(
            defaultPosition,
            defaultTarget,
            1000
        );
    }
}

export const animateToDefault = (view?: 'planet' | 'constellation' ) => {

    let defaultPosition = new THREE.Vector3(0, 0, 20);
    if (view === 'planet'){
        defaultPosition =  new THREE.Vector3(0, 15, 35);
    }
    const defaultTarget = new THREE.Vector3(0, 0, 0);
    
    startCameraAnimation(
        defaultPosition,
        defaultTarget,
        2000
    );
}

export const addShaderMaterial = (material: THREE.ShaderMaterial) => {
    shaderMaterials.push(material)
}

export const startCameraAnimation = (
    endPosition: THREE.Vector3,
    endLookAt: THREE.Vector3,
    duration: number = 2000
) => {

    const camera = useCamera();
    const controls = useControls();
    
    isAnimating = true;
    
    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(controls.target);
    gsap.to(camera.position, {
        x: endPosition.x,
        y: endPosition.y,
        z: endPosition.z,
        duration: duration / 1000,
        ease: "power3.out",
        onUpdate: () => {
            camera.updateProjectionMatrix();
        },
        onComplete: () => {
            isAnimating = false;
        }
    });
    gsap.to(controls.target, {
        x: endLookAt.x,
        y: endLookAt.y,
        z: endLookAt.z,
        duration: duration / 1000,
        ease: "power3.out",
        onUpdate: () => {
            controls.update();
        }
    });
}

const animationLoop = () => {
    const scene = useScene()
    const renderer = useRenderer()
    const camera = useCamera()
    const controls = useControls()
    const stats = useStats()

    const time = performance.now() * 0.001 // convert to seconds
    shaderMaterials.forEach(material => {
        material.uniforms.time.value = time
    })

    planetOrbits.forEach(planet => {
        // these formulas calculated with help of AI
        // Calculate orbital angle based on time, speed, and multiplier
        const angle = (time * planet.speed * speedMultiplier) % (Math.PI * 2);
        // Update position using the calculated angle
        planet.mesh.position.x = Math.cos(angle) * planet.radius;
        planet.mesh.position.z = Math.sin(angle) * planet.radius;

        planet.mesh.rotation.y += planet.rotationSpeed;
    });

    // update controls target to the targetObject moving position
    if (targetObject && !isAnimating) {
        controls.target.copy(targetObject.position);
    }

    controls.update()
    stats.update()
    animateStars()
    renderer.render(scene, camera)
    requestAnimationFrame(animationLoop)
}


export const startAnimationLoop = () => {
    animationLoop()
} 