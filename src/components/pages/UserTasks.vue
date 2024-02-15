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
    <section v-for="(task, index) in filteredTasks" :key="index" class="task" :style="{ transform: `rotate(${getRandomRotation()}deg)` }">
      <h3>{{ task.title }}</h3>
      <p>{{ truncateDescription(task.description) }}</p>
      <p>Categories: {{ task.categories }}</p>
      <p>Status: {{ task.status }}</p>
      <p :class="{ priority:true, hight:task.priority , low:!task.priority }" @click="changePriority(index)">{{ task.priority? "Hight priority":"Low priority" }}</p>
      <section class="fastAjust">
        <img class="delete" src="../../assets/tasksAjusts/delete.png" alt="delete" @click="deleteTask(index)">
        <img class="edit" src="../../assets/tasksAjusts/libro.png" alt="edit" @click="goToEditPage(index)">
        <img class="update" src="../../assets/tasksAjusts/update.png" alt="update" @click="updateTaskStatus(index)">
      </section>
    </section>
  </article>
  <article v-else>
    <h1>You don't have task to do.</h1>
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
        categories: ["All categories","Home","Job","Others"],
        tasks: [],
        filteredTasks: [],
        userData: null,
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
      getRandomRotation() {
        const rotations = [10, 7.5, 5, 2.5, 0.5, -10, -7.5, -5, -2.5];
        const randomIndex = Math.floor(Math.random() * rotations.length);
        return rotations[randomIndex];
      },
      filterTasks() {
        this.filteredTasks = this.tasks.filter(task => {
          return (this.status === 'default' || task.status === this.status) &&
                (this.category === 0 || task.categories.includes(this.category))
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
        if (description.length > 29) {
          return description.substring(0, 26) + '...'
        } else {
          return description
        }
      },
      changePriority(id){
        this.tasks[id].priority = !this.tasks[id].priority
      },
      deleteTask(index) {
        if (confirm("Are you sure you want to delete this task?")) {
          this.tasks.splice(index, 1)
          localStorage.setItem("tasks", JSON.stringify(this.tasks))
        }
      },
      updateTaskStatus(index) {
        const task = this.filteredTasks[index]
        if (task.status === "pending") {
          task.status = "processing"
        } else if (task.status === "processing") {
          task.status = "complete"
        } else if (task.status === "complete") {
          task.status = "processing"
        }
        localStorage.setItem("tasks", JSON.stringify(this.tasks))
      },
      goToEditPage(index) {
        console.log(index)
      },
      completeAllTasks() {
        this.filteredTasks.forEach(task => {
          task.status = 'complete'
        })
        localStorage.setItem('tasks', JSON.stringify(this.tasks))
      },
      deleteCompletedTasks() {
        this.filteredTasks = this.filteredTasks.filter(task => task.status !== 'complete')
        this.tasks = this.tasks.filter(task => task.status !== 'complete')
        localStorage.setItem('tasks', JSON.stringify(this.tasks))
      },
    },
    mounted: async function() {
      const userLogued = localStorage.getItem('userId') || null
      let localTasks = JSON.parse(localStorage.getItem('tasks')) || []
      if (userLogued) {
        await this.getUserData(userLogued)
        let apiTasks = this.userData.data.tasks
        this.tasks = [...localTasks, ...apiTasks]
      } else {
        this.tasks = localTasks
      }
      this.filterTasks()
    },
  } 
</script>