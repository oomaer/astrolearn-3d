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
  
  .app {
    width: 100%;
    height: 100vh;
  }

  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    gap: 1rem;
    z-index: 1000;
  }

  nav a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  nav a:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  nav a.router-link-active {
    background-color: rgba(255, 255, 255, 0.2);
  }
</style>
