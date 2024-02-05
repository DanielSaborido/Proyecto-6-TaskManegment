import { createApp } from 'vue'
import router from "./components/router/router.js"
import './style.css'
import App from './App.vue'

const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
localStorage.setItem('theme', theme)
document.documentElement.setAttribute('data-theme', theme)

createApp(App).use(router).mount('#app')