<template>
  <header>
    <router-link to="/taskf">Create Task</router-link>
    <select v-model=status>
      <option value="default">All Tasks</option>
      <option value="complete">Complete</option>
      <option value="processing">Processing</option>
      <option value="pending">Pending</option>
    </select>
    <select v-model=order>
      <option value="default">Order by</option>
      <option value="priority">Priority</option>
      <option value="status">Status</option>
      <option value="date">Date</option>
    </select>
    <select v-model=category v-if=(categories.length)>
      <option value="default">All categories</option>
      <option v-for="categoryData in categories" v-bind:value=categoryData>{{categoryData}}</option>
    </select>
  </header>
  <main>
    
  </main>
  <footer>
    <button @click="">Marck all tasks as complete</button>
    <button @click="">Delete all complete tasks</button>
  </footer>
</template>

<script>
  export default {
    data() {
        return{
          status: "default",
          order: "default",
          categories: [],
          category: "default",
        }
    }
  } 
</script>