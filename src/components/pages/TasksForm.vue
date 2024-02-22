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
    <label htmlFor="category">Category Task: <q v-if="!logued">Log in for create your own categories</q></label>
    <section class="categories">
      <section class="container category" v-for="(category,index) in categories">
        <input type="radio" class="radio" 
          v-bind:id = index+1
          name = "category"
          v-bind:value="index+1"
          v-model="categorieSelected"
        />
        <label v-bind:htmlFor=index+1>{{category}}</label>
      </section>
    </section>
    <section class="categories" v-if="logued">
      <section class="container category" v-for="(opcion, index) in categoriesCreated" :key="index">
        <input type="radio" class="radio" v-bind:value="index+5" v-model="categorieSelected">
        <input type="text" v-model="categoriesCreated[index].category" @input="createCategory(index)" placeholder="Category" class="categoryInfo">
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
        categoriesCreated: [{ category: '' }],
        categorieSelected: 0,
        status: "pending",
        creationDate: null,
        limitDate: null,
        priority: false,
        showErrorMessage: false,
        logued: !!localStorage.getItem('userId'),
        userId: localStorage.getItem('userId') || null,
        userTasks: null,
      }
    },

    methods:{
      submitForm() {
        if (this.id) {
          this.updateTask()
        } else {
          this.createTask()
        }
      },
      createCategory(index) {
        if (index === this.categoriesCreated.length - 1) {
          const currentCategory = this.categoriesCreated[index].category.trim();
          if (currentCategory !== '') {
            this.categoriesCreated.push({ category: '' });
          } else {
            this.categoriesCreated.splice(index, 1);
          }
        }
      },
      async createTask() {
        if (this.title && this.description) {
          if (this.logued){
            try {
              const response = await fetch('http://api-proyecto-6.test/api/tasks', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  title: this.title,
                  user_id: parseInt(this.userId),
                  category_id: this.categorieSelected,
                  description: this.description,
                  due_date: this.limitDate,
                  status: this.status,
                  priority: this.priority,
                }),
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
            this.creationDate = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear()
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
      if (this.userId && this.id) {
        await this.fetchDataFromAPI()
        console.log(this.userTasks)
        console.log(this.userTasks.find((task) => task.id == this.id))
        let foundTask = this.userTasks.find((task) => task.id == this.id)
        if (foundTask) {
            this.title = foundTask.title
            this.description = foundTask.description
            this.categorieSelected = foundTask.category_id
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