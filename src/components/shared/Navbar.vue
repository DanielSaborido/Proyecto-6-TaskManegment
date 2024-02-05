<template>
  <nav>
    <router-link to="/" class="icon">
      <img v-if="theme === 'light'" src="../../assets/light/home.png" alt="Home" class="icon">
      <img v-else src="../../assets/dark/home.png" alt="Home" class="icon">
    </router-link>
    <h1>{{ title }}</h1>
    <div>
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
    </div>
  </nav>
</template>

<script>
  export default {
    computed: {
      title() {
        return this.$route.meta.title || 'Default Title'
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
        console.log(this.theme)
        this.theme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark'
        console.log(this.theme)
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