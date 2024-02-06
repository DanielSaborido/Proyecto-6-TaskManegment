<template>
  <nav>
    <router-link to="/" class="icon">
      <img v-if="route === '/'" src="../../assets/imagotipo-fast-task.svg" alt="Home" class="icon">
      <img v-else-if="theme === 'light' && route !== '/'" src="../../assets/light/logo-horizontal-fast-task.svg" alt="Home" class="icon">
      <img v-else src="../../assets/dark/logo-fast-task-version-blanca.svg" alt="Home" class="icon">
    </router-link>
    <h1 class="title">{{ title }}</h1>
    <user>
      <img v-if="theme === 'light'" src="../../assets/light/sol-y-luna.png" alt="dark/light" class="icon" @click="changeTheme">
      <img v-else src="../../assets/dark/sol-y-luna.png" alt="dark/light" class="icon" @click="changeTheme">
      <router-link to="/contact" class="icon">
        <img v-if="theme === 'light'" src="../../assets/light/contact-icon.png" alt="Contact" class="icon">
        <img v-else src="../../assets/dark/contact-icon.png" alt="Contact" class="icon">
      </router-link>
      <router-link to="/login" class="icon">
        <img v-if="theme === 'light'" src="../../assets/light/user.png" alt="User" class="icon">
        <img v-else src="../../assets/dark/user.png" alt="User" class="icon">
      </router-link>
    </user>
  </nav>
</template>

<script>
  export default {
    computed: {
      title() {
        return this.$route.meta.title || 'Default Title'
      },
      route() {
        return this.$route.path
      },
    },
    data() {
      return {
        theme: "",
      }
    },
    methods: {
      loadTheme() {
        this.theme = localStorage.getItem('theme')
      },
      changeTheme(){
        this.theme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark'
        localStorage.setItem('theme', this.theme)
        document.documentElement.setAttribute('data-theme', this.theme)
      },
      // getThemeImagePath(imageName) {
      //   const folder = this.theme === 'light' ? 'light' : 'dark'
      //   console.log(`../../assets/${folder}/${imageName}.png`)
      //   return `../../assets/${folder}/${imageName}.png`
      // },
    },
    created() {
      this.loadTheme()
    },
  }
</script>