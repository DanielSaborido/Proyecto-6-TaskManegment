<template>
    <div>
        <router-link to="/">Home</router-link >
        <h1>{{ Title }}</h1>
        <router-link to="/contact">Contact</router-link>
        <router-link to="/login">Login</router-link>
    </div>
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