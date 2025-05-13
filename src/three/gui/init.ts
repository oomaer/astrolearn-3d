import {  useScene } from "../init";

import * as THREE from 'three'

let stars: THREE.Points

export const init3DWorld = () => {
    
    const scene = useScene()

    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 3),
        new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load('textures/stonepath.jpg')})
      )
      cube.position.set(0, 10, 5)
      scene.add(cube)

    const ball = new THREE.Mesh(
        new THREE.SphereGeometry(1, 30, 30),
        new THREE.MeshStandardMaterial({color: 'blue'}),
      )
    ball.position.set(0, 10, 5)
    
      scene.add(ball)


    addLights();
    addSpace();

  
}


const addLights = () => {
    const scene = useScene()

    // --- LIGHTS
    const hemiLight = new THREE.HemisphereLight( 'white', 'white', 1 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.set('white')
    hemiLight.position.set( 0, 10, 0 );
    scene.add( hemiLight );

    const ambient = new THREE.AmbientLight( 'white', 1.2);
    scene.add( ambient );

    const dirLight = new THREE.DirectionalLight('white', 1.5);
    dirLight.shadow.camera.far = 10;
    dirLight.shadow.normalBias = 0.05;
    dirLight.position.set( -5, 10, -7 );
    dirLight.position.multiplyScalar( 30 );

    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 4048;
    dirLight.shadow.mapSize.height = 4048;
    const d = 100;
    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;
    dirLight.shadow.camera.far = 500;
    dirLight.shadow.bias = - 0.0001;

    scene.add(dirLight)
    const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
    scene.add( dirLightHelper );
}


const addSpace = () => {
    //create space / galaxy like thing
    const scene = useScene()
    // const spaceGeometry = new THREE.SphereGeometry(100, 100, 100);
    // const spaceMaterial = new THREE.MeshBasicMaterial({
    //     map: new THREE.TextureLoader().load('textures/space2.jpg'),
    //     side: THREE.DoubleSide,
    //     transparent: true,
    //     opacity: 0.5
    // });
    // const space = new THREE.Mesh(spaceGeometry, spaceMaterial);
    // space.position.set(0, 0, 0);
    // space.rotation.x = Math.PI / 2;
    // space.rotation.y = Math.PI / 2;
    // space.rotation.z = Math.PI / 2;
    // space.scale.set(1, 1, 1);
    // scene.add(space);

    // render 5000 stars, with octahedron geometry
    const starGeometry = new THREE.OctahedronGeometry(0.1, 0);
    const starMaterial = new THREE.MeshBasicMaterial({
        color: 'white',
        transparent: true,
        opacity: 0.5
    });
    const starMesh = new THREE.InstancedMesh(starGeometry, starMaterial, 5000);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * 1000 - 500;
        const y = Math.random() * 1000 - 500;
        const z = Math.random() * 1000 - 500;
        dummy.position.set(x, y, z);
        dummy.updateMatrix();
        starMesh.setMatrixAt(i, dummy.matrix);
    }
    starMesh.instanceMatrix.needsUpdate = true;
    starMesh.rotation.x = Math.PI / 2;
    starMesh.rotation.y = Math.PI / 2;
    starMesh.rotation.z = Math.PI / 2;
    starMesh.scale.set(1, 1, 1);
    scene.add(starMesh);

   
   
    
}


export const useStars = () => stars
