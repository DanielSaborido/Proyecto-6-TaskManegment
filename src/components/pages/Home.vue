<template>
    <button @click="startTrial">Try of 15 days</button>
</template>

<script>
export default{
  methods: {
    startTrial() {
      localStorage.setItem('trialStarted', true);
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 15);
      localStorage.setItem('trialEndDate', trialEndDate);
    },
  },
}
</script>