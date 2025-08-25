import { createRouter, createWebHistory } from 'vue-router'

import LandingView from '../views/LandingView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

import HomeView from '../views/HomeView.vue'
import StudyView from '../views/StudyView.vue'
import ChallengeView from '../views/ChallengeView.vue'
import PerformanceView from '../views/PerformanceView.vue'
import AdminView from '../views/AdminView.vue'

import { isAuthenticated } from '../services/auth.js'

const routes = [
  { path: '/', name: 'Landing', component: LandingView },      // <- página inicial
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },

  { path: '/home', name: 'Home', component: HomeView },
  { path: '/study', name: 'Study', component: StudyView },
  { path: '/challenge', name: 'Challenge', component: ChallengeView },
  { path: '/performance', name: 'Performance', component: PerformanceView },
  { path: '/admin', name: 'Admin', component: AdminView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})


// Rotas públicas: landing, login, register
const PUBLIC = new Set(['Landing', 'Login', 'Register'])

router.beforeEach((to) => {
  if (!PUBLIC.has(to.name) && !isAuthenticated()) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
  // Usuário autenticado tentando ir para login/register → manda pra Home
  if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated()) {
    return { name: 'Home' }
  }
})

export default router
