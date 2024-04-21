
<script setup lang="ts">


// import ThreeMain from './three/ThreeMain';
// let main = new ThreeMain()

// import('@dimforge/rapier3d').then(RAPIER => {
// main.init(RAPIER)
// main.startRenderer()
// main.renderContent()
// main.addWindowEvents();
// });

// main.loadModels()

// main.addWindowEvents()


import { onMounted, ref } from 'vue';
import { initEngine } from './three/init';
import {addModelToSceneWithBoundingMesh} from './three/gui/utils';

const modelsArray = ref<string[]>([])

const modeslToShow = ["ThreeBannerCube"]

onMounted(async () => {
  
  Ammo().then( async function ( AmmoLib ) {
    const three = await initEngine();
    modelsArray.value = Object.keys(three.models).filter(model => modeslToShow.includes(model))
  } );


})


const addModel = (modelName: string) => {
 
  let attributes = {
    position: {x: 0, y: 4, z: 0},
    rotation: {x: 0, y: 0, z: 0},
    scale: {x: 0.8, y: 0.8, z: 0.8}, 
    color: '#000000',
  }
  if(modelName === "lampPost1"){
    attributes.scale = {x: 0.8, y: 0.8, z: 0.8}
    attributes.position = {x: 0, y: 4, z: 0}
  }
  else if(modelName === "rock1"){
    attributes.scale = {x: 100, y: 100, z: 100}
    attributes.position = {x: 0, y: 0, z: 0}
  }
  else if(modelName === "WalkingTrack"){
    attributes.color = '#b3b3b3'
    attributes.rotation= {x: 1.57, y: 0, z: 0}
  }
  else if(modelName === "CPRoundTree"){
    attributes.scale = {x: 1, y: 1, z: 1}
    attributes.position = {x: 0, y: 0, z: 50}
  }
  else if(modelName === "PoplarTree"){
    attributes.scale = {x: 1.7, y: 1.7, z: 1.7}
    attributes.position = {x: 0, y: 0, z: 40}
  }
  else if(modelName === "pineTree1"){
    attributes.scale = {x: 1.8, y: 1.8, z: 1.8}
    attributes.position = {x: 0, y: 0, z: 40}
  }
  else if(modelName === "PFlowers"){
    attributes.scale = {x: 0.8, y: 0.8, z: 0.8}
    attributes.position = {x: 0, y: 0.8, z: 40}
  }
  else{
    attributes = {
      position: {x: 0, y: 0, z: 0},
      rotation: {x: 0, y: 0, z: 0},
      // scale: {x: 6, y: 6, z: 6}, //big tree
      // scale: {x: 1.2, 1.2, 1.2} // round tree
      scale: {x: 3, y: 3, z: 3}, // pine
      color: '#000000',
    }
  }

  addModelToSceneWithBoundingMesh(modelName, attributes)

}

</script>

<template>
  <div class="canvas"></div>
  <div class="settings">
    <div class="input-container"> 
      <p>Show</p>
      <input type="checkbox" id="show-wireframe" name="show-wireframe"  />
    </div>  
    <div class="input-container"> 
      <p>Draggable</p>
      <input type="checkbox" id="draggable" name="draggable" />
    </div>    
    <div class="input-container"> 
      <p>Rotation</p>
      <input type="number" step="0.2" min="-3.14" max="3.14" id="rotationX" class="small"/>
      <input type="number" step="0.2" min="-3.14" max="3.14" id="rotationY" class="small"/>
      <input type="number" step="0.2" min="-3.14" max="3.14" id="rotationZ" class="small"/>
    </div>  
    <div class="input-container"> 
      <p>Scale</p>
      <input type="number" step="0.4" id="scaleX" class="small"/>
      <input type="number" step="0.4" id="scaleY" class="small"/>
      <input type="number" step="0.4" id="scaleZ" class="small"/>
    </div>  
    <div class="input-container"> 
      <p>Position</p>
      <input id = "positionX" step="0.2" type="number" class="small"/>
      <input id = "positionY" step="0.2" type="number" class="small"/>
      <input id = "positionZ" step="0.2" type="number" class="small"/>
    </div>   
    <div class="input-container"> 
      <p>Color</p>
      <input id = "color"  type="color"/>
    </div>   
    <div class="input-container"> 
      <button id="save-btn">Save</button>
    </div>
    <div class="input-container"> 
      <button id="remove">Remove</button>
    </div>

    <div class="absolute top-0 left-0 z-[2] bg-black">
      <div class="flex flex-col">
        <button v-for="model in modelsArray" :key="model" @click="addModel(model)">{{model}}</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  body, html{
    /* background-color: #4AB6DF; */
    margin: 0;
    padding: 0;
  }

  .settings{
    position: absolute;
    top: 0;
    right: 0;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .input-container{
      display: flex;
    }
  }

  .flex{
    display: flex
  }
  .flex-col{
    flex-direction: column
  }
  .small{
    width: 50px;
  }
  
</style>
