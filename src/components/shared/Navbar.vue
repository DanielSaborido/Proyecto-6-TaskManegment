<template>
  <nav>
    <router-link to="/" class="icon">
      <img v-if="route === '/' || route === '/tasks'" src="../../assets/imagotipo-fast-task.svg" alt="Home" class="icon">
      <img v-else-if="theme === 'light' && route !== '/' && route !== '/tasks'" src="../../assets/light/logo-horizontal-fast-task.svg" alt="Home" class="icon">
      <img v-else src="../../assets/dark/logo-fast-task-version-blanca.svg" alt="Home" class="icon">
    </router-link>
    <h1 class="title">{{ title }}</h1>
    <section class="user">
      <img v-if="theme === 'light'" src="../../assets/light/sol-y-luna.png" alt="dark/light" class="userIcon" @click="changeTheme">
      <img v-else src="../../assets/dark/sol-y-luna.png" alt="dark/light" class="userIcon" @click="changeTheme">
      <router-link to="/contact" class="userIcon">
        <img v-if="theme === 'light'" src="../../assets/light/contact-icon.png" alt="Contact" class="icon">
        <img v-else src="../../assets/dark/contact-icon.png" alt="Contact" class="icon">
      </router-link>
      <router-link v-if="!isAuthenticated" to="/login" class="userIcon">
        <img v-if="theme === 'light'" src="../../assets/light/user.png" alt="User" class="icon">
        <img v-else src="../../assets/dark/user.png" alt="User" class="icon">
      </router-link>
      <article v-else @click="toggleMenu" class="userIcon">
        <img v-if="theme === 'light'" src="../../assets/light/user.png" alt="User" class="icon">
        <img v-else src="../../assets/dark/user.png" alt="User" class="icon">
        <section v-if="showMenu" class="menu">
          <router-link to="/user">Data</router-link>
          <router-link to="/user_categories">Categories</router-link>
          <button @click="logout">Logout</button>
        </section>
      </article>
    </section>
  </nav>
</template>

<script>
import { useThemeStore } from '../stores/themeStore'
import { mapState } from 'pinia'
import { useAuthStore } from '../stores/authStore'
  export default {
    data() {
      return {
        showMenu: false,
      }
    },
    computed: {
      ...mapState(useThemeStore, ['theme']),
      ...mapState(useAuthStore, ['isAuthenticated']),
      title() {
        return this.$route.meta.title || 'Default Title'
      },
      route() {
        return this.$route.path
      },
    },
    methods: {
      changeTheme(){
        const useTheme = useThemeStore()
        useTheme.changeTheme()
      },
      toggleMenu() {
        this.showMenu = !this.showMenu
      },
      logout() {
        const userLog = useAuthStore()
        userLog.logout()
        this.$router.push('/')
      }
    },
  }
</script>