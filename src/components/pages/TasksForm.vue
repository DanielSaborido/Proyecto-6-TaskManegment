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
      <q v-if="!logued">Log in to create your own categories</q>
      <q v-else @click="categoryForm">Click here for new category</q>
    </label>
    <section class="categories">
      <section class="container category" v-for="(category,index) in categories">
        <input type="radio" class="radio" 
          v-bind:id = index+1
          name = "category"
          v-bind:value="index+1"
          v-model="categorieSelected"
          @change="deselectCustomCategory"
        />
        <label v-bind:htmlFor=index+1>{{category}}</label>
      </section>
    </section>
    <section class="categories" v-if="logued">
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
    <label for="limitTime">Limit Time:</label>
    <input type="time" id="limitTime" name="limitTime" v-model=limitTime>
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
    <input type="file" accept="imge/png, image/jpg, image/jpeg, image/gift" @change="handleFileChange">
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
  export default {
    props: {
      id: {
        type: Number,
        required: false
      }
    },
    data() {
      return{
        title: null,
        description: null,
        categories: ["Home","Job","Activities","Others"],
        categorieSelected: null,
        customcategorieSelected: null,
        showCategoryForm: false,
        newCategoryName: null,
        newCategoryIcon: null,
        status: "pending",
        creationDate: null,
        limitDate: null,
        limitTime:null,
        priority: false,
        showErrorMessage: false,
        logued: !!localStorage.getItem('userId'),
        userId: localStorage.getItem('userId') || null,
        userTasks: null,
        userCategories: [],
      }
    },

    methods:{
      deselectCustomCategory() {
        this.customcategorieSelected = null
      },
      deselectGeneralCategory() {
        this.categorieSelected = null
      },
      submitForm() {
        if (this.id) {
          this.updateTask()
        } else {
          this.createTask()
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
        try {
          const responseTask = await fetch('http://api-proyecto-6.test/api/user-categories', {
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
          if (!responseTask.ok) {
            throw new Error(`HTTP error! status: ${responseTask.status}`)
          }
          const dataTask = await responseTask.json()
          console.log(dataTask)
        } catch (error) {
          console.error(error)
        }
        this.showCategoryForm = false
      },
      async createTask() {
        if (this.title && this.description) {
          if (this.logued) {
            try {
              const requestBody = {
                title: this.title,
                user_id: parseInt(this.userId),
                [this.categorieSelected ? 'category_id' : 'user_category_id']: this.categorieSelected ? this.categorieSelected : this.customcategorieSelected,
                description: this.description,
                due_date: this.limitDate,
                status: this.status,
                priority: this.priority,
              }
              const responseTask = await fetch('http://api-proyecto-6.test/api/tasks', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(requestBody),
              })
              if (!responseTask.ok) {
                throw new Error(`HTTP error! status: ${responseTask.status}`)
              }
              const dataTask = await responseTask.json()
              console.log(dataTask)
            } catch (error) {
              console.error(error)
            }
          } else {
            let tasks = JSON.parse(localStorage.getItem('tasks')) || []
            var f = new Date()
            this.creationDate = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear()
            let task = {
              id: tasks.length,
              title: this.title,
              description: this.description,
              category_id: this.categorieSelected,
              status: this.status,
              creationDate: this.creationDate,
              limitDate: this.limitDate,
              priority: this.priority
            }
            tasks.push(task)
            localStorage.setItem('tasks', JSON.stringify(tasks))   
          }
          this.$router.push('/tasks')
        } else {
          this.showErrorMessage = true
        }
      },
      async updateTask(){
        if (this.title && this.description) {
          if (this.logued){
            try {
              const response = await fetch(`http://api-proyecto-6.test/api/tasks/${this.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  title: this.title,
                  category_id: this.categorieSelected,
                  user_category_id: this.customcategorieSelected,
                  description: this.description,
                  due_date: this.limitDate,
                  status: this.status,
                  priority: this.priority,
                }),
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
            this.creationDate = f.getDate() + "-" + (f.getMonth() +1) + "-" + f.getFullYear()
            let task = {
              title: this.title,
              description: this.description,
              category_id: this.categorieSelected,
              status: this.status,
              creationDate: this.creationDate,
              limitDate: this.limitDate,
              priority: this.priority
            }
            tasks.push(task)
            localStorage.setItem('tasks', JSON.stringify(tasks))   
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
      async fetchUserCategories() {
        try {
          const response = await fetch(`http://api-proyecto-6.test/api/users/${this.userId}`)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()
          this.userCategories = data.data.user_categories
        } catch (error) {
          console.error(error)
        }
      },
      async fetchDataFromAPI() {
        try {
          const response = await fetch(`http://api-proyecto-6.test/api/users/${this.userId}`)
          const userData = await response.json()
          this.userTasks = userData.data.tasks
        } catch (error) {
          console.error(error)
          return []
        }
      },
    },
    created: async function() {
      await this.fetchUserCategories()
      if (this.userId && this.id) {
        await this.fetchDataFromAPI()
        console.log(this.userTasks)
        console.log(this.userTasks.find((task) => task.id == this.id))
        let foundTask = this.userTasks.find((task) => task.id == this.id)
        if (foundTask) {
            this.title = foundTask.title
            this.description = foundTask.description
            this.categorieSelected = foundTask.category_id
            this.customcategorieSelected = foundTask.user_category_id
            this.status = foundTask.status
            this.limitDate = new Date(foundTask.due_date).toISOString().split('T')[0]
            this.priority = foundTask.priority === 1
        } else {
          this.$router.push('/:pathMach(.*)*')
        }
      }
    }
  } 
</script>