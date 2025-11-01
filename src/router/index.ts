import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard/index.vue'),
    meta: { title: 'Панель управления' },
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('@/views/Analytics/index.vue'),
    meta: { title: 'Базовая аналитика' },
  },
  {
    path: '/advanced-analytics',
    name: 'AdvancedAnalytics',
    component: () => import('@/views/AdvancedAnalytics/index.vue'),
    meta: { title: 'Расширенная аналитика' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
