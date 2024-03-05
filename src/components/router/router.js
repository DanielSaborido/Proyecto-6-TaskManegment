import {createRouter, createWebHashHistory} from "vue-router"
import Home from '../pages/Home.vue'
import { useAuthStore } from '../stores/authStore'


const routes = [
  { 
    path: '/', 
    component: Home, 
    meta: { title: 'Fast Task' },
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore()
      if (authStore.isAuthenticated && authStore.isBeta) {
        next('/tasks')
      } else {
        next()
      }
    } 
  },
  { 
    path: '/tasks',
    component: () => import('../pages/UserTasks.vue'),
    meta: { title: 'Fast Task' },
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated && !authStore.isBeta) {
        next('/')
      } else {
        next()
      }
    }
  },
  { 
    path: '/taskf',
    component: () => import('../pages/TasksForm.vue'),
    meta: { title: 'Create Task' }
  },
  { 
    path: '/taskf/:id',
    props: (router) => {
      const id = Number(router.params.id)
      return  {
        id:id,
      } 
    },
    component: () => import('../pages/TasksForm.vue'),
    meta: { title: 'Edit Task' }
  },
  { 
    path: '/login',
    component: () => import('../pages/Login.vue'),
    meta: { title: 'Login' }
  },
  { 
    path: '/user',
    component: () => import('../pages/UserData.vue'),
    meta: { title: 'User Data' },
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        next('/login')
      } else {
        next()
      }
    }
  },
  { 
    path: '/user_categories',
    component: () => import('../pages/UserCategories.vue'),
    meta: { title: 'User Categories' },
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        next('/login')
      } else {
        next()
      }
    }
  },
  { 
    path: '/contact',
    component: () => import('../pages/Contact.vue'),
    meta: { title: 'Contact' }
  },
  { 
    path: '/:pathMach(.*)*',
    component: () => import('../pages/Error.vue'),
    meta: { title: 'Error Page' }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router