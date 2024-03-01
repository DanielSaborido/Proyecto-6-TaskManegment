<template>
  <form @submit.prevent="submitForm">
    <label htmlFor="title">Title Task:</label>
    <input
      type="text"
      id="title"
      name="title"
      v-model=title
    />
    <label htmlFor="description">Description Task:</label>
    <input
      type="textarea"
      id="description"
      name="description"
      v-model=description
    />
    <label htmlFor="category">
      Category Task:
      <q v-if="!isAuthenticated">Log in to create your own categories</q>
      <q v-else @click="categoryForm">Click here for new category</q>
    </label>
    <section class="categories">
      <section class="container category" v-for="(category,index) in categories">
        <input type="radio" class="radio" 
          v-bind:id = category.id
          name = "category"
          v-bind:value="category.id"
          v-model="categorieSelected"
          @change="deselectCustomCategory"
        />
        <label v-bind:htmlFor=category.id>{{category.name}}</label>
      </section>
    </section>
    <section class="categories" v-if="isAuthenticated">
      <section class="container category" v-for="(category, index) in userCategories" :key="index">
        <input type="radio" class="radio" 
          v-bind:id = "`user_${category.id}`" 
          v-bind:value="category.id" 
          v-model="customcategorieSelected" 
          @change="deselectGeneralCategory"
        />
        <label v-bind:htmlFor="`user_${category.id}`">{{ category.name }}</label>
      </section>
    </section>
    <label htmlFor="status">Status Task:</label>
    <select v-model=status class="select">
      <option value="complete">Complete</option>
      <option value="processing">Processing</option>
      <option value="pending">Pending</option>
    </select>
    <label for="limitDate">Limit Date:</label>
    <input type="date" id="limitDate" name="limitDate" v-model=limitDate>
    <section class="container">
      <input type="checkbox" class="checkPriority" 
        id = "priority"
        name = "priority"
        v-model=priority
      />
      <label htmlFor="priority">Task priority</label>
    </section>
    <button type="submit">{{ id? 'Save changes':'Create Task' }}</button>
  </form>
  <div v-if="showCategoryForm" class="overlay" @click="hideCategoryForm"></div>
  <form v-if="showCategoryForm" class="fastForm" @submit.prevent="createNewCategory">
    <label for="newCategory">New Category:</label>
    <input type="text" id="newCategory" v-model="newCategoryName" required>
    <label for="category_photo">Category Photo:</label>
    <input type="file" accept="image/png, image/jpg, image/jpeg, image/gift" @change="handleFileChange">
    <button type="submit">Create</button>
  </form>
  <section class="container message error-message" v-if="showErrorMessage" >
    <p>Error: Please check your input.</p>
    <ul>
      <li v-if="{title}">No title of task.</li>
      <li v-if="{description}">The task has not description.</li>
    </ul>
    <button @click="hideMessage">Close</button>
  </section>
</template>

<script>
import { mapState } from 'pinia'
import { useAuthStore } from '../stores/authStore'
import { useCategoryStore } from '../stores/categoryStore'
import { useTaskStore } from '../stores/taskStore'
  export default {
    props: {
      id: {
        type: Number,
        required: false
      }
    },
    computed: {
      ...mapState(useAuthStore, ['userId','isAuthenticated']),
      ...mapState(useCategoryStore, ['categories', 'userCategories']),
      ...mapState(useTaskStore, ['localtaks', 'usertasks']),
    },
    data() {
      return{
        showCategoryForm: false,
        newCategoryName: null,
        newCategoryIcon: null,
        title: null,
        description: null,
        categorieSelected: null,
        customcategorieSelected: null,
        status: "pending",
        creationDate: null,
        limitDate: null,
        priority: false,
        showErrorMessage: false,
      }
    },
    methods:{
      async getCategories() {
        const categoryStore = useCategoryStore()
        await categoryStore.getCategories()
      },
      async getUserCategories() {
        const categoryStore = useCategoryStore()
        await categoryStore.getUserCategories(this.userId)
        this.userCategories = categoryStore.userCategories
      },
      deselectCustomCategory() {
        this.customcategorieSelected = null
      },
      deselectGeneralCategory() {
        this.categorieSelected = null
      },
      async submitForm() {
        if (this.id) {
          await this.updateTask()
        } else {
          await this.createTask()
        }
      },
      categoryForm() {
        this.showCategoryForm = true
      },
      hideCategoryForm() {
        this.showCategoryForm = false
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
        const categoryStore = useCategoryStore()
        try {
          const categoryData = {
            name: this.newCategoryName,
            category_photo: this.newCategoryIcon,
            user_id: parseInt(this.userId),
          };
          await categoryStore.createCategory(categoryData)
          await this.getUserCategories()
        } catch (error) {
          console.error(error)
        }
        this.showCategoryForm = false
      },
      async createTask() {
        if (this.title && this.description) {
          const taskStore = useTaskStore()
          if (this.isAuthenticated) {
            const requestBody = {
              title: this.title,
              user_id: parseInt(this.userId),
              [this.categorieSelected ? 'category_id' : 'user_category_id']: this.categorieSelected ? this.categorieSelected : this.customcategorieSelected,
              description: this.description,
              due_date: this.limitDate,
              status: this.status,
              priority: this.priority,
            }
            taskStore.createTask(this.isAuthenticated, requestBody)
          } else {
            var f = new Date()
            this.creationDate = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear()
            const requestBody = {
              id: this.localtaks.length,
              title: this.title,
              description: this.description,
              category_id: this.categorieSelected,
              status: this.status,
              creationDate: this.creationDate,
              limitDate: this.limitDate,
              priority: this.priority
            } 
            taskStore.createTask(this.isAuthenticated, requestBody)
          }
          this.$router.push('/tasks')
        } else {
          this.showErrorMessage = true
        }
      },
      async updateTask(){
        if (this.title && this.description) {
          const taskStore = useTaskStore()
          if (this.isAuthenticated){
            const requestBody = {
              title: this.title,
              category_id: this.categorieSelected,
              user_category_id: this.customcategorieSelected,
              description: this.description,
              due_date: this.limitDate,
              status: this.status,
              priority: this.priority,
            }
            taskStore.updateTask(this.isAuthenticated, this.id, requestBody)
          } else {
            var f = new Date()
            this.creationDate = f.getDate() + "-" + (f.getMonth() +1) + "-" + f.getFullYear()
            const requestBody = {
              title: this.title,
              description: this.description,
              category_id: this.categorieSelected,
              status: this.status,
              creationDate: this.creationDate,
              limitDate: this.limitDate,
              priority: this.priority
            }
            taskStore.updateTask(this.isAuthenticated, this.id, requestBody) 
          }
          this.$router.push('/tasks')
        } else {
          this.showErrorMessage = true
        }
      },
      hideMessage() {
        this.showErrorMessage = false
        this.showSucceedMessage = false
      },
      async getTasks(loged, userId) {
        const taskStore = useTaskStore()
        taskStore.getTasks(loged, userId)
      },
    },
    created: async function() {
      await this.getTasks(this.isAuthenticated, this.userId)
      await this.getCategories()
      if (this.isAuthenticated) {
        await this.getUserCategories()
      }
      if (this.id) {
        const tasks = this.isAuthenticated ? this.usertasks.data : this.localtaks
        let foundTask = tasks.find((task) => task.id == this.id)
        if (foundTask) {
            this.title = foundTask.title
            this.description = foundTask.description
            this.categorieSelected = foundTask.category_id
            this.isAuthenticated & (this.customcategorieSelected = foundTask.user_category_id)
            this.status = foundTask.status
            this.limitDate = new Date(foundTask.due_date).toISOString().split('T')[0]
            this.priority = foundTask.priority === 1
        } else {
            this.$router.push('/:pathMach(.*)*');
        }
      }
    }
  } 
</script>