import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Planets from '../views/Planets.vue'
import Constellations from '../views/Constellations.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/planets',
      name: 'planets',
      component: Planets
    },
    {
      path: '/constellations',
      name: 'constellations',
      component: Constellations
    }
  ]
})

export default router
