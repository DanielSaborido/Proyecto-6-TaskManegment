import {createRouter, createWebHashHistory} from "vue-router"
import Home from '../pages/Home.vue'
import { isAuthenticated, isUserLogged } from "./auth_user"

const routes = [
  { 
    path: '/', 
    component: Home, 
    meta: { title: 'Fast Task' },
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
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
      if (!isAuthenticated()) {
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
      if (!isUserLogged()) {
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