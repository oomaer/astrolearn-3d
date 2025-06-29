import {  useScene } from "../init";

import * as THREE from 'three'
import { spaceSphereFramentShader, spaceSphereVertexShader } from "../shaders/shaders";
import {  drawConstellation } from "./constellations";
import { createSolarSystem, renderPlanet } from "./planets";

let stars = new THREE.Group;

export const init3DWorld = () => {
    
    const scene = useScene()
    drawGalaxy();
    addStars();
    addStarPoints();
    // drawConstellation('cancer');
    // drawConstellation('bigDipper')
    // renderPlanet('mercury')
    // createSolarSystem()
}


const addStarPoints = () => {
    const scene = useScene();

    const innerRadius = 40; 
    const outerRadius = 50; 
    const starCount = 5000; 

    const starPointGeometry = new THREE.BufferGeometry();
    const starPointMaterial = new THREE.PointsMaterial({
        color: 'white',
        size: 0.1,
        transparent: true,
        opacity: 0.5
    });

    const starVertices = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        // generate random spherical coordinates
        const radius = Math.cbrt(Math.random() * (Math.pow(outerRadius, 3) - Math.pow(innerRadius, 3)) + Math.pow(innerRadius, 3)); // cubic root distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        starVertices.set([x, y, z], i * 3);
    }

    starPointGeometry.setAttribute('position', new THREE.BufferAttribute(starVertices, 3));
    const pointStars = new THREE.Points(starPointGeometry, starPointMaterial);
    scene.add(pointStars);
};

const addStars = () => {

    const scene = useScene()
    const innerRadius = 40; 
    const outerRadius = 50; 
    const starCount = 300;
    
    for (let i = 0; i < starCount; i++) {
        // generate random spherical coordinates
        const radius = Math.cbrt(Math.random() * (Math.pow(outerRadius, 3) - Math.pow(innerRadius, 3)) + Math.pow(innerRadius, 3)); // cubic root distribution
        const theta = Math.random() * Math.PI * 2; 
        const phi = Math.random() * Math.PI; 
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        const starGeometry = new THREE.OctahedronGeometry(0.07, 0);
        const starMaterial = new THREE.MeshBasicMaterial({
            color: 'white',
            transparent: true,
            opacity: 0.5
        });
        const starMesh = new THREE.Mesh(starGeometry, starMaterial);
        starMesh.position.set(x, y, z);
        stars.add(starMesh);
    }
    scene.add(stars);

}

const drawGalaxy = () => {
    const scene = useScene();

    const galaxyGeometry = new THREE.SphereGeometry(60, 64, 64); // large sphere for the galaxy effect

    const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: spaceSphereVertexShader,
        fragmentShader: spaceSphereFramentShader,
        side: THREE.BackSide
      });
    
    const galaxySphere = new THREE.Mesh(galaxyGeometry, material);
    scene.add(galaxySphere);
};

const blinkSpeeds = Array.from({ length: 20 }, () => Math.random() * 2 + 0.5); // 0.5 - 2.5
export const animateStars = () => {
    for (let i = 0; i < stars.children.length; i++) {
        const star = stars.children[i] as THREE.Mesh;
        const blinkSpeed = blinkSpeeds[i % blinkSpeeds.length]; 
        const scale = Math.abs(Math.sin(Date.now() * 0.0005 * blinkSpeed)); 
        // star.scale.set(scale, scale, scale);
        (star.material as THREE.Material).opacity = scale * 0.7; 
    }
}

