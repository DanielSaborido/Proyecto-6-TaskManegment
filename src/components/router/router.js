import {createRouter, createWebHashHistory} from "vue-router"
import Home from '../pages/Home.vue'

const routes = [
  { path: '/', component: Home },
  { 
    path: '/taskf',
    component: () => import('../pages/TasksForm.vue') 
  },
  { 
    path: '/login',
    component: () => import('../pages/Login.vue') 
  },
  { 
    path: '/:pathMach(.*)*',
    component: () => import('../pages/Error.vue') 
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router