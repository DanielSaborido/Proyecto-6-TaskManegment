import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userData: null,
  }),
  actions: {
    async getUserData(userId) {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const userData = await response.json()
        this.userData = userData.data
      } catch (error) {
        console.error(error)
      }
    },
    async createUser(userData) {
      try {
        const response = await fetch('http://localhost:8080/api/users', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
  
        const data = await response.json()
        return data
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    async updateUserData(userId, updatedData) {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        await this.getUserData(userId)
      } catch (error) {
        console.error(error)
      }
    },
    async deleteUserData(userId) {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        this.userData = null
      } catch (error) {
        console.error(error)
      }
    },
  },
})
