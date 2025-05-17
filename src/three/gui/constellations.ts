import { useScene } from "../init"
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

const constellationData = {
    cancer: {
        name: 'Cancer',
        offset: { x: 0, y: 0, z: 0 },
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
        ]
    }
}

export function drawConstellation(name: keyof typeof constellationData) {
    const scene = useScene()
    const constellation = constellationData[name]
    const starGroup = new THREE.Group()
    const starPositions = new Map<string, THREE.Vector3>()

    const loader = new FontLoader()
    loader.load('/fonts/helvetiker_regular.typeface.json', function(font) {
        constellation.stars.forEach(star => {
            const { x, y, z, magnitude, name, color = 0xFFFFFF } = star
            const size = 0.05 * (6 - magnitude) 
            
            const starGeometry = new THREE.SphereGeometry(size, 32, 32) 
            const starMaterial = new THREE.MeshStandardMaterial({ 
                color: color,
                emissive: new THREE.Color(1,1,1).multiplyScalar(2.0 - magnitude/6), 
                metalness: 0.3, 
                roughness: 0.2, 
            })
            const starMesh = new THREE.Mesh(starGeometry, starMaterial)
            starMesh.position.set(x, y, z)         
            starGroup.add(starMesh)
            starPositions.set(name, new THREE.Vector3(x, y, z))

            const textGeometry = new TextGeometry(name, {
                font: font,
                size: 0.15,
                height: 0.01
            })
            const textMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xcccccc,
                transparent: true,
                opacity: 0.8
            })
            const textMesh = new THREE.Mesh(textGeometry, textMaterial)
            
            textMesh.position.set(x + 0.2, y + 0.2, z)
            
            textMesh.rotation.y = Math.PI
            
            // starGroup.add(textMesh)
        })

        // lines
        constellation.lines.forEach(([star1, star2]) => {
            const pos1 = starPositions.get(star1)!
            const pos2 = starPositions.get(star2)!
            
            const points = [pos1, pos2]
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
            const lineMaterial = new THREE.LineBasicMaterial({ 
                color: 0x888888,
                transparent: true,
                opacity: 0.3
            })
            const line = new THREE.Line(lineGeometry, lineMaterial)
            starGroup.add(line)
        })

        const box = new THREE.Box3().setFromObject(starGroup)
        const center = box.getCenter(new THREE.Vector3())
        starGroup.position.sub(center)

        // offset and scaling the group
        // i am adding this to move or scale the entire group containing the constellation
        const offset = constellation.offset || { x: 0, y: 0, z: 0 }
        starGroup.position.add(new THREE.Vector3(offset.x, offset.y, offset.z))
        starGroup.scale.set(constellation.scale, constellation.scale, constellation.scale)

        scene.add(starGroup)
    })

    return starGroup
}