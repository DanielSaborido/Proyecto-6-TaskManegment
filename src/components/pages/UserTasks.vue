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
      <option value="priority">Order by priority</option>
      <option value="status">Status</option>
      <option value="date">Limit Date</option>
    </select>
    <select v-model=categorySelected class="filter">
      <option v-bind:value=0>All categories</option>
      <option v-for="(category, index) in categories" v-bind:value="'category_' + category.id">{{ category.name }}</option>
      <option v-for="(userCategory, index) in userCategories" v-bind:value="'userCategory_' + userCategory.id">{{ userCategory.name }}</option>
    </select>
  </section>
  <section v-if="filteredTasks.length > 0" class="tasks">
    <article v-for="(task, index) in filteredTasks" :key="index" :class="{ task: true, [task.rotationClass]: true, zoom: true }" @click="showTaskDetails(task)">
      <h3>{{ task.title }}</h3>
      <p>{{ truncateDescription(task.description) }}</p>
      <p v-if="task.category_id">Category: 
        <img v-if="getCategory(task.category_id, false).category_photo" :src="getCategory(task.category_id, false).category_photo" :alt="getCategory(task.category_id, false).name" class="category-icon">
        <span v-else>{{ getCategory(task.category_id, false).name }}</span>
      </p>
      <p v-if="task.user_category_id">Category: 
        <img v-if="getCategory(task.user_category_id, true).category_photo" :src="getCategory(task.user_category_id, true).category_photo" :alt="getCategory(task.user_category_id, true).name" class="category-icon">
        <span v-else>{{ getCategory(task.user_category_id, true).name }}</span>
      </p>
      <p>Status: {{ task.status }}</p>
      <p :class="{ priority:true, hight:task.priority , low:!task.priority }" @click.stop="changePriority(task.id? task.id : index)" title="Change task priority">{{ task.priority? "Hight priority":"Low priority" }}</p>
      <section class="fastAjust">
        <img class="delete" src="../../assets/light/delete.png" alt="delete" @click.stop="deleteTask(task.id? task.id : index)" title="Delete task">
        <img class="edit" src="../../assets/light/libro.png" alt="edit" @click.stop="goToEditPage(task.id? task.id : index)" title="Edit task">
        <img class="update" src="../../assets/light/update.png" alt="update" @click.stop="updateTaskStatus(task.id? task.id : index)" title="Update task status">
      </section>
    </article>
    <div v-if="taskSelected" class="overlay" @click="hideTaskDetails"></div>
    <article v-if="taskSelected" class="task task-details-container">
      <h3>{{ taskSelected.title }}</h3>
      <p>{{ taskSelected.description }}</p>
      <p v-if="taskSelected.category_id">Category: 
        <img v-if="getCategory(taskSelected.category_id, false).category_photo" :src="getCategory(taskSelected.category_id, false).category_photo" :alt="getCategory(taskSelected.category_id, false).name" class="category-icon">
        <span v-else>{{ getCategory(taskSelected.category_id, false).name }}</span>
      </p>
      <p v-if="taskSelected.user_category_id">Category: 
        <img v-if="getCategory(taskSelected.user_category_id, true).category_photo" :src="getCategory(taskSelected.user_category_id, true).category_photo" :alt="getCategory(taskSelected.user_category_id, true).name" class="category-icon">
        <span v-else>{{ getCategory(taskSelected.user_category_id, true).name }}</span>
      </p>
      <p>Status: {{ taskSelected.status }}</p>
      <p>Creation date: {{ taskSelected.creation_date.replace(' ', ' - ') }}</p>
      <p>Update date: {{ taskSelected.update_date.replace(' ', ' - ') }}</p>
      <p v-if="taskSelected.due_date">Due date: {{ new Date(taskSelected.due_date).toISOString().replace('T', ' - ').substring(0, 21) }}</p>
      <p v-else>Due date: Unlimited</p>
      <p v-if="taskSelected.due_date">Time remaing: {{ timeRemaining }}</p>
      <p :class="{ priority:true, hight:taskSelected.priority , low:!taskSelected.priority }" @click="changePriority(taskSelected.id)" title="Change task priority">{{ taskSelected.priority? "Hight priority":"Low priority" }}</p>
      <section class="fastAjust">
        <img class="delete" src="../../assets/light/delete.png" alt="delete" @click="deleteTask(taskSelected.id)" title="Delete task">
        <img class="edit" src="../../assets/light/libro.png" alt="edit" @click="goToEditPage(taskSelected.id)" title="Edit task">
        <img class="update" src="../../assets/light/update.png" alt="update" @click="updateTaskStatus(taskSelected.id)" title="Update task status">
      </section>
    </article>
  </section>
  <section v-else>
    <h2>You don't have task to do.</h2>
    <h3>Start creating tasks to do </h3>
  </section>
  <section class="bt-complete">
    <button @click="completeAllTasks">Mark all tasks as complete</button>
    <button @click="deleteCompletedTasks">Delete all complete tasks</button>
  </section>
</template>

<script>
import { mapState } from 'pinia'
import { useAuthStore } from '../stores/authStore'
import { useCategoryStore } from '../stores/categoryStore'
import { useTaskStore } from '../stores/taskStore'
  export default {
    computed: {
      ...mapState(useAuthStore, ['userId', 'isAuthenticated']),
      ...mapState(useCategoryStore, ['categories', 'userCategories']),
      ...mapState(useTaskStore, ['localtaks', 'usertasks']),
    },
    data() {
      return{
        status: "default",
        order: "priority",
        categorySelected: 0,
        tasks: [],
        filteredTasks: [],
        taskSelected: null,
        rotationClasses: ["rotate75", "rotate5", "rotate25", "rotate0", "rotate-75", "rotate-5", "rotate-25"],
        userData: null,
        timeRemaining: null,
        intervalId: null,
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
      categorySelected() {
        this.filterTasks()
      },
      taskSelected: {
        handler(newValue) {
          if (newValue && newValue.due_date) {
            if (this.intervalId) {
              clearInterval(this.intervalId)
            }
            this.updateTimeRemaining(newValue.due_date)
            this.intervalId = setInterval(() => {
              this.updateTimeRemaining(newValue.due_date)
            }, 1000)
          } else if (this.intervalId) {
            clearInterval(this.intervalId)
            this.timeRemaining = null
          }
        },
        immediate: true,
      },
    },
    methods: {
      async getCategories() {
        const categoryStore = useCategoryStore()
        await categoryStore.getCategories()
      },
      async getUserCategories() {
        const categoryStore = useCategoryStore()
        await categoryStore.getUserCategories(this.userId)
        this.userCategories = categoryStore.userCategories
      },
      getRandomRotationClass() {
        const randomIndex = Math.floor(Math.random() * this.rotationClasses.length);
        return this.rotationClasses[randomIndex];
      },
      filterTasks() {
        this.filteredTasks = this.tasks.filter(task => {
          return (this.status === 'default' || task.status === this.status) &&
          (this.categorySelected === 0 || 
            (this.categorySelected.startsWith('category_') && task.category_id === parseInt(this.categorySelected.slice(9))) ||
            (this.categorySelected.startsWith('userCategory_') && task.user_category_id === parseInt(this.categorySelected.slice(13)))
          )
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
              return new Date(a.due_date) - new Date(b.due_date)
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
      getCategory(categoryId, custom) {
        if (!custom && this.categories) {
          const matchingCategory = this.categories.find(category => category.id === categoryId)
          return matchingCategory ? matchingCategory : { name: 'Unknown', category_photo: null }
        } else if (custom && this.userCategories){
          const matchingCategory = this.userCategories.find(category => category.id === categoryId)
          return matchingCategory ? matchingCategory : { name: 'Unknown', category_photo: null }
        } else {
          return { name: 'Unknown', category_photo: null }
        }
      },
      showTaskDetails(task) {
        this.taskSelected = task
      },
      hideTaskDetails() {
        this.taskSelected = null
      },
      updateTimeRemaining(dueDate) {
        const now = new Date().getTime();
        const dueDateTime = new Date(dueDate).getTime();
        const difference = dueDateTime - now;
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        this.timeRemaining = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      },
      async changePriority(id){
        if (this.isAuthenticated) {
          try {
            const task = this.filteredTasks.find(task => task.id === id)
            const taskId = task.id
            const newPriority = !task.priority
            const priority = {
              priority: newPriority,
            }
            const taskStore = useTaskStore()
            await taskStore.updateTask(this.isAuthenticated, taskId, priority)
            task.priority = newPriority
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
          if (this.isAuthenticated){
            const taskStore = useTaskStore()
            await taskStore.deleteTask(this.isAuthenticated, index)
            this.tasks = this.tasks.filter(task => task.id !== index)
          } else {
            this.tasks.splice(index, 1)
            const taskStore = useTaskStore()
            await taskStore.deleteTask(this.isAuthenticated, index)
          }
          this.hideTaskDetails()
        }
      },
      async updateTaskStatus(index) {
        if (this.isAuthenticated) {
          const task = this.filteredTasks.find(task => task.id === index)
          const taskId = task.id
          let newStatus = task.status
          if (newStatus === "pending") {
              newStatus = "processing"
          } else if (newStatus === "processing") {
              newStatus = "complete"
          } else if (newStatus === "complete") {
              newStatus = "processing"
          }
          const status = {
            status: newStatus,
          }
          const taskStore = useTaskStore()
          await taskStore.updateTask(this.isAuthenticated, taskId, status)
          task.status = newStatus
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
        if (this.isAuthenticated) {
          for (let task of this.filteredTasks) {
            const taskId = task.id
            const status = {
              status: "complete",
            }
            const taskStore = useTaskStore()
            await taskStore.updateTask(this.isAuthenticated, taskId, status)
            task.status = "complete"
          }
        } else {
          this.filteredTasks.forEach(task => {
            task.status = 'complete'
          })
          localStorage.setItem('tasks', JSON.stringify(this.tasks))
        }
      },
      async deleteCompletedTasks() {
        if (this.isAuthenticated) {
          for (let task of this.filteredTasks) {
            let taskStatus = task.status
            if (taskStatus == 'complete'){
              const taskId = task.id
              const taskStore = useTaskStore()
              await taskStore.deleteTask(this.isAuthenticated, taskId)
              this.tasks = this.tasks.filter(task => task.id !== taskId)
            }
          }
        } else {
          this.filteredTasks = this.filteredTasks.filter(task => task.status !== 'complete')
          this.tasks = this.tasks.filter(task => task.status !== 'complete')
          localStorage.setItem('tasks', JSON.stringify(this.tasks))
        }
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
        this.tasks = [...this.usertasks]
      } else {
        this.tasks = [...this.localTasks]
      }
      this.tasks.forEach(task => {
        task.rotationClass = this.getRandomRotationClass()
      })
      this.filterTasks()
    },
  } 
</script>