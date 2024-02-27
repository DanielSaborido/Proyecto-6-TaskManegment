<template>
  <div v-if="userData">
    <img :src="userData.data.profile_photo" alt="profile_photo" v-if="userData.data.profile_photo">
    <h2>{{ userData.data.name }}</h2>
    <p>Email: {{ userData.data.email }}</p>
    <p>Creation Date: {{ formatDate(userData.data.created_at) }}</p>
    <p>Update Date: {{ formatDate(userData.data.updated_at) }}</p>
    <p>Tasks created: {{ userData.data.tasks && userData.data.tasks.length }}</p>
    <p>Categories created: {{ userData.data.user_categories && userData.data.user_categories.length }}</p>
    <button @click="showEditForm">Edit user data</button>
  </div>
  <div v-if="showUserForm" class="overlay" @click="hideEditForm"></div>
  <form v-if="showUserForm" class="fastForm" @submit.prevent="updateUserData">
    <label for="name">Name:</label>
    <input v-model="name" type="text" id="name">
    <label for="email">Email:</label>
    <input v-model="email" type="email" id="email">
    <label for="current_password">Password:</label>
    <input v-model="current_password" type="password" id="current_password">
    <label for="password">New Password:</label>
    <input v-model="password" type="password" id="password">
    <label for="profile_photo">Profile Photo:</label>
    <input type="file" id="profile_photo" @change="handleFileChange">
    <button type="submit">Edit user</button>
  </form>
</template>

<script>
export default {
  data() {
    return{
      userData: null,
      showUserForm: false,
      name: null,
      email: null,
      current_password: null,
      password: null,
      profile_photo: null,
    }
  },
  methods: {
    hideEditForm() {
      this.showUserForm = false
    },
    showEditForm() {
      this.showUserForm = true
    },
    async updateUserData() {
      try {
        const requestBody = {
          name: this.name,
          email: this.email,
          current_password: this.current_password,
          password: this.password,
          profile_photo: this.profile_photo,
        }
        const response = await fetch(`http://api-proyecto-6.test/api/users/${this.userData.data.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        await this.getUserData(this.userData.data.id)
        this.showUserForm = false
      } catch (error) {
        console.error(error)
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0]
      this.editedUserData.profile_photo = file
    },
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
