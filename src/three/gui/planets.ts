import { useScene, useCamera, useControls } from "../init"
import * as THREE from 'three'
import { TextureLoader } from 'three'
import { sunVertexShader, sunFragmentShader, earthVertexShader, earthFragmentShader } from '../shaders/shaders'
import { addShaderMaterial, startCameraAnimation, addPlanetOrbit } from '../animation/animationLoop'
import eventHandler from '../events/eventHandler'
import { planets } from '../../data/planetData'
import type { PlanetData } from '../../data/planetData'

// Function to create orbital path
const createOrbitalPath = (radius: number, color: number) => {
    const points: THREE.Vector3[] = []
    const segments = 128
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2
        points.push(new THREE.Vector3(
            Math.cos(theta) * radius,
            0,
            Math.sin(theta) * radius
        ))
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3
    })
    
    return new THREE.Line(geometry, material)
}

// Function to create Saturn's rings
const createSaturnRings = (radius: number) => {
    const ringGeometry = new THREE.RingGeometry(radius * 1.4, radius * 2.2, 64);
    const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0xE3BB76,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        roughness: 0.8,
        metalness: 0.2
    });
    
    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
    rings.rotation.x = Math.PI / 2; // Rotate to be horizontal
    return rings;
}

export const renderPlanet = (planetName: keyof typeof planets) => {
    const scene = useScene()
    const planet = planets[planetName]
    
    // Create planet geometry
    const geometry = new THREE.SphereGeometry(planet.radius, 64, 64)
    
    let material: THREE.Material
    
    if (planet.shaders) {
        // Create shader material if shaders are provided
        const uniforms: { [key: string]: { value: any } } = {
            time: { value: 0 }
        }
        
        material = new THREE.ShaderMaterial({
            vertexShader: planet.shaders.vertexShader || sunVertexShader,
            fragmentShader: planet.shaders.fragmentShader || sunFragmentShader,
            uniforms: uniforms,
            side: THREE.FrontSide
        })
        
        // Add to centralized animation system
        addShaderMaterial(material as THREE.ShaderMaterial)
    } else {
        // Load planet texture
        const textureLoader = new TextureLoader()
        const planetTexture = textureLoader.load(planet.texture)
        
        material = new THREE.MeshStandardMaterial({
            map: planetTexture,
            roughness: 0.5,
            metalness: 0.1,
            color: planet.color,
            emissive: planet.emissive ? planet.color : 0x000000,
            emissiveIntensity: planet.emissive ? 1 : 0,
            envMapIntensity: 1.0,
            normalScale: new THREE.Vector2(0.5, 0.5)
        })
    }
    
    // Create planet mesh
    const planetMesh = new THREE.Mesh(geometry, material)
    planetMesh.position.copy(planet.position)
    
    // Only enable shadow receiving for non-sun planets
    if (planetName !== 'sun') {
        planetMesh.castShadow = false
        planetMesh.receiveShadow = true
    }

    // Add Saturn's rings if it's Saturn
    if (planetName === 'saturn') {
        const rings = createSaturnRings(planet.radius);
        planetMesh.add(rings); // Add rings as a child of the planet mesh
    }
    
    // Add click handler
    planetMesh.userData = {
        id: planet.id,
        name: planetName,
        type: 'planet',
        diameter: planet.radius * 2,
        distanceFromSun: planet.position.length(),
        orbitalPeriod: planet.orbitalSpeed,
        temperature: planet.temperature,
        description: planet.description
    }
    
    eventHandler.addClickableObject({
        object: planetMesh,
        onClick: (object) => {
            const planetPosition = object.position.clone();
            const camera = useCamera();
            const controls = useControls();
            const distance = 20;
            const offset = new THREE.Vector3(0, distance * 0.5, distance);
            
            // Animate camera to planet
            startCameraAnimation(
                camera.position.clone(),
                planetPosition.clone().add(offset),
                controls.target.clone(),
                planetPosition.clone(),
                1000
            );
        }
    });
    
    // Add planet to the scene
    scene.add(planetMesh)
    
    // Add orbital path for non-sun planets
    if (planetName !== 'sun') {
        const orbitalPath = createOrbitalPath(planet.position.x, planet.color)
        scene.add(orbitalPath)
    }
    
    return planetMesh
}

export const createSolarSystem = (): Record<string, THREE.Mesh> => {
    const scene = useScene()
    
    // Add ambient light for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)
    
    // Create strong point light at sun's position
    const sunLight = new THREE.PointLight(0xffffff, 30, 400)
    sunLight.position.copy(planets.sun.position)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 2048
    sunLight.shadow.mapSize.height = 2048
    sunLight.shadow.camera.near = 0.5
    sunLight.shadow.camera.far = 50
    sunLight.shadow.bias = -0.0001
    sunLight.shadow.normalBias = 0.02
    sunLight.shadow.radius = 1
    scene.add(sunLight)
    
    // Add a second, weaker point light to create some depth
    const secondaryLight = new THREE.PointLight(0xffffff, 1.0, 150)
    secondaryLight.position.set(5, 3, 5)
    secondaryLight.castShadow = false
    scene.add(secondaryLight)
    
    // Render all planets
    const planetMeshes: Record<string, THREE.Mesh> = {}
    for (const planetName in planets) {
        const mesh = renderPlanet(planetName as keyof typeof planets)
        planetMeshes[planetName] = mesh
        
        // Add non-sun planets to orbital system with random starting positions
        if (planetName !== 'sun') {
            const planet = planets[planetName]
            // Generate random angle for initial position
            const randomAngle = Math.random() * Math.PI * 2
            // Set initial position based on random angle
            mesh.position.x = Math.cos(randomAngle) * planet.position.x
            mesh.position.z = Math.sin(randomAngle) * planet.position.x
            // Add to orbital system with rotation speed
            addPlanetOrbit(mesh, planet.orbitalSpeed, planet.position.x, planet.rotationSpeed)
        }
    }
    
    return planetMeshes
}

export const removeSolarSystem = () => {
    const scene = useScene()
    
    // Remove all planets and their orbital paths
    for (const planetName in planets) {
        const planetMesh = scene.getObjectByName(planetName)
        if (planetMesh) {
            scene.remove(planetMesh)
        }
        
        // Remove orbital path
        const orbitalPath = scene.getObjectByName(`${planetName}-orbit`)
        if (orbitalPath) {
            scene.remove(orbitalPath)
        }
    }
    
    // Remove lights
    const ambientLight = scene.getObjectByName('ambientLight')
    if (ambientLight) {
        scene.remove(ambientLight)
    }
    
    const sunLight = scene.getObjectByName('sunLight')
    if (sunLight) {
        scene.remove(sunLight)
    }
    
    const secondaryLight = scene.getObjectByName('secondaryLight')
    if (secondaryLight) {
        scene.remove(secondaryLight)
    }
}