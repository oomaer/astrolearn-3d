
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
</template>

<style>
  body, html{
    /* background-color: #4AB6DF; */
    margin: 0;
    padding: 0;
  }
</style>
