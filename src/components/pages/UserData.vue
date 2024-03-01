<template>
  <div v-if="userData">
    <img :src="'http://localhost:8080/storage/' + userData.profile_photo" alt="profile_photo" v-if="userData.profile_photo" class="profile">
    <h2>{{ userData.name }}</h2>
    <p>Email: {{ userData.email }}</p>
    <p>Creation Date: {{ formatDate(userData.created_at) }}</p>
    <p>Update Date: {{ formatDate(userData.updated_at) }}</p>
    <p>Tasks created: {{ userData.tasks && userData.tasks.length }}</p>
    <p>Categories created: {{ userData.user_categories && userData.user_categories.length }}</p>
    <button @click="showEditForm">Edit user data</button>
    <button @click="deleteUserData">Delete Account</button>
  </div>
  <div v-if="showUserForm" class="overlay" @click="hideEditForm"></div>
  <form v-if="showUserForm" class="fastForm" @submit.prevent="updateUserData">
    <label for="name">Name:</label>
    <input v-model="name" type="text" id="name">
    <label for="email">Email:</label>
    <input v-model="email" type="email" id="email">
    <label for="current_password">Current Password:</label>
    <input v-model="current_password" type="password" id="current_password">
    <label for="password">New Password:</label>
    <input v-model="password" type="password" id="password">
    <label for="profile_photo">Profile Photo:</label>
    <input type="file" accept="image/png, image/jpg, image/jpeg, image/gif" @change="handleFileChange">
    <button type="submit">Edit user</button>
  </form>
</template>

<script>
import { useUserStore } from '../stores/userStore'
import { useAuthStore } from '../stores/authStore'
import { mapState } from 'pinia'

export default {
  data() {
    return {
      showUserForm: false,
      name: null,
      email: null,
      current_password: null,
      password: null,
      profile_photo: null,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userId', 'isAuthenticated']),
    ...mapState(useUserStore, ['userData']),
  },
  methods: {
    async getUserData() {
      const userStore = useUserStore()
      await userStore.getUserData(this.userId)
    },
    hideEditForm() {
      this.showUserForm = false
    },
    showEditForm() {
      this.showUserForm = true
    },
    async updateUserData() {
      const userStore = useUserStore()
      try {
        const requestBody = {
          name: this.name,
          email: this.email,
          current_password: this.current_password,
          password: this.password,
          profile_photo: this.profile_photo,
        }

        await userStore.updateUserData(this.userId, requestBody)
        await this.getUserData()

        this.name = null
        this.email = null
        this.current_password = null
        this.password = null
        this.profile_photo = null
        this.showUserForm = false
      } catch (error) {
        console.error(error)
      }
    },
    handleFileChange(event) {
      const file = new FileReader()
      file.readAsDataURL(event.target.files[0])
      file.onload = () => {
        this.profile_photo = file.result
      }
    },
    async deleteUserData() {
      if (confirm("Are you sure you want to delete your account?")) {
        const userStore = useUserStore()
        try {
          await userStore.deleteUserData(this.userData.id)
          this.logout()
        } catch (error) {
          console.error(error)
        }
      }
    },
    logout() {
      const userLog = useAuthStore()
      userLog.logout()
      this.$router.push('/')
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    },
  },
  mounted: async function () {
    if (this.isAuthenticated) {
      await this.getUserData()
    }
  },
}
</script>
