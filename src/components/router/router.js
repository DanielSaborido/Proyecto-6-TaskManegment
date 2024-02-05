import {createRouter, createWebHashHistory} from "vue-router"
import Home from '../pages/Home.vue'

const routes = [
  { path: '/', component: Home, meta: { title: 'Fast Task' } },
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