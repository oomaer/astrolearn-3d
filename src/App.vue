
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

import { initEngine } from './three/init';
Ammo().then( function ( AmmoLib ) {

  // Ammo = AmmoLib;
  initEngine();



} );



</script>

<template>
  <div class="canvas"></div>
  <div class="settings">
    <div class="input-container"> 
      <p>Show</p>
      <input type="checkbox" id="show-wireframe" name="show-wireframe" value="show-wireframe" />
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
