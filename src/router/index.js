import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import StudyView from '../views/StudyView.vue'
import ChallengeView from '../views/ChallengeView.vue'
import PerformanceView from '../views/PerformanceView.vue'
import AdminView from '../views/AdminView.vue'
import { isAuthenticated } from '../services/auth.js'

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/', name: 'Home', component: HomeView },
  { path: '/study', name: 'Study', component: StudyView },
  { path: '/challenge', name: 'Challenge', component: ChallengeView },
  { path: '/performance', name: 'Performance', component: PerformanceView },
  { path: '/admin', name: 'Admin', component: AdminView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guarda de rotas (protege tudo exceto Login)
router.beforeEach((to) => {
  const isPublic = to.name === 'Login'
  if (!isPublic && !isAuthenticated()) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'Login' && isAuthenticated()) {
    return { name: 'Home' }
  }
})

export default router
