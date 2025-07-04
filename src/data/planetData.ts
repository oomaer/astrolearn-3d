import * as THREE from 'three'

export interface PlanetData {
    id: string
    name: string
    texture: string
    position: THREE.Vector3
    radius: number
    color: number
    emissive?: boolean          
    shaders?: {
        vertexShader: string    // shaders for visaual effects
        fragmentShader: string
    }
    orbitalSpeed: number  // speed of orbit around sun
    rotationSpeed: number // speed of rotation on its axis
    temperature: number // Celsius
    description: string 
    realDistance: number // AU
    realDiameter: number // km
    realOrbitalPeriod: number // earth days
}

// Data got from AI (might not be accurate)
export const planets: Record<string, PlanetData> = {
    sun: {
        id: 'sun',
        name: 'sun',
        texture: '/textures/sun.jpg',
        position: new THREE.Vector3(0, 0, 0),
        radius: 3,
        color: 0xFFFF00,
        emissive: true,
        shaders: {
            vertexShader: '', 
            fragmentShader: '' 
        },
        orbitalSpeed: 0,  
        rotationSpeed: 0.01, 
        temperature: 5504.85,
        description: 'The Sun is the star at the center of our solar system.',
        realDistance: 0,
        realDiameter: 1391016,
        realOrbitalPeriod: 0
    },
    mercury: {
        id: 'mercury',
        name: 'mercury',
        texture: '/textures/mercury.jpg',
        position: new THREE.Vector3(5, 0, 0),  
        radius: 0.5,
        color: 0x8C8C8C,
        orbitalSpeed: 0.04, 
        rotationSpeed: 0.005,  
        temperature: 166.85,
        description: 'Mercury is the smallest and innermost planet in the solar system.',
        realDistance: 0.39,
        realDiameter: 4880,
        realOrbitalPeriod: 88
    },
    venus: {
        id: 'venus',
        name: 'venus',
        texture: '/textures/venus.jpg',
        position: new THREE.Vector3(7, 0, 0), 
        radius: 0.8,
        color: 0xE39E1C,
        orbitalSpeed: 0.015, 
        rotationSpeed: -0.002,  
        temperature: 463.85,
        description: 'Venus is the second planet from the Sun and the sixth largest.',
        realDistance: 0.72,
        realDiameter: 12104,
        realOrbitalPeriod: 225
    },
    earth: {
        id: 'earth',
        name: 'earth',
        texture: '/textures/earth.jpg',
        position: new THREE.Vector3(10, 0, 0), 
        radius: 0.9,
        color: 0x2233FF,
        orbitalSpeed: 0.01,  
        rotationSpeed: 0.05, 
        temperature: 14.85,
        description: 'Earth is the third planet from the Sun and the only known planet to support life.',
        realDistance: 1.00,
        realDiameter: 12742,
        realOrbitalPeriod: 365.25
    },
    mars: {
        id: 'mars',
        name: 'mars',
        texture: '/textures/mars.jpg',
        position: new THREE.Vector3(13, 0, 0), 
        radius: 0.6,
        color: 0xC1440E,
        orbitalSpeed: 0.005,  
        rotationSpeed: 0.048, 
        temperature: -63.15,
        description: 'Mars is the fourth planet from the Sun and the second smallest.',
        realDistance: 1.52,
        realDiameter: 6779,
        realOrbitalPeriod: 687
    },
    jupiter: {
        id: 'jupiter',
        name: 'jupiter',
        texture: '/textures/jupiter.jpg',
        position: new THREE.Vector3(20, 0, 0),
        radius: 2,
        color: 0xD8CA9D,
        orbitalSpeed: 0.0008,  
        rotationSpeed: 0.12,  
        temperature: -108.15,
        description: 'Jupiter is the fifth planet from the Sun and the largest.',
        realDistance: 5.20,
        realDiameter: 139820,
        realOrbitalPeriod: 4332.59
    },
    saturn: {
        id: 'saturn',
        name: 'saturn',
        texture: '/textures/saturn.jpg',
        position: new THREE.Vector3(25, 0, 0),
        radius: 1.8,
        color: 0xE3BB76,
        orbitalSpeed: 0.0003,
        rotationSpeed: 0.1, 
        temperature: -139.15,
        description: 'Saturn is the sixth planet from the Sun and the second largest.',
        realDistance: 9.58,
        realDiameter: 116460,
        realOrbitalPeriod: 10759
    },
    uranus: {
        id: 'uranus',
        name: 'uranus',
        texture: '/textures/uranus.jpg',
        position: new THREE.Vector3(30, 0, 0), 
        radius: 0.8,
        color: 0x5580AA,
        orbitalSpeed: 0.0001,  
        rotationSpeed: -0.04,  
        temperature: -197.15,
        description: 'Uranus is the seventh planet from the Sun and the third largest.',
        realDistance: 19.18,
        realDiameter: 50724,
        realOrbitalPeriod: 30688
    },
    neptune: {
        id: 'neptune',
        name: 'neptune',
        texture: '/textures/neptune.jpg',
        position: new THREE.Vector3(35, 0, 0),  
        radius: 0.7,
        color: 0x366896,
        orbitalSpeed: 0.00006,  
        rotationSpeed: 0.08,
        temperature: -201.15,
        description: 'Neptune is the eighth and farthest known planet from the Sun.',
        realDistance: 30.07,
        realDiameter: 49244,
        realOrbitalPeriod: 60182
    }
}
