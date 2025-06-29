import { useScene } from "../init"
import * as THREE from 'three'
import { TextureLoader } from 'three'
import { sunVertexShader, sunFragmentShader } from '../shaders/shaders'
import { addShaderMaterial, addPlanetOrbit, setTargetObject } from '../animation/animationLoop'
import eventHandler from '../events/eventHandler'
import { planets } from '../../data/planetData'

const planetGroup = new THREE.Group()
planetGroup.name = 'solarSystem'

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
    rings.name = 'saturnRings';
    rings.rotation.x = Math.PI / 2; 
    return rings;
}

export const renderPlanet = (planetName: keyof typeof planets) => {

    const planet = planets[planetName]
    
    const geometry = new THREE.SphereGeometry(planet.radius, 64, 64)
    
    let material: THREE.Material
    
    if (planet.shaders) {
        const uniforms: { [key: string]: { value: any } } = {
            time: { value: 0 }
        }
        
        material = new THREE.ShaderMaterial({
            vertexShader: planet.shaders.vertexShader || sunVertexShader,
            fragmentShader: planet.shaders.fragmentShader || sunFragmentShader,
            uniforms: uniforms,
            side: THREE.FrontSide
        })
        
        addShaderMaterial(material as THREE.ShaderMaterial)
    } else {
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
    
    const planetMesh = new THREE.Mesh(geometry, material)
    planetMesh.name = planetName
    planetMesh.position.copy(planet.position)
    
    if (planetName !== 'sun') {
        planetMesh.castShadow = false
        planetMesh.receiveShadow = true
    }
    if (planetName === 'saturn') {
        const rings = createSaturnRings(planet.radius);
        planetMesh.add(rings); 
    }
    
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
        object: planetMesh
    });
    
    planetGroup.add(planetMesh)
    
    if (planetName !== 'sun') {
        const orbitalPath = createOrbitalPath(planet.position.x, planet.color)
        orbitalPath.name = `${planetName}-orbit`
        planetGroup.add(orbitalPath) 
    }
    
    return planetMesh
}

export const createSolarSystem = (): Record<string, THREE.Mesh> => {
    const scene = useScene()
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    ambientLight.name = 'ambientLight'
    planetGroup.add(ambientLight)
    
    const sunLight = new THREE.PointLight(0xffffff, 30, 400)
    sunLight.name = 'sunLight'
    sunLight.position.copy(planets.sun.position)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 2048
    sunLight.shadow.mapSize.height = 2048
    sunLight.shadow.camera.near = 0.5
    sunLight.shadow.camera.far = 50
    sunLight.shadow.bias = -0.0001
    sunLight.shadow.normalBias = 0.02
    sunLight.shadow.radius = 1
    planetGroup.add(sunLight)
    
    const secondaryLight = new THREE.PointLight(0xffffff, 1.0, 150)
    secondaryLight.name = 'secondaryLight'
    secondaryLight.position.set(5, 3, 5)
    secondaryLight.castShadow = false
    planetGroup.add(secondaryLight)
    
    const planetMeshes: Record<string, THREE.Mesh> = {}
    for (const planetName in planets) {
        const mesh = renderPlanet(planetName as keyof typeof planets)
        planetMeshes[planetName] = mesh
        planetGroup.add(mesh)
        
        if (planetName !== 'sun') {
            const planet = planets[planetName]
            addPlanetOrbit(mesh, planet.orbitalSpeed, planet.position.x, planet.rotationSpeed)
        }
    }
    
    scene.add(planetGroup)
    return planetMeshes
}

export const removeSolarSystem = () => {
    const scene = useScene()
    console.log("removing solar system")
    
    const solarSystem = scene.getObjectByName('solarSystem')
    if (solarSystem) {
 
        solarSystem.traverse((object) => {
            if (object.userData.type === 'planet') {
                eventHandler.removeClickableObject(object)
            }
        })
        
        scene.remove(solarSystem)
        setTargetObject(null)
    }
}
