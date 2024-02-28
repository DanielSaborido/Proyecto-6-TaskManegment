<template>
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
          <img :src="category.category_photo" alt="Category Photo" style="max-width: 50px; max-height: 50px;">
        </td>
        <td>{{ category.name }}</td>
        <td @click="editCategory(category)"><img class="edit-category" src="../../assets/tasksAjusts/libro.png" alt="edit"></td>
        <td @click="deleteCategory(category.id)"><img class="delete-category" src="../../assets/tasksAjusts/delete.png" alt="delete"></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default{
  data(){
    return {
      userCategories: [],
    }
  },
  methods: {
    async getUserCategories(id){
      const response = await fetch(`http://api-proyecto-6.test/api/users/${id}`)
      const userData = await response.json()
      console.log(userData)
      this.userCategories = userData.data.user_categories
      console.log(this.userCategories)
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