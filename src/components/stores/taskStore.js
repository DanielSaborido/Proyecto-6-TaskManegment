import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'

export const useTaskStore = defineStore({
  id: 'task',
  state: () => ({
    tasks: [],
  }),
  actions: {
    async fetchTasksFromAPI(userId) {
      try {
        const response = await fetch(`http://api-proyecto-6.test/api/users/${userId}`)
        const userData = await response.json()
        return userData.data.tasks
      } catch (error) {
        console.error(error)
        return []
      }
    },
    async addTask(task) {
      const authStore = useAuthStore()
      if (authStore.isAuthenticated) {
        try {
          const response = await fetch('http://api-proyecto-6.test/api/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
          })
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()
          console.log(data)
          this.tasks.push(data.task)
        } catch (error) {
          console.error(error)
        }
      } else {
        this.tasks.push(task)
        localStorage.setItem('tasks', JSON.stringify(this.tasks))
      }
    },
    async deleteTask(taskId) {
      const authStore = useAuthStore()
      if (authStore.isAuthenticated) {
        try {
          const response = await fetch(`http://api-proyecto-6.test/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          console.log(data)
          this.tasks = this.tasks.filter(task => task.id !== taskId)
        } catch (error) {
          console.error(error)
        }
      } else {
        this.tasks = this.tasks.filter(task => task.id !== taskId)
        localStorage.setItem('tasks', JSON.stringify(this.tasks))
      }
    },
    async updateTask(taskId, updatedTask) {
      const authStore = useAuthStore()
      if (authStore.isAuthenticated){
        try {
          const response = await fetch(`http://api-proyecto-6.test/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTask),
          })
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
        } catch (error) {
          console.error(error)
        }
      } else {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || []
        var f = new Date()
        this.creationDate = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear()
        let task = updatedTask
        tasks.push(task)
        localStorage.setItem('tasks', JSON.stringify(tasks))   
      }
      this.$router.push('/tasks')
    },
    async completeAllTasks() {
      const authStore = useAuthStore()
      if (authStore.isAuthenticated) {
        try {
          const tasksToUpdate = this.tasks.filter(task => task.status !== 'complete')
          const promises = tasksToUpdate.map(task => {
            return fetch(`http://api-proyecto-6.test/api/tasks/${task.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                status: 'complete',
              }),
            })
          })
          await Promise.all(promises)
          this.tasks.forEach(task => {
            if (task.status !== 'complete') {
              task.status = 'complete'
            }
          })
        } catch (error) {
          console.error(error)
        }
      } else {
        this.tasks.forEach(task => {
          if (task.status !== 'complete') {
            task.status = 'complete'
          }
        })
        localStorage.setItem('tasks', JSON.stringify(this.tasks))
      }
    },
    async deleteCompletedTasks() {
      const authStore = useAuthStore()
      if (authStore.isAuthenticated) {
        try {
          const tasksToDelete = this.tasks.filter(task => task.status === 'complete')
          const promises = tasksToDelete.map(task => {
            return fetch(`http://api-proyecto-6.test/api/tasks/${task.id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            })
          })
          await Promise.all(promises)
          this.tasks = this.tasks.filter(task => task.status !== 'complete')
        } catch (error) {
          console.error(error)
        }
      } else {
        this.tasks = this.tasks.filter(task => task.status !== 'complete')
        localStorage.setItem('tasks', JSON.stringify(this.tasks))
      }
    },
  },
})
