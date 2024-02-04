<template>
  <nav>
    <router-link to="/">
      <img src="../../assets/dark/home.png" alt="Home" class="icon">
    </router-link >
    <h1>{{ Title }}</h1>
    <router-link to="/contact">
      <img src="../../assets/dark/contact-icon.png" alt="Contact" class="icon">
    </router-link>
    <router-link to="/login">
      <img src="../../assets/dark/user.png" alt="user" class="icon">
    </router-link>
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