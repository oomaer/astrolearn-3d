import {  usePhysics, useScene } from "../init";

import * as THREE from 'three'
import {Character} from '../controllers/character-controller';
import { initCentralPark } from "./initCentralPark";
import { physicsWorld } from "../init"; 
import { addPhysics } from "../physics/physics";

export const init3DWorld = () => {


    
    const scene = useScene()
    const physicsWorld = usePhysics()


    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 3),
        new THREE.MeshStandardMaterial({color: 'black'}),
      )
      cube.position.set(0, 10, 5)
      scene.add(cube)
      physicsWorld.add.existing(cube as any);
    // addPhysics({mesh: cube, rigidBodyType: 'dynamic', colliderType: 'cuboid', mass: 33})
    const ball = new THREE.Mesh(
        new THREE.SphereGeometry(1, 30, 30),
        new THREE.MeshStandardMaterial({color: 'blue'}),
      )
    ball.position.set(0, 10, 5)
    
      scene.add(ball)
      physicsWorld.add.existing(ball as any);
    // addPhysics({mesh: ball, rigidBodyType: 'dynamic', colliderType: 'ball', mass: 66})

    addLights();
    addGroundAndSky();
    initCentralPark();
  
}


const addLights = () => {
    const scene = useScene()

    // --- LIGHTS
    const hemiLight = new THREE.HemisphereLight( 'white', 'white', 1 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.set('white')
    hemiLight.position.set( 0, -40, 0 );
    scene.add( hemiLight );

    const ambient = new THREE.AmbientLight( 'white', 2 );
    scene.add( ambient );

    const dirLight = new THREE.DirectionalLight('white', 2);
    dirLight.shadow.camera.far = 10;
    dirLight.shadow.normalBias = 0.05;
    dirLight.position.set( -5, 10, -7 );
    dirLight.position.multiplyScalar( 30 );

    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 4048;
    dirLight.shadow.mapSize.height = 4048;
    const d = 50;
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


const addGroundAndSky = () => {
    const scene = useScene();
    const groundGeo = new THREE.BoxGeometry( 150, 150, 2, 200 );
    const groundMat = new THREE.MeshToonMaterial({ color:  0x379c41 });
    groundMat.color.setHex(0x379c41).convertSRGBToLinear()
    const ground:any = new THREE.Mesh( groundGeo, groundMat );
    ground.name = 'ground'
    ground.position.y = -1;
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    scene.add( ground );
    addPhysics({
      mesh: ground,
      rigidBodyType: 'kinematic',
    })



    const skyGeo = new THREE.SphereGeometry( 400, 320, 400 );
    const skyMat = new THREE.MeshToonMaterial({ color: 0x4AB6DF, side: THREE.BackSide} );
    skyMat.color.setHex( 0x4AB6DF ).convertSRGBToLinear();

        // const skyMat = new THREE.ShaderMaterial( {
        //     uniforms: uniforms,
        //     vertexShader: vertexShader,
        //     fragmentShader: fragmentShader,
        //     side: THREE.BackSide
        // } );


    const sky = new THREE.Mesh( skyGeo, skyMat );
    scene.add( sky );

}

export const addCharacter = () => {
    const characterGeo = new THREE.SphereGeometry(2)
    const characterMat = new THREE.MeshPhongMaterial({ color:  'blue' });
    const characterMesh:any = new THREE.Mesh( characterGeo, characterMat );
    characterMesh.name = 'character'
    characterMesh.position.y = 2;
    characterMesh.position.x = 15;
    characterMesh.castShadow = true;
    characterMesh.receiveShadow = true;

    const options = {
      restitution: 0,
      friction: 0,
      mass: 1,
      damping: 0,
      gravity: 0,
      linearFactor: 0,
      angularFactor: 0,
    }
    addPhysics({mesh:characterMesh, rigidBodyType: 'dynamic', options})
    const character = new Character(characterMesh)
    return character;
}


