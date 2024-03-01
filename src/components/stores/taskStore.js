import { defineStore } from 'pinia'

export const useTaskStore = defineStore('task',{
  state: () => ({
    usertasks: [],
    localtaks: [],
  }),
  actions: {
    async getTasks(loged, userId) {
      if (loged){
        try {
          const response = await fetch(`http://localhost:8080/api/tasks?user_id=${userId}`)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()
          this.usertasks = data
        } catch (error) {
          console.error(error)
        }
      } else {
        const localTasks = localStorage.getItem('tasks')
        this.localtaks = localTasks ? JSON.parse(localTasks) : []
      }
    },
    async createTask(loged, taskData) {
      if (loged){
        try {
          const response = await fetch('http://localhost:8080/api/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          console.log(data)
        } catch (error) {
          console.error(error)
        }
      } else {
        var f = new Date()
        this.creationDate = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear()
        let task = taskData
        this.localtaks.push(task)
        localStorage.setItem('tasks', JSON.stringify(this.localtaks))
      }
    },
    async deleteTask(loged, taskId) {
      if (loged) {
        try {
          const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
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
        } catch (error) {
          console.error(error)
        }
      } else {
        this.localtaks = this.localtaks.filter(task => task.id !== taskId)
        localStorage.setItem('tasks', JSON.stringify(this.localtaks))
      }
    },
    async updateTask(loged, taskId, taskData) {
      if (loged) {
        try {
          const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          console.log(data)
        } catch (error) {
          console.error(error)
        }
      } else {
        this.localtaks = this.localtaks.map(task =>
          task.id === taskId ? { ...task, ...taskData } : task
        )
        localStorage.setItem('tasks', JSON.stringify(this.localtaks))
      }
    },
  },
})
