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
        vertexShader: string
        fragmentShader: string
    }
    orbitalSpeed: number  // Orbital speed in radians per second
    rotationSpeed: number // Self-rotation speed in radians per second
    temperature: number   // Surface temperature in Celsius
    description: string   // Planet description
}

// Actual distances from sun in AU (Astronomical Units)
// 1 AU = average distance from Earth to Sun
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
            vertexShader: '',  // Will be imported from shaders
            fragmentShader: '' // Will be imported from shaders
        },
        orbitalSpeed: 0,  // Sun doesn't orbit
        rotationSpeed: 0.01,  // Sun rotates every ~27 Earth days
        temperature: 5778,
        description: 'The Sun is the star at the center of our solar system.'
    },
    mercury: {
        id: 'mercury',
        name: 'mercury',
        texture: '/textures/mercury.jpg',
        position: new THREE.Vector3(5, 0, 0),  // 0.4 AU
        radius: 0.5,
        color: 0x8C8C8C,
        orbitalSpeed: 0.04,  // 88 Earth days per orbit
        rotationSpeed: 0.005,  // Mercury rotates every ~59 Earth days
        temperature: 440,
        description: 'Mercury is the smallest and innermost planet in the solar system.'
    },
    venus: {
        id: 'venus',
        name: 'venus',
        texture: '/textures/venus.jpg',
        position: new THREE.Vector3(7, 0, 0),  // 0.7 AU
        radius: 0.8,
        color: 0xE39E1C,
        orbitalSpeed: 0.015,  // 225 Earth days per orbit
        rotationSpeed: -0.002,  // Venus rotates retrograde every ~243 Earth days
        temperature: 737,
        description: 'Venus is the second planet from the Sun and the sixth largest.'
    },
    earth: {
        id: 'earth',
        name: 'earth',
        texture: '/textures/earth.jpg',
        position: new THREE.Vector3(10, 0, 0),  // 1 AU
        radius: 0.9,
        color: 0x2233FF,
        orbitalSpeed: 0.01,  // Base speed (365 Earth days per orbit)
        rotationSpeed: 0.05,  // Earth rotates every 24 hours
        temperature: 288,
        description: 'Earth is the third planet from the Sun and the only known planet to support life.'
    },
    mars: {
        id: 'mars',
        name: 'mars',
        texture: '/textures/mars.jpg',
        position: new THREE.Vector3(13, 0, 0),  // 1.5 AU
        radius: 0.6,
        color: 0xC1440E,
        orbitalSpeed: 0.005,  // 687 Earth days per orbit
        rotationSpeed: 0.048,  // Mars rotates every ~24.6 hours
        temperature: 210,
        description: 'Mars is the fourth planet from the Sun and the second smallest.'
    },
    jupiter: {
        id: 'jupiter',
        name: 'jupiter',
        texture: '/textures/jupiter.jpg',
        position: new THREE.Vector3(20, 0, 0),  // 5.2 AU
        radius: 2,
        color: 0xD8CA9D,
        orbitalSpeed: 0.0008,  // 11.9 Earth years per orbit
        rotationSpeed: 0.12,  // Jupiter rotates every ~10 hours
        temperature: -108,
        description: 'Jupiter is the fifth planet from the Sun and the largest.'
    },
    saturn: {
        id: 'saturn',
        name: 'saturn',
        texture: '/textures/saturn.jpg',
        position: new THREE.Vector3(25, 0, 0),  // 9.5 AU
        radius: 1.8,
        color: 0xE3BB76,
        orbitalSpeed: 0.0003,  // 29.5 Earth years per orbit
        rotationSpeed: 0.1,  // Saturn rotates every ~10.7 hours
        temperature: -178,
        description: 'Saturn is the sixth planet from the Sun and the second largest.'
    },
    uranus: {
        id: 'uranus',
        name: 'uranus',
        texture: '/textures/uranus.jpg',
        position: new THREE.Vector3(30, 0, 0),  // 19.2 AU
        radius: 0.8,
        color: 0x5580AA,
        orbitalSpeed: 0.0001,  // 84 Earth years per orbit
        rotationSpeed: -0.04,  // Uranus rotates retrograde every ~17 hours
        temperature: -220,
        description: 'Uranus is the seventh planet from the Sun and the third largest.'
    },
    neptune: {
        id: 'neptune',
        name: 'neptune',
        texture: '/textures/neptune.jpg',
        position: new THREE.Vector3(35, 0, 0),  // 30.1 AU
        radius: 0.7,
        color: 0x366896,
        orbitalSpeed: 0.00006,  // 165 Earth years per orbit
        rotationSpeed: 0.08,  // Neptune rotates every ~16 hours
        temperature: -200,
        description: 'Neptune is the eighth and farthest known planet from the Sun.'
    }
}
