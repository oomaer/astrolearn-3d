import { useScene } from "../init"
import * as THREE from 'three'
import { TextureLoader } from 'three'
import { sunVertexShader, sunFragmentShader } from '../shaders/shaders'

interface Planet {
    name: string
    texture: string
    position: THREE.Vector3
    radius: number
    color: number
    emissive?: boolean
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
        emissive: true
    },
    mercury: {
        name: 'mercury',
        texture: '/textures/mercury.jpg',
        position: new THREE.Vector3(5, 0, 0),  // 0.4 AU
        radius: 0.5,
        color: 0x8C8C8C
    },
    venus: {
        name: 'venus',
        texture: '/textures/venus.jpg',
        position: new THREE.Vector3(7, 0, 0),  // 0.7 AU
        radius: 0.8,
        color: 0xE39E1C
    },
    earth: {
        name: 'earth',
        texture: '/textures/earth.jpg',
        position: new THREE.Vector3(10, 0, 0),  // 1 AU
        radius: 0.9,
        color: 0x2233FF
    },
    mars: {
        name: 'mars',
        texture: '/textures/mars.jpg',
        position: new THREE.Vector3(13, 0, 0),  // 1.5 AU
        radius: 0.6,
        color: 0xC1440E
    },
    jupiter: {
        name: 'jupiter',
        texture: '/textures/jupiter.jpg',
        position: new THREE.Vector3(20, 0, 0),  // 5.2 AU
        radius: 2,
        color: 0xD8CA9D
    },
    saturn: {
        name: 'saturn',
        texture: '/textures/saturn.jpg',
        position: new THREE.Vector3(25, 0, 0),  // 9.5 AU
        radius: 1.8,
        color: 0xE3BB76
    },
    uranus: {
        name: 'uranus',
        texture: '/textures/uranus.jpg',
        position: new THREE.Vector3(30, 0, 0),  // 19.2 AU
        radius: 0.8,
        color: 0x5580AA
    },
    neptune: {
        name: 'neptune',
        texture: '/textures/neptune.jpg',
        position: new THREE.Vector3(35, 0, 0),  // 30.1 AU
        radius: 0.7,
        color: 0x366896
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

export const renderPlanet = (planetName: keyof typeof planets) => {
    const scene = useScene()
    const planet = planets[planetName]
    
    // Create planet geometry
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32)
    
    let material: THREE.Material
    
    if (planetName === 'sun') {
        // Create shader material for sun
        material = new THREE.ShaderMaterial({
            vertexShader: sunVertexShader,
            fragmentShader: sunFragmentShader,
            uniforms: {
                time: { value: 0 }
            },
            side: THREE.FrontSide
        })
        
        // Animate the sun
        const animate = () => {
            if (material instanceof THREE.ShaderMaterial) {
                material.uniforms.time.value += 0.01
            }
            requestAnimationFrame(animate)
        }
        animate()
    } else {
        // Load planet texture
        const textureLoader = new TextureLoader()
        const planetTexture = textureLoader.load(planet.texture)
        
        // Create material with the texture
        material = new THREE.MeshStandardMaterial({
            map: planetTexture,
            roughness: 0.5,  // Reduced roughness for more light reflection
            metalness: 0.1,  // Reduced metalness for more natural look
            color: planet.color,
            emissive: planet.emissive ? planet.color : undefined,
            emissiveIntensity: planet.emissive ? 1 : 0.1
        })
    }
    
    // Create planet mesh
    const planetMesh = new THREE.Mesh(geometry, material)
    planetMesh.position.copy(planet.position)
    planetMesh.castShadow = false
    planetMesh.receiveShadow = false
    
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)  // Increased ambient light
    scene.add(ambientLight)
    
    // Create strong point light at sun's position
    const sunLight = new THREE.PointLight(0xffffff, 10, 300)  // Increased intensity and range
    sunLight.position.copy(planets.sun.position)
    sunLight.castShadow = false
    scene.add(sunLight)
    
    // Add a second, weaker point light to create some depth
    const secondaryLight = new THREE.PointLight(0xffffff, 0.5, 100)  // Increased secondary light
    secondaryLight.position.set(5, 3, 5)
    secondaryLight.castShadow = false
    scene.add(secondaryLight)
    
    // Render all planets
    const planetMeshes: Record<string, THREE.Mesh> = {}
    for (const planetName in planets) {
        planetMeshes[planetName] = renderPlanet(planetName as keyof typeof planets)
    }
    
    return planetMeshes
}