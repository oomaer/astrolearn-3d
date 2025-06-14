<template>
  <div class="relative w-full h-screen">
    <div class="w-full h-full">
      <!-- Title centered at the top -->
      <h2 class="text-xl font-semibold text-white z-[99] fixed top-10 left-1/2 -translate-x-1/2">
        {{ selectedPlanet?.name || 'Select a Planet' }}
      </h2>
      
      <!-- Back Button -->
      <button 
        @click="$router.push('/')"
        class="fixed top-10 left-10 z-[99] bg-gray-800/50 hover:bg-gray-700/50 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        <span>Back</span>
      </button>

      <!-- Info Button - Only show when a planet is selected -->
      <button 
        v-if="selectedObject"
        @click="showModal = true"
        class="fixed top-10 right-10 z-[99] bg-gray-800/50 hover:bg-gray-700/50 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
      >
        <span>Planet Info</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 z-[999] flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50" @click="showModal = false"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-gray-800/90 p-6 rounded-lg w-[90%] max-w-2xl text-white">
          <button 
            @click="showModal = false"
            class="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h3 class="text-2xl font-bold mb-4">{{ selectedPlanet?.name || 'Select a Planet' }}</h3>
          
          <div v-if="selectedPlanet" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-700/50 p-4 rounded-lg">
                <h4 class="text-sm text-gray-400 mb-1">Diameter</h4>
                <p class="text-lg">{{ selectedPlanet.radius * 2 }} km</p>
              </div>
              <div class="bg-gray-700/50 p-4 rounded-lg">
                <h4 class="text-sm text-gray-400 mb-1">Distance from Sun</h4>
                <p class="text-lg">{{ selectedPlanet.position.length() }} AU</p>
              </div>
              <div class="bg-gray-700/50 p-4 rounded-lg">
                <h4 class="text-sm text-gray-400 mb-1">Orbital Period</h4>
                <p class="text-lg">{{ (2 * Math.PI / selectedPlanet.orbitalSpeed).toFixed(1) }} Earth days</p>
              </div>
              <div class="bg-gray-700/50 p-4 rounded-lg">
                <h4 class="text-sm text-gray-400 mb-1">Surface Temperature</h4>
                <p class="text-lg">{{ selectedPlanet.temperature }}°C</p>
              </div>
            </div>
            
            <div class="bg-gray-700/50 p-4 rounded-lg">
              <h4 class="text-sm text-gray-400 mb-1">Description</h4>
              <p class="text-gray-300">{{ selectedPlanet.description }}</p>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-400">
            Select a planet to view its information
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, computed } from 'vue'
import { useScene } from '../three/init'
import { createSolarSystem, removeSolarSystem } from '../three/gui/planets'
import { useSelectedObjectStore } from '../stores/selectedObject'
import { storeToRefs } from 'pinia'
import { planets } from '../data/planetData'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedObjectStore = useSelectedObjectStore()
const { selectedObject } = storeToRefs(selectedObjectStore)
const scene = useScene()
const showModal = ref(false)

// Compute selected planet data from the store's ID
const selectedPlanet = computed(() => {
  if (!selectedObject.value) return null
  return planets[selectedObject.value] || null
})

// Watch for changes in selectedObject to automatically show modal when a planet is selected
watch(selectedObject, (newValue) => {
  if (newValue) {
    showModal.value = true
  }
})

onMounted(() => {
  // Initialize planet system
  selectedObjectStore.clearSelectedObject()
  createSolarSystem()
})


</script>

<style scoped>
.planets-view {
  position: relative;
  width: 100%;
  height: 100vh;
}

.canvas {
  width: 100%;
  height: 100%;
}

.planet-info {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 1rem;
  border-radius: 4px;
}
</style>
