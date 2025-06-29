<template>
  <div class="relative w-full h-screen">
    <div class="w-full h-full">
      <h2 class="text-xl font-semibold text-white z-[99] fixed top-10 left-1/2 -translate-x-1/2">
        {{ selectedConstellation?.name || 'Select a Constellation' }}
      </h2>
      <button 
        @click="$router.push('/')"
        class="fixed top-10 left-10 z-[99] bg-gray-800/50 hover:bg-gray-700/50 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        <span>Back</span>
      </button>

      <button 
        v-if="selectedObject"
        @click="showModal = true"
        class="fixed top-10 right-10 z-[99] bg-gray-800/50 hover:bg-gray-700/50 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
      >
        <span>Constellation Info</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
      </button>

      <div v-if="showModal" class="fixed inset-0 z-[999] flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="showModal = false"></div>

        <div class="relative bg-gray-800/90 p-6 rounded-lg w-[90%] max-w-2xl text-white">
          <button 
            @click="showModal = false"
            class="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h3 class="text-2xl font-bold mb-4">{{ selectedConstellation?.name || 'Select a Constellation' }}</h3>
          
          <div v-if="selectedConstellation" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-700/50 p-4 rounded-lg">
                <h4 class="text-sm text-gray-400 mb-1">Number of Stars</h4>
                <p class="text-lg">{{ selectedConstellation.stars.length }}</p>
              </div>
              <div class="bg-gray-700/50 p-4 rounded-lg">
                <h4 class="text-sm text-gray-400 mb-1">Number of Lines</h4>
                <p class="text-lg">{{ selectedConstellation.lines.length }}</p>
              </div>
            </div>
            
            <div class="bg-gray-700/50 p-4 rounded-lg">
              <h4 class="text-sm text-gray-400 mb-1">Description</h4>
              <p class="text-gray-300">{{ selectedConstellation.description }}</p>
            </div>

            <div class="bg-gray-700/50 p-4 rounded-lg">
              <h4 class="text-sm text-gray-400 mb-1">Stars</h4>
              <div class="grid grid-cols-2 gap-2">
                <div v-for="star in selectedConstellation.stars" :key="star.name" class="text-gray-300">
                  {{ star.name }} (Magnitude: {{ star.magnitude }})
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-400">
            Select a constellation to view its information
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { drawConstellation } from '../three/gui/constellations'
import { animateToDefault } from '../three/animation/animationLoop'
import { useSelectedObjectStore } from '../stores/selectedObject'
import { storeToRefs } from 'pinia'
import { constellations } from '../data/constellationData'
import { removeSolarSystem } from '@/three/gui/planets'

const selectedObjectStore = useSelectedObjectStore()
const { selectedObject } = storeToRefs(selectedObjectStore)

const showModal = ref(false)

const selectedConstellation = computed(() => {
  if (!selectedObject.value) return null
  return constellations[selectedObject.value] || null
})

watch(selectedObject, (newValue) => {
  if (newValue) {
    showModal.value = true
  }
})

onMounted(() => {
  removeSolarSystem()
  selectedObjectStore.clearSelectedObject()
  animateToDefault('constellation')
  Object.keys(constellations).forEach(key => {
    drawConstellation(key as keyof typeof constellations)
  })
})

</script>