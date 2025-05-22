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
    createSolarSystem()
}


const addStarPoints = () => {
    const scene = useScene();

    const innerRadius = 40; // Minimum distance from the center (0, 0, 0)
    const outerRadius = 50; // Maximum distance from the center
    const starCount = 5000; // Number of stars

    // Create a buffer geometry for the points
    const starPointGeometry = new THREE.BufferGeometry();
    const starPointMaterial = new THREE.PointsMaterial({
        color: 'white',
        size: 0.1,
        transparent: true,
        opacity: 0.5
    });

    // Create an array to store the star positions
    const starVertices = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        // Generate random spherical coordinates
        const radius = Math.cbrt(Math.random() * (Math.pow(outerRadius, 3) - Math.pow(innerRadius, 3)) + Math.pow(innerRadius, 3)); // Cubic root distribution
        const theta = Math.random() * Math.PI * 2; // Random angle around the Y-axis
        const phi = Math.random() * Math.PI; // Random angle from the positive Y-axis

        // Convert spherical coordinates to Cartesian coordinates
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        // Set the star position in the vertices array
        starVertices.set([x, y, z], i * 3);
    }

    // Add the vertices to the geometry
    starPointGeometry.setAttribute('position', new THREE.BufferAttribute(starVertices, 3));

    // Create the points object
    const pointStars = new THREE.Points(starPointGeometry, starPointMaterial);

    // Add the points to the scene
    scene.add(pointStars);
};

const addStars = () => {

    const scene = useScene()
    const innerRadius = 40; // Minimum distance from the center (0, 0, 0)
    const outerRadius = 50; // Maximum distance from the center
    const starCount = 300; // Number of stars
    
    for (let i = 0; i < starCount; i++) {
        // Generate random spherical coordinates
        const radius = Math.cbrt(Math.random() * (Math.pow(outerRadius, 3) - Math.pow(innerRadius, 3)) + Math.pow(innerRadius, 3)); // Cubic root distribution
        const theta = Math.random() * Math.PI * 2; // Random angle around the Y-axis
        const phi = Math.random() * Math.PI; // Random angle from the positive Y-axis

        // Convert spherical coordinates to Cartesian coordinates
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        // Create the star geometry and material
        const starGeometry = new THREE.OctahedronGeometry(0.07, 0);
        const starMaterial = new THREE.MeshBasicMaterial({
            color: 'white',
            transparent: true,
            opacity: 0.5
        });
        const starMesh = new THREE.Mesh(starGeometry, starMaterial);

        // Set the star's position
        starMesh.position.set(x, y, z);

        // Add the star to the group
        stars.add(starMesh);
    }
    // Add the group to the scene
    scene.add(stars);

}

const drawGalaxy = () => {
    const scene = useScene();

    // Create a sphere geometry
    const galaxyGeometry = new THREE.SphereGeometry(60, 64, 64); // Large sphere for the galaxy

    // Create a custom shader material for the gradient
    const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: spaceSphereVertexShader,
        fragmentShader: spaceSphereFramentShader,
        side: THREE.BackSide
      });
    
    // Create the sphere mesh
    const galaxySphere = new THREE.Mesh(galaxyGeometry, material);

    // Add the sphere to the scene
    scene.add(galaxySphere);
};

const blinkSpeeds = Array.from({ length: 20 }, () => Math.random() * 2 + 0.5); // Generate 20 random values between 0.5 and 2.5

export const animateStars = () => {
    for (let i = 0; i < stars.children.length; i++) {
        const star = stars.children[i] as THREE.Mesh;
        const blinkSpeed = blinkSpeeds[i % blinkSpeeds.length]; // Cycle through the blink speeds
        const scale = Math.abs(Math.sin(Date.now() * 0.0005 * blinkSpeed)); // Scale based on time
        // star.scale.set(scale, scale, scale); // Apply the scale to the star
        star.material.opacity = scale * 0.7; // Adjust opacity based on scale
    }
}

