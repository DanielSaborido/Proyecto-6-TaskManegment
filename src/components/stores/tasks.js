import { defineStore } from 'pinia'
import { useAuthStore } from './auth-store'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
  }),
  actions: {
    addTask(task) {
      this.tasks.push(task)
    },
    updateTask(taskId, updatedTask) {
      const index = this.tasks.findIndex(task => task.id === taskId)
      if (index !== -1) {
        this.tasks.splice(index, 1, updatedTask)
      }
    },
    removeTask(taskId) {
      this.tasks = this.tasks.filter(task => task.id !== taskId)
    },
  },
})
