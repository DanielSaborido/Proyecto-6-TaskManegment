<template>
  <section :class="{ posit: true, paste: pasteMessage }" ref="paste">
    <h2 class="number typing-animation" ref="number">404</h2>
    <h3 class="info typing-animation" v-if="showErrorMessage" ref="error">
      ERROR. Page not found
    </h3>
  </section>
</template>

<script>
export default {
  data() {
    return {
      showErrorMessage: false,
      pasteMessage: false,
    }
  },
  mounted() {
    setTimeout(() => {
      this.showErrorMessage = true;
      setTimeout(() => {
        this.pasteMessage = true;
      }, 1200);
    }, 1000);
  },
};
</script>