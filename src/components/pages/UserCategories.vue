<template>
  <button @click="categoryForm(null)">Create New Category</button>
  <table>
    <thead>
      <tr>
        <th>Index</th>
        <th>Category Photo</th>
        <th>Category Name</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(category, index) in userCategories" :key="category.id">
        <td>{{ index + 1 }}</td>
        <td>
          <img :src="category.category_photo" alt="Category Photo" class="category-icon">
        </td>
        <td>{{ category.name }}</td>
        <td @click="categoryForm(category)">
          <img v-if="theme === 'light'" src="../../assets/light/libro.png" class="edit-category edit-light" alt="edit">
          <img v-else src="../../assets/dark/libro.png" class="edit-category edit-dark" alt="edit">
        </td>
        <td @click="deleteCategory(category.id)">
          <img v-if="theme === 'light'" src="../../assets/light/delete.png" class="delete-category delete-light" alt="delete">
          <img v-else src="../../assets/dark/delete.png" class="delete-category delete-dark" alt="delete">
        </td>
      </tr>
    </tbody>
  </table>
  <div v-if="showCategoryForm" class="overlay" @click="hideCategoryForm"></div>
  <form v-if="showCategoryForm" class="fastForm" @submit.prevent="editingCategory ? editCategory() : createNewCategory()">
    <label for="newCategory">{{ editingCategory ? 'Edit' : 'New' }} Category:</label>
    <input type="text" id="newCategory" v-model="newCategoryName" required>
    <label for="category_photo">Category Photo:</label>
    <input type="file" accept="image/png, image/jpg, image/jpeg, image/gif" @change="handleFileChange">
    <button type="submit">{{ editingCategory ? 'Update' : 'Create' }}</button>
  </form>
</template>

<script>
import { useThemeStore } from '../stores/themeStore'
import { mapState } from 'pinia';
export default{
  computed: {
    ...mapState(useThemeStore, ['theme']),
  },
  data(){
    return {
      userCategories: [],
      showCategoryForm: false,
      newCategoryName: null,
      newCategoryIcon: null,
      editingCategory: null,
      userId: localStorage.getItem('userId'),
    }
  },
  methods: {
    categoryForm(category) {
      this.showCategoryForm = true
      this.editingCategory = category
      this.newCategoryName = category ? category.name : null
      this.newCategoryIcon = category ? category.category_photo : null
    },
    hideCategoryForm() {
      this.showCategoryForm = false
    },
    async getUserCategories(id){
      const response = await fetch(`http://api-proyecto-6.test/api/users/${id}`)
      const userData = await response.json()
      this.userCategories = userData.data.user_categories
    },
    handleFileChange(event) {
      const file = new FileReader()
      file.readAsDataURL(event.target.files[0])
      file.onload = () => {
        this.newCategoryIcon = file.result
        console.log(this.newCategoryIcon)
      }
    },
    async createNewCategory() {
      try {
        const responseCategory = await fetch('http://api-proyecto-6.test/api/user-categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.newCategoryName,
            category_photo: this.newCategoryIcon,
            user_id: parseInt(this.userId),
          }),
        })
        if (!responseCategory.ok) {
          throw new Error(`HTTP error! status: ${responseCategory.status}`)
        }
        const dataCategory = await responseCategory.json()
        console.log(dataCategory)
        await this.getUserCategories(this.userId)
      } catch (error) {
          console.error(error)
      }
      this.showCategoryForm = false
    },
    async deleteCategory(id) {
      if (confirm("Are you sure you want to delete this category?\nThe tasks whit this category will be removed to.")) {
      console.log(id)
        try {
          const response = await fetch(`http://api-proyecto-6.test/api/user-categories/${id}`, {
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
          await this.getUserCategories(this.userId)
        } catch (error) {
          console.error(error)
        }
      }
    },
    async editCategory() {
      try {
        const response = await fetch(`http://api-proyecto-6.test/api/user-categories/${this.editingCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.newCategoryName,
            category_photo: this.newCategoryIcon,
            user_id: parseInt(this.userId),
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log(data);
        await this.getUserCategories(this.userId);
      } catch (error) {
        console.error(error);
      }
  
      this.showCategoryForm = false;
    },
  },
  created: async function() {
    const userLogued = localStorage.getItem('userId') || null
    if (userLogued) {
      await this.getUserCategories(userLogued)
    }
  },
}
</script>