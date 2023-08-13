
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
initEngine()

</script>

<template>
  <div></div>
</template>

<style>
  body, html{
    background-color: #4AB6DF;
  }
</style>
