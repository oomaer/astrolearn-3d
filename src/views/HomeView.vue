<script setup lang="ts">
// Component logic here if needed
</script>

<template>
  <div class="p-8 w-screen h-screen flex justify-center items-center fixed z-[999]">
   <div class="flex flex-col items-center justify-center">
    <h1 class="text-4xl font-bold mb-8 text-white">Welcome to AstroLearn 3D</h1>
    <div class="flex justify-center gap-8 mt-8">
      <router-link 
        to="/planets" 
        class="p-8 border border-gray-300 rounded-lg no-underline text-inherit transition-transform hover:-translate-y-1 bg-gray-800/50"
      >
        <h2 class="text-2xl font-semibold mb-2 text-white">Planet System</h2>
        <p class="text-gray-300">Explore our solar system and its planets</p>
      </router-link>
      <router-link 
        to="/constellations" 
        class="p-8 border border-gray-300 rounded-lg no-underline text-inherit transition-transform hover:-translate-y-1 bg-gray-800/50"
      >
        <h2 class="text-2xl font-semibold mb-2 text-white">Constellations</h2>
        <p class="text-gray-300">Discover the patterns in the stars</p>
      </router-link>
    </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  padding: 2rem;
  text-align: center;
}

.view-cards {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.view-card {
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
}

.view-card:hover {
  transform: translateY(-5px);
}
</style>
