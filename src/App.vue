<script setup lang="ts">


import { onMounted, ref } from 'vue';
import { initEngine } from './three/init';

const showInfo = ref(false)


onMounted(() => {
    initEngine();
})

const toggleInfo = () => {
    showInfo.value = !showInfo.value
}

const constellationInfo = {
    name: "Cancer (The Crab)",
    description: "Cancer is one of the twelve constellations of the zodiac. Its name is Latin for crab and it is commonly represented as one. Cancer is a medium-size constellation with an ancient history.",
    stars: [
        {
            name: "Altarf (β Cancri)",
            description: "The brightest star in Cancer, an orange giant located about 290 light-years away.",
            magnitude: 3.5,
            distance: "290 light years"
        },
        {
            name: "Acubens (α Cancri)",
            description: "Also known as Alpha Cancri, it's a multiple star system about 174 light-years away.",
            magnitude: 4.3,
            distance: "174 light years"
        },
        {
            name: "Asellus Borealis (γ Cancri)",
            description: "The northern donkey, a white-hued star about 158 light-years from Earth.",
            magnitude: 4.7,
            distance: "158 light years"
        },
        {
            name: "Asellus Australis (δ Cancri)",
            description: "The southern donkey, an orange giant star about 131 light-years away.",
            magnitude: 3.9,
            distance: "131 light years"
        },
        {
            name: "Tegmine (ζ Cancri)",
            description: "A multiple star system located approximately 83 light-years away.",
            magnitude: 4.7,
            distance: "83 light years"
        }
    ]
}

</script>

<template>
    <div id="app" class="w-screen h-screen canvas-container">
      <div class="canvas"></div>
      
      <!-- Title -->
      <h1 style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); color: white; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); z-index: 1;">
        Cancer Constellation
      </h1>

      <!-- Info Button -->
      <button 
          @click="toggleInfo"
          class="fixed z-[1] top-[2rem] right-[2rem] px-6 py-2 rounded-full bg-white/90 shadow-lg 
                 hover:scale-110 transition-all duration-300 ease-in-out
                 animate-bounce hover:animate-none
                 group flex items-center justify-center
                 font-semibold text-gray-800 hover:text-blue-600
                 hover:bg-white hover:shadow-xl"
      >
          <span class="relative">
              INFO
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </span>
      </button>

      <!-- Info Panel -->
      <div 
          v-if="showInfo" 
          class="fixed top-[5px] right-[5px] w-[500px] max-w-[90vw] max-h-[80vh] bg-black/85 backdrop-blur-md text-white p-5 rounded-lg overflow-y-auto z-50 shadow-xl"
      >
          <!-- Close Button -->
          <button 
              @click="toggleInfo"
              class="absolute top-2 right-2 text-white/80 hover:text-white text-2xl w-8 h-8 flex items-center justify-center"
          >
              ×
          </button>

          <!-- Content -->
          <div class="space-y-4">
              <h2 class="text-2xl font-bold text-white">{{ constellationInfo.name }}</h2>
              <p class="text-gray-300 leading-relaxed">{{ constellationInfo.description }}</p>
              
              <h3 class="text-xl font-semibold text-gray-200 mt-6">Notable Stars</h3>
              
              <div class="space-y-4">
                  <div 
                      v-for="star in constellationInfo.stars" 
                      :key="star.name"
                      class="bg-white/10 p-4 rounded-lg space-y-2"
                  >
                      <h4 class="text-lg font-medium text-white">{{ star.name }}</h4>
                      <p class="text-gray-300 text-sm leading-relaxed">{{ star.description }}</p>
                      <div class="flex gap-3 mt-2">
                          <span class="bg-white/10 px-3 py-1 rounded text-sm text-gray-300">
                              Magnitude: {{ star.magnitude }}
                          </span>
                          <span class="bg-white/10 px-3 py-1 rounded text-sm text-gray-300">
                              Distance: {{ star.distance }}
                          </span>
                      </div>
                  </div>
              </div>
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
