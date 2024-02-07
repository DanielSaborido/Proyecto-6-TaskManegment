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
    <label htmlFor="category">Category Task: <q v-if="!logued">Log in for create your own categories</q></label>
    <section class="categories">
      <div v-for="category in categories" class="category">
        <input type="checkbox" 
          v-bind:id = category
          name = "category"
          v-bind:value="category"
          v-model="categoriesSelected"
        />
        <label v-bind:htmlFor=category>{{category}}</label>
      </div>
    </section>
    <section class="categories" v-if="logued">
      <div v-for="(opcion, index) in categoriesCreated" :key="index" class="category">
        <input type="checkbox" v-bind:value="categoriesCreated[index].category" v-model="categoriesSelected">
        <input type="text" v-model="categoriesCreated[index].category" @input="createCategory(index)" placeholder="Category" class="categoryInfo">
      </div>
    </section>
    <label htmlFor="status">Status Task:</label>
    <select v-model=status>
      <option value="complete">Complete</option>
      <option value="processing">Processing</option>
      <option value="pending">Pending</option>
    </select>
    <label for="limitDate">Limit Date:</label>
    <input type="date" id="limitDate" name="limitDate" v-model=limitDate>
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
      <li v-if="{title}">No title of task.</li>
      <li v-if="{description}">The task has not description.</li>
    </ul>
    <button @click="hideMessage">Close</button>
  </div>
  <div v-if="showSucceedMessage" class="succeed-message">
    <p>Task data: </p>
    <ul>
      <li>Title: {{ title }}</li>
      <li>Description: {{ description }}</li>
      <li v-if=(categoriesSelected.length)>Categories: {{ categoriesSelected }}</li>
      <li>Creation Date: {{ creationDate }}</li>
      <li v-if="{limitDate}">limitDate: {{ limitDate }}</li>
      <li v-else>limitDate: Unlimited</li>
      <li>priority: {{ priority }}</li>
    </ul>
    <button @click="hideMessage">Close</button>
  </div>
</template>

<script>
  export default {
    // props:{
    //   logued: Boolean,
    // },

    data() {
        return{
          title: null,
          description: null,
          categories: ["Escuela","Casa","Trabajo","Ocio"],
          categoriesCreated: [{ category: '' }],
          categoriesSelected: [],
          status: "pending",
          creationDate: null,
          limitDate: null,
          priority: false,
          showErrorMessage: false,
          showSucceedMessage: false,
          logued: false,
        }
    },

    methods:{
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
      createTask(){
        if (this.title && this.description) {
          var f = new Date();
          this.creationDate = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear()
          this.showSucceedMessage = true
          console.log(this.title+"\n"+this.description+"\n"+this.categoriesSelected+"\n"+this.status+"\n"+this.creationDate+"\n"+(this.limitDate == null? "Unlimited":limitDate)+"\n"+this.priority)
        } else {
          this.showErrorMessage = true
        }
      },
      hideMessage() {
        this.showErrorMessage = false
        this.showSucceedMessage = false
      },
    },
  } 
</script>