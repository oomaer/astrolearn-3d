import { useScene } from "../init"
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { constellations } from '../../data/constellationData'
import { useSelectedObjectStore } from '../../stores/selectedObject'
import { eventHandler } from '../events/eventHandler'
import { setTargetPlanet } from '../animation/animationLoop'

export function drawConstellation(name: keyof typeof constellations) {
    const scene = useScene()
    const constellation = constellations[name]
    const starGroup = new THREE.Group()
    const starPositions = new Map<string, THREE.Vector3>()

    // Add userData to the group for identification
    starGroup.userData = {
        id: constellation.id,
        name: constellation.name,
        type: 'constellation'
    }

    // Create a group for the constellation name
    const nameGroup = new THREE.Group()
    starGroup.add(nameGroup)

    const loader = new FontLoader()
    loader.load('/fonts/helvetiker_regular.typeface.json', function(font) {

        constellation.stars.forEach(star => {
            const { x, y, z, magnitude, name, color = 0xFFFFFF } = star
            const size = 0.05 * (6 - magnitude) 
            
            const starGeometry = new THREE.SphereGeometry(size, 32, 32) 
            const starMaterial = new THREE.MeshStandardMaterial({ 
                color: color,
                emissive: new THREE.Color(color).multiplyScalar(5.0 - magnitude/6),
                metalness: 0.8,
                roughness: 0.05,
                emissiveIntensity: 3.0,
                toneMapped: false
            })
            const starMesh = new THREE.Mesh(starGeometry, starMaterial)
            starMesh.position.set(x, y, z)
            starGroup.add(starMesh)

            // Add glowing sphere effect
            const glowGeometry = new THREE.SphereGeometry(size * 2, 32, 32)
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.15,
                side: THREE.BackSide
            })
            const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
            glowMesh.position.set(x, y, z)
            starGroup.add(glowMesh)

            // Add outer glow
            const outerGlowGeometry = new THREE.SphereGeometry(size * 3, 32, 32)
            const outerGlowMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.05,
                side: THREE.BackSide
            })
            const outerGlowMesh = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial)
            outerGlowMesh.position.set(x, y, z)
            starGroup.add(outerGlowMesh)

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
            
            starGroup.add(textMesh)
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

        starGroup.userData.name = constellation.name
        starGroup.userData.id = constellation.id
        starGroup.userData.type = "constellation"

        // offset and scaling the group
        starGroup.position.add(constellation.offset)
        starGroup.scale.set(constellation.scale, constellation.scale, constellation.scale)
        
        // Make the entire constellation group clickable
        eventHandler.addClickableObject({
            object: starGroup
        })

        scene.add(starGroup)
    })


    return starGroup
}
