<template>
    <section class="posit">
       <h2 class="typing-animation">404</h2>
        <h3 class="typing-animation" v-if="showErrorMessage">ERROR. Page not found</h3> 
    </section>
</template>

<script>
export default {
  data() {
    return {
      showErrorMessage: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.showErrorMessage = true;
    }, 1000);
  },
};
</script>