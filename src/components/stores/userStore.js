import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'

export const useUserStore = defineStore('user', {
  state: () => ({
    userData: null,
  }),
  actions: {
    async fetchUserData() {
      const authStore = useAuthStore()
      const userId = authStore.userId
      try {
        const response = await fetch(`http://api-proyecto-6.test/api/users/${userId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const userData = await response.json()
        this.userData = userData.data
      } catch (error) {
        console.error(error)
      }
    },
  },
})
