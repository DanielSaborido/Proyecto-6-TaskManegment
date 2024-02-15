import { createApp } from 'vue'
import router from "./components/router/router.js"
//import './style.css'
import './styles/common.css';
import './styles/fonts.css';
import './styles/forms.css';
import './styles/tasks.css';
import './styles/rotate.css';
import './styles/messages.css';
import './styles/navbar.css';
import './styles/theme.css';
import './styles/variables.css';
import './styles/error.css';
import App from './App.vue'

const localTheme = localStorage.getItem('theme')

const theme = localTheme !== null ? localTheme : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
localStorage.setItem('theme', theme)
document.documentElement.setAttribute('data-theme', theme)

createApp(App).use(router).mount('#app')