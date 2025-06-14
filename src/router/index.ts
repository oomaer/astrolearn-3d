import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Planets from '../views/Planets.vue'
import Constellations from '../views/Constellations.vue'
import QuizView from '../views/QuizView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: QuizView
    }
  ]
})

export default router
