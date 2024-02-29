import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    userCategories: [],
  }),
  actions: {
    async getUserCategories(userId) {
      try {
        const response = await fetch(`http://api-proyecto-6.test/api/user-categories?user_id=${userId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        this.userCategories = data
      } catch (error) {
        console.error(error)
      }
    },
    async createCategory(categoryData) {
      try {
        const response = await fetch('http://api-proyecto-6.test/api/user-categories', {
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
        const response = await fetch(`http://api-proyecto-6.test/api/user-categories/${categoryId}`, {
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
        const response = await fetch(`http://api-proyecto-6.test/api/user-categories/${categoryId}`, {
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
