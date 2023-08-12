import * as THREE from  "https://cdn.skypack.dev/three@0.125.0";
// import {Water} from 'https://cdn.skypack.dev/three@0.125.0/examples/jsm/objects/Water2.js'

export class World {

    constructor(scene, physics){
        this.scene = scene
        this.physics = physics
        this.init()
        this.lights = []
        // this.generatePointLights()
    }

    init(){
       
        // --- LIGHTS
        const hemiLight = new THREE.HemisphereLight( 'white', 'white', 1 );
        hemiLight.color.setHSL( 0.6, 1, 0.6 );
        hemiLight.groundColor.set('white')
        hemiLight.position.set( 0, -40, 0 );
        // this.scene.add( hemiLight );

        const ambient = new THREE.AmbientLight( 'white', 2 );
        this.scene.add( ambient );

        this.dirLight = new THREE.DirectionalLight('white', 0);
        this.dirLight.shadow.camera.far = 10;
        this.dirLight.shadow.normalBias = 0.05;
        this.dirLight.position.set( -5, 10, -7 );
        this.dirLight.position.multiplyScalar( 30 );

        this.dirLight.castShadow = true;
        this.dirLight.shadow.mapSize.width = 4048;
        this.dirLight.shadow.mapSize.height = 4048;
        const d = 50;
        this.dirLight.shadow.camera.left = - d;
        this.dirLight.shadow.camera.right = d;
        this.dirLight.shadow.camera.top = d;
        this.dirLight.shadow.camera.bottom = - d;
        this.dirLight.shadow.camera.far = 500;
        this.dirLight.shadow.bias = - 0.0001;

        const dirLightHelper = new THREE.DirectionalLightHelper( this.dirLight, 10 );
        this.scene.add( dirLightHelper );

        // this.scene.add(this.dirLight)

        // GROUND
        const groundGeo = new THREE.BoxGeometry( 150, 150, 2, 2 );
        const groundMat = new THREE.MeshPhongMaterial({ color:  'green' });
        const ground = new THREE.Mesh( groundGeo, groundMat );
        ground.name = 'ground'
        ground.position.y = -1;
        ground.rotation.x = - Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add( ground );

        

        // this.physics.add.sphere({x:0, y: 5, z:4}, { standard: { color: 0x4AB6DF}})
        // this.physics.add.ground({ x:0, y:-0.5, z:0, width: 150, height: 150 }, { lambert: { color: 'red', transparent: true, opacity: 0 } })

        const color = new THREE.Color('#4AB6DF').convertSRGBToLinear()
        const ballMat = new THREE.MeshToonMaterial({ color: color })
        // ballMat.color.setHex( 0x4AB6DF)
        const ball = new THREE.Mesh(new THREE.SphereGeometry(4, 65, 65), ballMat)
        ball.position.set(0, 2, 0)
        this.scene.add(ball)

        // SKYDOME
        // const vertexShader = document.getElementById( 'vertexShader' ).textContent;
        // const fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
        const uniforms = {
            'topColor': { value: new THREE.Color( 0x0077ff ) },
            'bottomColor': { value: new THREE.Color( 0xffffff ) },
            'offset': { value: 0 },
            'exponent': { value: 0.7}
        };
        uniforms[ 'topColor' ].value.copy( hemiLight.color );

        this.scene.fog.color.copy( uniforms[ 'bottomColor' ].value );

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
        this.scene.add( sky );
    
    }

    




    generateTrees = ({modelGroup}) => {

        for(let i = 0; i < 200; i++){
            let x = Math.random() * 120 - 60
            let z = Math.random() * 120 - 60
            
            let tree = modelGroup.models[Math.floor(Math.random() * modelGroup.models.length)].scene.clone()
            tree.position.x = x
            tree.position.z = z
            tree.rotation.y = Math.random() * Math.PI * 2

            modelGroup.group.add(tree)  
        }
    }

    

}
