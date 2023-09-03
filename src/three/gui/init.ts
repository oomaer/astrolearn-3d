import {  usePhysics, useScene } from "../init";

import * as THREE from 'three'
import {Character} from '../controllers/character-controller';
import { initCentralPark } from "./initCentralPark";
import { physicsWorld } from "../init"; 
import { addPhysics } from "../physics/physics";
import { useModels } from "./loadModels";

export const init3DWorld = () => {


    
    const scene = useScene()
    const physicsWorld = usePhysics()


    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 3),
        new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load('textures/stonepath.jpg')})
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
    addBorders()


  
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


const addGroundAndSky = () => {
    const scene = useScene();
    const groundGeo = new THREE.BoxGeometry( 200, 200, 2, 200 );
    // const groundGeo = new THREE.CylinderGeometry( 150, 150, 2, 200)
    const groundMat = new THREE.MeshToonMaterial();
    groundMat.color.setHex(0x04ca04).convertSRGBToLinear()
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
    const skyMat = new THREE.MeshToonMaterial({ color: 0x02c6f6, side: THREE.BackSide} );
    skyMat.color.setHex( 0x02c6f6 ).convertSRGBToLinear();

        // const skyMat = new THREE.ShaderMaterial( {
        //     uniforms: uniforms,
        //     vertexShader: vertexShader,
        //     fragmentShader: fragmentShader,
        //     side: THREE.BackSide
        // } );


    const sky = new THREE.Mesh( skyGeo, skyMat );
    scene.add( sky );

}



const addBorders = () => {
    
    const scene = useScene();
    const models = useModels();
    
    
    const treeMesh = models['pineTree1'].data.scene.clone();
    const rocks = [
      {
        scale: 100,
        position: {x: 0, y: 0, z: 0},
        scene: models['bigRock1'].data.scene.clone(),
      },
      { 
        scale: 10,
        position: {x: 0, y: 10, z: 0},
        scene: models['bigRock2'].data.scene.clone(),
      }, 
      {
        scale: 10, 
        position: {x: 0, y: 0, z: 0},
        scene:models['bigRock4'].data.scene.clone()
      }
    ]
    // const rock1Mesh = models['rock1'].data.scene.clone();
    // const rock2Mesh = models['rock2'].data.scene.clone();
    // const rock3Mesh = models['rock3'].data.scene.clone();

    // for(let i = 0; i < 360; i+= 10){
    //     const m = treeMesh.clone(); 
    //     m.scale.x = m.scale.y = m.scale.z = Math.random() * 1 + 2
    //     const x = 100 * Math.cos(i * Math.PI/180) + 0
    //     const z = 100 * Math.sin(i * Math.PI/180) + 0
    //     m.position.set(x, 0, z);
    //     m.castShadow = true
    //     scene.add(m)
    // }

    for(let i = 0; i < 360; i+=9){
      const mountain = rocks[Math.floor(Math.random() * rocks.length)].scene.clone()
      const x = 90 * Math.cos(i * Math.PI/180) + 0
      const z = 90 * Math.sin(i * Math.PI/180) + 0
      mountain.position.x = x
      mountain.position.z = z
      mountain.rotation.y = Math.random() * Math.PI * 2
      mountain.scale.x = mountain.scale.y = mountain.scale.z = 8 + Math.random() * 3 
      scene.add(mountain)
  }
    
    
}

export const addCharacter = () => {
    const characterGeo = new THREE.SphereGeometry(2)
    const characterMat = new THREE.MeshPhongMaterial({ color:  'blue' });
    const characterMesh:any = new THREE.Mesh( characterGeo, characterMat );
    characterMesh.name = 'character'
    characterMesh.position.y = 2;
    characterMesh.position.x = 15;
    characterMesh.position.z = 45;
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


