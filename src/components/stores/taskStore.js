import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'

export const useTaskStore = defineStore('task',{
  state: () => ({
    tasks: [],
  }),
  actions: {
  },
})
