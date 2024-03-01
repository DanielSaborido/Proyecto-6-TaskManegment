import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    userCategories: [],
  }),
  actions: {
    async getCategories(){
      const response = await fetch(`http://localhost:8080/api/categories`)
      this.categories = await response.json()
    },
    async getUserCategories(userId) {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        this.userCategories = data.user_categories
      } catch (error) {
        console.error(error)
      }
    },
    async createCategory(categoryData) {
      try {
        const response = await fetch('http://localhost:8080/api/user-categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryData),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log(data)
      } catch (error) {
        console.error(error)
      }
    },
    async deleteCategory(categoryId) {
      try {
        const response = await fetch(`http://localhost:8080/api/user-categories/${categoryId}`, {
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
    },
    async updateCategory(categoryId, categoryData) {
      try {
        const response = await fetch(`http://localhost:8080/api/user-categories/${categoryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryData),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log(data)
      } catch (error) {
        console.error(error)
      }
    },
  },
})
