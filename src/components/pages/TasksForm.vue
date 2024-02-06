<template>
  <form @submit.prevent="createTask">
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
    <label htmlFor="category">Category Task:</label>
    <section class="categories">
      <input type="checkbox" 
        id = "category"
        name = "category"
        v-model=categories.useCategory
      />
      <input type="text" class="category" v-model=categories.category />
    </section>
    <label htmlFor="status">Status Task:</label>
    <select v-model=status>
      <option value="complete">Complete</option>
      <option value="processing">Processing</option>
      <option value="pending">Pending</option>
    </select>
    <label for="limitDate">Limit Date:</label>
    <input type="date" id="limitDate" name="limitDate">
    <div>
      <input type="checkbox" 
        id = "priority"
        name = "priority"
        v-model=priority
      />
      <label htmlFor="priority">Task priority</label>
    </div>
    <button type="submit">Create Task</button>
  </form>
  <div v-if="showErrorMessage" class="error-message">
    <p>Error: Please check your input.</p>
    <ul>
      <li v-if="title">No title of task.</li>
      <li v-if="description">The task has not description.</li>
    </ul>
    <button @click="hideErrorMessage">Close</button>
  </div>
</template>

<script>
  export default {

    data() {
        return{
          title: null,
          description: null,
          categories: [
            {useCategory:false, category:null}
          ],
          status: "pending",
          limitDate: null,
          priority: false,
          showErrorMessage: false,
        }
    },

    methods:{
      createTask(){
        if (this.title && this.description) {
          var f = new Date();
          const creationDate = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear()
          console.log("Task data: \n"+this.title+"\n"+this.description+"\n"+this.categories+"\n"+this.status+"\n"+creationDate+"\n"+(this.limitDate == null? "Unlimited":limitDate)+"\n"+this.priority)
        } else {
          this.showErrorMessage = true
        }
      },
      hideErrorMessage() {
        this.showErrorMessage = false
      },
    },
  } 
</script>