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
      <router-link v-if="!userData" to="/login" class="userIcon">
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
  export default {
    data() {
      return {
        theme: "",
        showMenu: false,
        userData: localStorage.getItem('userId'),
      }
    },
    computed: {
      title() {
        return this.$route.meta.title || 'Default Title'
      },
      route() {
        return this.$route.path
      },
    },
    watch: {
      '$route': 'checkUser'
    },
    created() {
      this.loadTheme()
      this.checkUser();
    },
    methods: {
      checkUser() {
        this.userData = localStorage.getItem('userId');
      },
      loadTheme() {
        this.theme = localStorage.getItem('theme')
      },
      changeTheme(){
        this.theme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark'
        localStorage.setItem('theme', this.theme)
        document.documentElement.setAttribute('data-theme', this.theme)
      },
      toggleMenu() {
        this.showMenu = !this.showMenu
      },
      logout() {
        localStorage.removeItem('userId')
        localStorage.removeItem('tasks')
        this.userData = null
        this.$router.push('/')
      }
    },
  }
</script>