<template>
  <div>
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
    <select v-model=category v-show=(categories)>
      <option value="default">All categories</option>
      <option v-for="{category} in categories" value="category">{{category}}</option>
    </select>
  </div>
  <footer>
    <button v-on:click="">Marck all tasks as complete</button>
    <button v-on:click="">Delete all complete tasks</button>
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
    },

    methods:{
    },

    computed: {
    }
  } 
</script>