<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { initEngine } from './three/init'
onMounted(async () => {
  await initEngine()
})
</script>

<template>
  <div class="min-h-screen bg-black fixed">
    <router-view />
  </div>
</template>

