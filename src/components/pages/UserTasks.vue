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
      <option value="default">All categories</option>
      <option v-for="categoryData in categories" v-bind:value=categoryData>{{categoryData}}</option>
    </select>
  </section>
  <section v-if="filteredTasks.length > 0" class="tasks">
    <div v-for="(task, index) in filteredTasks" :key="index" class="task">
      <h3>{{ task.title }}</h3>
      <p>{{ task.description }}</p>
      <p>{{ task.categories }}</p>
      <p>{{ task.status }}</p>
      <p :class="{ priority:true, hight:task.priority , low:!task.priority }">{{ task.priority? "Hight priority":"Low priority" }}</p>
    </div>
  </section>
  <section v-else>
    <h1>You don't have task to do.</h1>
    <h3>Start creating tasks to do </h3>
  </section>
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
        categories: ["Home","Job","Others"],
        category: "default",
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
      filterTasks() {
        this.filteredTasks = this.tasks.filter(task => {
          return (this.status === 'default' || task.status === this.status) &&
                (this.category === 'default' || task.categories.includes(this.category))
        })
        this.sortTasks()
      },
      sortTasks() {
        if (this.order !== 'default') {
          this.filteredTasks.sort((a, b) => {
            if (this.order === 'priority') {
              return b.priority - a.priority
            } else if (this.order === 'status') {
              return a.status.localeCompare(b.status)
            } else if (this.order === 'date') {
              return new Date(a.limitDate) - new Date(b.limitDate)
            }
          })
        }
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