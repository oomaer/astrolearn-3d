
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

const modelsArray = ref<string[]>([])

const modeslToShow = ["ThreeBannerCube"]

onMounted(() => {
    initEngine();
})



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
