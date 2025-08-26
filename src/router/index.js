// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../services/auth.js' 

import LandingView from '../views/LandingView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import StudyView from '../views/StudyView.vue'
import ChallengeView from '../views/ChallengeView.vue'
import PerformanceView from '../views/PerformanceView.vue'
import AdminView from '../views/AdminView.vue'

const routes = [
  { path: '/', name: 'Landing', component: LandingView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/home', name: 'Home', component: HomeView },
  { path: '/study', name: 'Study', component: StudyView },
  { path: '/challenge', name: 'Challenge', component: ChallengeView },
  { path: '/performance', name: 'Performance', component: PerformanceView },
  { path: '/admin', name: 'Admin', component: AdminView },
]

const router = createRouter({ history: createWebHistory(), routes })
export default router
