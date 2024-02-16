<template>
  <div v-if="userData">
    <img :src="userData.data.profile_photo" alt="Foto de perfil del usuario" v-if="userData.data.profile_photo">
    <h2>{{ userData.data.name }}</h2>
    <p>Email: {{ userData.data.email }}</p>
    <p>Creation Date: {{ formatDate(userData.data.created_at) }}</p>
    <p>Update Date: {{ formatDate(userData.data.updated_at) }}</p>
    <p>Tasks created: {{ userData.data.tasks && userData.data.tasks.length }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return{
      userData: null,
    }
  },
  methods: {
    async getUserData(id){
      const response = await fetch(`http://api-proyecto-6.test/api/users/${id}`)
      this.userData = await response.json()
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    },
  },
  mounted: async function() {
    const userLogued = localStorage.getItem('userId') || null
    if (userLogued) {
      await this.getUserData(userLogued)
    }
  },
}
</script>
