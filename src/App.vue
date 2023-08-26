
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


onMounted(async () => {
  
  Ammo().then( async function ( AmmoLib ) {
    const three = await initEngine();
    modelsArray.value = Object.keys(three.models)
  } );


})


const addModel = (modelName: string) => {
 
  const attributes = {
    position: {x: 0, y: 0, z: 0},
    rotation: {x: 0, y: 0, z: 0},
    scale: {x: 2, y: 2, z: 2},
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
      <input type="number" step="0.2" min="-3.14" max="3.14" id="rotation" />
      <p id="rotation-value">0</p>
    </div>  
    <div class="input-container"> 
      <p>Scale</p>
      <input type="number" id="scale" />
      <p id="scale-value">0</p>
    </div>  
    <div class="input-container"> 
      <p>Position</p>
      <p id = position></p>
    </div>   
    <div class="input-container"> 
      <button id="save-btn">Save</button>
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
  
</style>
