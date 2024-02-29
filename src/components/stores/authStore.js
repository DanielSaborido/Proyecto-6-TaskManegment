import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userId: localStorage.getItem('userId') || null,
    isAuthenticated: !!localStorage.getItem('userId'),
  }),
  actions: {
    login(userId) {
      this.isAuthenticated = true
      localStorage.setItem('userId', userId)
      localStorage.removeItem('trialStarted')
      localStorage.removeItem('trialEndDate')
      localStorage.removeItem('tasks')
    },
    logout() {
      this.isAuthenticated = false
      localStorage.removeItem('userId')
    },
  },
})
