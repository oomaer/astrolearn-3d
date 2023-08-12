import { useScene } from "../init";

import * as THREE from 'three'


export const init3DWorld = () => {


    addLights();
    addGroundAndSky();
}


const addLights = () => {
    const scene = useScene()

    // --- LIGHTS
    const hemiLight = new THREE.HemisphereLight( 'white', 'white', 1 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.set('white')
    hemiLight.position.set( 0, -40, 0 );
    // this.scene.add( hemiLight );

    const ambient = new THREE.AmbientLight( 'white', 2 );
    scene.add( ambient );

    const dirLight = new THREE.DirectionalLight('white', 0);
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

    const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
    scene.add( dirLightHelper );
}


const addGroundAndSky = () => {
    const scene = useScene();
    const groundGeo = new THREE.BoxGeometry( 150, 150, 2, 2 );
    const groundMat = new THREE.MeshPhongMaterial({ color:  'green' });
    const ground = new THREE.Mesh( groundGeo, groundMat );
    ground.name = 'ground'
    ground.position.y = -1;
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    scene.add( ground );


    const skyGeo = new THREE.SphereGeometry( 300, 320, 400 );
    const skyMat = new THREE.MeshToonMaterial({ color: 0x4AB6DF, side: THREE.DoubleSide} );
    skyMat.color.setHex( 0x4AB6DF );

        // const skyMat = new THREE.ShaderMaterial( {
        //     uniforms: uniforms,
        //     vertexShader: vertexShader,
        //     fragmentShader: fragmentShader,
        //     side: THREE.BackSide
        // } );


    const sky = new THREE.Mesh( skyGeo, skyMat );
    scene.add( sky );

}