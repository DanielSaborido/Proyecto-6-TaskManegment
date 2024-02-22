<template>
  <section class="control">
    <router-link to="/taskf" class="router">Create Task</router-link>
    <select v-model=status class="filter">
      <option value="default">All Tasks</option>
      <option value="complete">Complete</option>
      <option value="processing">Processing</option>
      <option value="pending">Pending</option>
    </select>
    <select v-model=order class="filter">
      <option value="default">Order by</option>
      <option value="priority">Priority</option>
      <option value="status">Status</option>
      <option value="date">Date</option>
    </select>
    <select v-model=category v-if=(categories.length) class="filter">
      <option v-for="(categoryData,index) in categories" v-bind:value=index>{{categoryData}}</option>
    </select>
  </section>
  <article v-if="filteredTasks.length > 0" class="tasks">
    <section v-for="(task, index) in filteredTasks" :key="index" :class="{ task: true, [task.rotationClass]: true }">
      <h3>{{ task.title }}</h3>
      <p>{{ truncateDescription(task.description) }}</p>
      <p>Category: 
        <img v-if="getCategory(task.category_id).category_photo" :src="getCategory(task.category_id).category_photo" :alt="getCategory(task.category_id).name">
        <span v-else>{{ getCategory(task.category_id).name }}</span>
      </p>
      <p>Status: {{ task.status }}</p>
      <p :class="{ priority:true, hight:task.priority , low:!task.priority }" @click="changePriority(index)">{{ task.priority? "Hight priority":"Low priority" }}</p>
      <section class="fastAjust">
        <img class="delete" src="../../assets/tasksAjusts/delete.png" alt="delete" @click="deleteTask(task.id? task.id : index)">
        <img class="edit" src="../../assets/tasksAjusts/libro.png" alt="edit" @click="goToEditPage(task.id? task.id : index)">
        <img class="update" src="../../assets/tasksAjusts/update.png" alt="update" @click="updateTaskStatus(index)">
      </section>
    </section>
  </article>
  <article v-else>
    <h2>You don't have task to do.</h2>
    <h3>Start creating tasks to do </h3>
  </article>
  <section class="bt-complete">
    <button @click="completeAllTasks">Marck all tasks as complete</button>
    <button @click="deleteCompletedTasks">Delete all complete tasks</button>
  </section>
</template>

<script>
  export default {
    data() {
      return{
        status: "default",
        order: "default",
        category: 0,
        categories: ["All categories","Home","Job","Activities","Others"],
        tasks: [],
        filteredTasks: [],
        rotationClasses: ["rotate75", "rotate5", "rotate25", "rotate0", "rotate-75", "rotate-5", "rotate-25"],
        logued: !!localStorage.getItem('userId'),
        userData: null,
        categoryData: null,
        userId: localStorage.getItem('userId') || null,
      }
    },
    watch: {
      tasks: {
        handler() {
          this.filterTasks()
        },
        deep: true,
      },
      status() {
        this.filterTasks()
      },
      order() {
        this.sortTasks()
      },
      category() {
        this.filterTasks()
      },
    },
    methods: {
      async getUserData(id){
        const response = await fetch(`http://api-proyecto-6.test/api/users/${id}`)
        this.userData = await response.json()
      },
      async getCategories(){
        const response = await fetch(`http://api-proyecto-6.test/api/categories`)
        this.categoryData = await response.json()
      },
      getRandomRotationClass() {
        const randomIndex = Math.floor(Math.random() * this.rotationClasses.length);
        return this.rotationClasses[randomIndex];
      },
      filterTasks() {
        this.filteredTasks = this.tasks.filter(task => {
          return (this.status === 'default' || task.status === this.status) &&
                (this.category === 0 || task.categories === this.category || task.category_id === this.category)
        })
        this.sortTasks()
      },
      sortTasks() {
        if (this.order !== 'default') {
          this.filteredTasks.sort((a, b) => {
            if (this.order === 'priority') {
              return b.priority - a.priority
            } else if (this.order === 'status') {
              const orderMapping = { 'pending': 1, 'processing': 2, 'complete': 3 }
              return orderMapping[a.status] - orderMapping[b.status]
            } else if (this.order === 'date') {
              return new Date(a.limitDate) - new Date(b.limitDate)
            }
          })
        }
      },
      truncateDescription(description) {
        if (description.length > 30) {
          return description.substring(0, 27) + '...'
        } else {
          return description
        }
      },
      getCategory(categoryId) {
        if (this.categoryData) {
          const matchingCategory = this.categoryData.find(category => category.id === categoryId)
          return matchingCategory ? matchingCategory : { name: 'Unknown', category_photo: null }
        } else {
          return { name: 'Unknown', category_photo: null }
        }
      },
      async changePriority(id){
        if (this.logued) {
          try {
            const taskId = this.filteredTasks[id].id
            const newPriority = !this.filteredTasks[id].priority
            const response = await fetch(`http://api-proyecto-6.test/api/tasks/${taskId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                priority: newPriority,
              }),
            })
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            this.filteredTasks[id].priority = newPriority
          } catch (error) {
            console.error(error)
          }
        } else {
          this.tasks[id].priority = !this.tasks[id].priority
          localStorage.setItem("tasks", JSON.stringify(this.tasks))
        }
      },
      async deleteTask(index) {
        if (confirm("Are you sure you want to delete this task?")) {
          if (this.logued){
            try {
              const response = await fetch(`http://api-proyecto-6.test/api/tasks/${index}`, {
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
              this.tasks = this.tasks.filter(task => task.id !== index)
            } catch (error) {
              console.error(error)
            }
          } else {
            this.tasks.splice(index, 1)
            localStorage.setItem("tasks", JSON.stringify(this.tasks))
          }
        }
      },
      async updateTaskStatus(index) {
        if (this.logued) {
          try {
            const taskId = this.filteredTasks[index].id
            let newStatus = this.filteredTasks[index].status
            if (newStatus === "pending") {
                newStatus = "processing"
            } else if (newStatus === "processing") {
                newStatus = "complete"
            } else if (newStatus === "complete") {
                newStatus = "processing"
            }
            const response = await fetch(`http://api-proyecto-6.test/api/tasks/${taskId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                status: newStatus,
              }),
            })
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            this.filteredTasks[index].status = newStatus
          } catch (error) {
            console.error(error)
          }
        } else {
          const task = this.filteredTasks[index]
          if (task.status === "pending") {
            task.status = "processing"
          } else if (task.status === "processing") {
            task.status = "complete"
          } else if (task.status === "complete") {
            task.status = "processing"
          }
          localStorage.setItem("tasks", JSON.stringify(this.tasks))
        }
      },
      goToEditPage(index) {
        this.$router.push(`/taskf/${index}`)
      },
      async completeAllTasks() {
        if (this.logued) {
          try {
            for (let task of this.filteredTasks) {
              const taskId = task.id
              let newStatus = task.status
              newStatus = "complete"
              const response = await fetch(`http://api-proyecto-6.test/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  status: newStatus,
                }),
              })
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
              }
              task.status = newStatus
            }
          } catch (error) {
            console.error(error)
          }  
        } else {
          this.filteredTasks.forEach(task => {
            task.status = 'complete'
          })
          localStorage.setItem('tasks', JSON.stringify(this.tasks))
        }
      },
      async deleteCompletedTasks() {
        if (this.logued) {
          try {
            for (let task of this.filteredTasks) {
              let taskStatus = task.status
              if (taskStatus == 'complete'){
                const taskId = task.id
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
              }
              
            }
          } catch (error) {
            console.error(error)
          }  
        } else {
          this.filteredTasks = this.filteredTasks.filter(task => task.status !== 'complete')
          this.tasks = this.tasks.filter(task => task.status !== 'complete')
          localStorage.setItem('tasks', JSON.stringify(this.tasks))
        }
      },
      async fetchDataFromAPI() {
        try {
          const response = await fetch(`http://api-proyecto-6.test/api/users/${this.userId}`)
          const userData = await response.json()
          const apiTasks = userData.data.tasks
          return apiTasks
        } catch (error) {
          console.error(error)
          return []
        }
      },
    },
    mounted: async function() {
      await this.getCategories()
      let localTasks = JSON.parse(localStorage.getItem('tasks')) || []
      let apiTasks = []
      if (this.userId) {
        apiTasks = await this.fetchDataFromAPI()
      }
      this.tasks = [...localTasks, ...apiTasks]
      this.tasks.forEach(task => {
        task.rotationClass = this.getRandomRotationClass()
      })
      this.filterTasks()
    },
  } 
</script>