import { useScene, useCamera, useControls } from "../init"
import * as THREE from 'three'
import { TextureLoader } from 'three'
import { sunVertexShader, sunFragmentShader, earthVertexShader, earthFragmentShader } from '../shaders/shaders'
import { addShaderMaterial, startCameraAnimation, addPlanetOrbit } from '../animation/animationLoop'
import eventHandler from '../events/eventHandler'

interface Planet {
    name: string
    texture: string
    position: THREE.Vector3
    radius: number
    color: number
    emissive?: boolean
    shaders?: {
        vertexShader: string
        fragmentShader: string
    }
    orbitalSpeed: number  // Orbital speed in radians per second
    rotationSpeed: number // Self-rotation speed in radians per second
}

// Actual distances from sun in AU (Astronomical Units)
// 1 AU = average distance from Earth to Sun
const planets: Record<string, Planet> = {
    sun: {
        name: 'sun',
        texture: '/textures/sun.jpg',
        position: new THREE.Vector3(0, 0, 0),
        radius: 3,
        color: 0xFFFF00,
        emissive: true,
        shaders: {
            vertexShader: sunVertexShader,
            fragmentShader: sunFragmentShader
        },
        orbitalSpeed: 0,  // Sun doesn't orbit
        rotationSpeed: 0.01  // Sun rotates every ~27 Earth days
    },
    mercury: {
        name: 'mercury',
        texture: '/textures/mercury.jpg',
        position: new THREE.Vector3(5, 0, 0),  // 0.4 AU
        radius: 0.5,
        color: 0x8C8C8C,
        orbitalSpeed: 0.04,  // 88 Earth days per orbit
        rotationSpeed: 0.005  // Mercury rotates every ~59 Earth days
    },
    venus: {
        name: 'venus',
        texture: '/textures/venus.jpg',
        position: new THREE.Vector3(7, 0, 0),  // 0.7 AU
        radius: 0.8,
        color: 0xE39E1C,
        orbitalSpeed: 0.015,  // 225 Earth days per orbit
        rotationSpeed: -0.002  // Venus rotates retrograde every ~243 Earth days
    },
    earth: {
        name: 'earth',
        texture: '/textures/earth.jpg',
        position: new THREE.Vector3(10, 0, 0),  // 1 AU
        radius: 0.9,
        color: 0x2233FF,
        orbitalSpeed: 0.01,  // Base speed (365 Earth days per orbit)
        rotationSpeed: 0.05  // Earth rotates every 24 hours
    },
    mars: {
        name: 'mars',
        texture: '/textures/mars.jpg',
        position: new THREE.Vector3(13, 0, 0),  // 1.5 AU
        radius: 0.6,
        color: 0xC1440E,
        orbitalSpeed: 0.005,  // 687 Earth days per orbit
        rotationSpeed: 0.048  // Mars rotates every ~24.6 hours
    },
    jupiter: {
        name: 'jupiter',
        texture: '/textures/jupiter.jpg',
        position: new THREE.Vector3(20, 0, 0),  // 5.2 AU
        radius: 2,
        color: 0xD8CA9D,
        orbitalSpeed: 0.0008,  // 11.9 Earth years per orbit
        rotationSpeed: 0.12  // Jupiter rotates every ~10 hours
    },
    saturn: {
        name: 'saturn',
        texture: '/textures/saturn.jpg',
        position: new THREE.Vector3(25, 0, 0),  // 9.5 AU
        radius: 1.8,
        color: 0xE3BB76,
        orbitalSpeed: 0.0003,  // 29.5 Earth years per orbit
        rotationSpeed: 0.1  // Saturn rotates every ~10.7 hours
    },
    uranus: {
        name: 'uranus',
        texture: '/textures/uranus.jpg',
        position: new THREE.Vector3(30, 0, 0),  // 19.2 AU
        radius: 0.8,
        color: 0x5580AA,
        orbitalSpeed: 0.0001,  // 84 Earth years per orbit
        rotationSpeed: -0.04  // Uranus rotates retrograde every ~17 hours
    },
    neptune: {
        name: 'neptune',
        texture: '/textures/neptune.jpg',
        position: new THREE.Vector3(35, 0, 0),  // 30.1 AU
        radius: 0.7,
        color: 0x366896,
        orbitalSpeed: 0.00006,  // 165 Earth years per orbit
        rotationSpeed: 0.08  // Neptune rotates every ~16 hours
    }
}

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
            vertexShader: planet.shaders.vertexShader,
            fragmentShader: planet.shaders.fragmentShader,
            uniforms: uniforms,
            side: THREE.FrontSide
        })
        
        // Add to centralized animation system
        addShaderMaterial(material as THREE.ShaderMaterial)
    } else {
        // Load planet texture
        const textureLoader = new TextureLoader()
        const planetTexture = textureLoader.load(planet.texture)
        
        // Enhanced material settings for Earth
        if (planetName === 'earth') {
            material = new THREE.MeshStandardMaterial({
                map: planetTexture,
                roughness: 0.5,
                metalness: 0.1,
                color: planet.color,
                emissive: 0x000000,
                emissiveIntensity: 0,
                envMapIntensity: 1.0,
                normalScale: new THREE.Vector2(0.5, 0.5)
            })
        } else {
            // Standard material for other planets
            material = new THREE.MeshStandardMaterial({
                map: planetTexture,
                roughness: 0.6,
                metalness: 0.1,
                color: planet.color,
                emissive: planet.emissive ? planet.color : undefined,
                emissiveIntensity: planet.emissive ? 1 : 0
            })
        }
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
    planetMesh.userData.name = planetName;
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