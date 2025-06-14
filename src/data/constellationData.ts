import * as THREE from 'three'

export interface StarData {
    name: string
    x: number
    y: number
    z: number
    magnitude: number
    color: number
}

export interface ConstellationData {
    id: string
    name: string
    offset: THREE.Vector3
    scale: number
    stars: StarData[]
    lines: [string, string][]
    description: string
}

export const constellations: Record<string, ConstellationData> = {
    cancer: {
        id: 'cancer',
        name: 'Cancer',
        offset: new THREE.Vector3(0, 0, 0),
        scale: 0.7,
        stars: [
            {name: 'Altarf', x: -1.8, y: -2.0, z: -4.2, magnitude: 3.5, color: 0xFFA500}, 
            {name: 'Acubens', x: 2.0, y: -1.6, z: -2.5, magnitude: 4.3, color: 0xFFFFFF}, 
            {name: 'Asellus Borealis', x: 0.3, y: 2.4, z: -2.3, magnitude: 4.7, color: 0xFFFFFF}, 
            {name: 'Asellus Australis', x: 0.0, y: 0.0, z: -1.9, magnitude: 3.9, color: 0xFFA500}, 
            {name: 'Tegmine', x: -0.4, y: 1.2, z: -1.2, magnitude: 4.7, color: 0xFFFFFF} 
        ],
        lines: [
            ['Asellus Borealis', 'Asellus Australis'],
            ['Asellus Australis', 'Tegmine'],
            ['Asellus Australis', 'Altarf'],
            ['Asellus Australis', 'Acubens']
        ],
        description: 'Cancer is one of the twelve constellations of the zodiac. Its name is Latin for crab and it is commonly represented as one.'
    },
    bigDipper: {
        id: 'bigDipper',
        name: 'Big Dipper',
        offset: new THREE.Vector3(8, 5, -15),
        scale: 0.8,
        stars: [
            {name: 'Dubhe', x: 0, y: 0, z: -3, magnitude: 1.8, color: 0xFFD700},
            {name: 'Merak', x: 0, y: -1, z: -3, magnitude: 2.4, color: 0xFFFFFF},
            {name: 'Phecda', x: 1.2, y: -1.2, z: -3, magnitude: 2.4, color: 0xFFFFFF},
            {name: 'Megrez', x: 1.2, y: 0, z: -3, magnitude: 3.3, color: 0xFFFFFF},
            {name: 'Alioth', x: 2.3, y: 0.3, z: -3, magnitude: 1.8, color: 0xFFD700},
            {name: 'Mizar', x: 3.3, y: 0.7, z: -3, magnitude: 2.1, color: 0xFFD700},
            {name: 'Alkaid', x: 4.3, y: 1.2, z: -3, magnitude: 1.9, color: 0xFFD700}
        ],
        lines: [
            ['Dubhe', 'Merak'],
            ['Merak', 'Phecda'],
            ['Phecda', 'Megrez'],
            ['Megrez', 'Dubhe'],
            ['Megrez', 'Alioth'],
            ['Alioth', 'Mizar'],
            ['Mizar', 'Alkaid']
        ],
        description: 'The Big Dipper is an asterism in the constellation Ursa Major. It is one of the most recognizable patterns in the night sky.'
    },
    orion: {
        id: 'orion',
        name: 'Orion',
        offset: new THREE.Vector3(-8, 5, -8),
        scale: 1.0,
        stars: [
            {name: 'Betelgeuse', x: -2, y: 3, z: -4, magnitude: 0.5, color: 0xFF4500},
            {name: 'Bellatrix', x: -1, y: 2.5, z: -4, magnitude: 1.6, color: 0xFFFFFF},
            {name: 'Mintaka', x: 0, y: 0, z: -4, magnitude: 2.2, color: 0xFFFFFF},
            {name: 'Alnilam', x: 0.5, y: 0.2, z: -4, magnitude: 1.7, color: 0xFFFFFF},
            {name: 'Alnitak', x: 1, y: 0.4, z: -4, magnitude: 1.9, color: 0xFFFFFF},
            {name: 'Saiph', x: 1.5, y: -2, z: -4, magnitude: 2.1, color: 0xFFFFFF},
            {name: 'Rigel', x: 2, y: -3, z: -4, magnitude: 0.1, color: 0x87CEEB}
        ],
        lines: [
            ['Betelgeuse', 'Bellatrix'],
            ['Bellatrix', 'Mintaka'],
            ['Mintaka', 'Alnilam'],
            ['Alnilam', 'Alnitak'],
            ['Alnitak', 'Saiph'],
            ['Saiph', 'Rigel'],
            ['Rigel', 'Betelgeuse']
        ],
        description: 'Orion is one of the most prominent and recognizable constellations in the night sky. It is named after Orion, a hunter in Greek mythology.'
    },
    leo: {
        id: 'leo',
        name: 'Leo',
        offset: new THREE.Vector3(-12, -6, -15),
        scale: 1.0,
        stars: [
            {name: 'Regulus', x: 0.2, y: 0.2, z: -3, magnitude: 1.4, color: 0xFFD700},
            {name: 'Denebola', x: 2.2, y: -2.2, z: -3, magnitude: 2.1, color: 0xFFFFFF},
            {name: 'Algieba', x: -1.2, y: 1.2, z: -3, magnitude: 2.1, color: 0xFFA500},
            {name: 'Zosma', x: 1.5, y: -1, z: -3, magnitude: 2.6, color: 0xFFFFFF},
            {name: 'Chertan', x: 1, y: 0, z: -3, magnitude: 3.3, color: 0xFFFFFF},
            {name: 'Adhafera', x: -0.5, y: 2, z: -3, magnitude: 3.4, color: 0xFFFFFF},
            {name: 'Ras Elased', x: -2, y: 1, z: -3, magnitude: 3.9, color: 0xFFFFFF}
        ],
        lines: [
            ['Regulus', 'Denebola'],
            ['Regulus', 'Algieba'],
            ['Algieba', 'Adhafera'],
            ['Adhafera', 'Ras Elased'],
            ['Regulus', 'Chertan'],
            ['Chertan', 'Zosma'],
            ['Zosma', 'Denebola']
        ],
        description: 'Leo is one of the constellations of the zodiac. Its name is Latin for lion, and it is commonly represented as a crouching lion. It is one of the most recognizable constellations in the night sky.'
    },
    ursaMinor: {
        id: 'ursaMinor',
        name: 'Ursa Minor',
        offset: new THREE.Vector3(8, -4, -4),
        scale: 0.8,
        stars: [
            {name: 'Polaris', x: -0.2, y: -0.2, z: -3, magnitude: 2.0, color: 0xFFD700},
            {name: 'Kochab', x: -1, y: -1, z: -3, magnitude: 2.1, color: 0xFFFFFF},
            {name: 'Pherkad', x: -0.5, y: -1.5, z: -3, magnitude: 3.0, color: 0xFFFFFF},
            {name: 'Yildun', x: 1, y: 1, z: -3, magnitude: 4.4, color: 0xFFFFFF},
            {name: 'Ahfa al Farkadain', x: 1.5, y: 0.5, z: -3, magnitude: 4.3, color: 0xFFFFFF},
            {name: 'Anwar al Farkadain', x: 2, y: 0, z: -3, magnitude: 4.9, color: 0xFFFFFF},
            {name: 'Pherkad Minor', x: -1.5, y: -0.5, z: -3, magnitude: 5.0, color: 0xFFFFFF}
        ],
        lines: [
            ['Polaris', 'Kochab'],
            ['Kochab', 'Pherkad'],
            ['Polaris', 'Yildun'],
            ['Yildun', 'Ahfa al Farkadain'],
            ['Ahfa al Farkadain', 'Anwar al Farkadain'],
            ['Kochab', 'Pherkad Minor']
        ],
        description: 'Ursa Minor, also known as the Little Dipper, is a constellation in the northern sky. It contains the North Star (Polaris) and is notable for its role in navigation.'
    }
} 