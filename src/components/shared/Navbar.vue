<template>
  <nav>
    <router-link to="/" class="icon">
      <img src="../../assets/dark/home.png" alt="Home" class="icon">
    </router-link >
    <h1>{{ Title }}</h1>
    <user>
      <img src="../../assets/dark/sol-y-luna.png" alt="darck/light" class="icon">
      <router-link to="/contact" class="icon">
        <img src="../../assets/dark/contact-icon.png" alt="Contact" class="icon">
      </router-link>
      <router-link to="/login" class="icon">
        <img src="../../assets/dark/user.png" alt="user" class="icon">
      </router-link>
    </user>
  </nav>
</template>

<script>
  export default {
    computed: {
      Title() {
        return this.$route.meta.title || 'Default Title'
      },
    },
  }
</script>