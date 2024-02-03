<template>
  <div>
    <router-link to="/taskf">Create Task</router-link>
    <select>
      <option value="default" selected>All Tasks</option>
      <option value="complete">Complete</option>
      <option value="processing">Processing</option>
      <option value="pending">Pending</option>
    </select>
    <select>
      <option value="default" selected>Order by</option>
      <option value="priority">Priority</option>
      <option value="status">Status</option>
      <option value="date">Date</option>
    </select>
    <select v-show=(categories)>
      <option value="default" selected>All categories</option>
      <option v-for="{categorie} in categories" value="categorie">{{categorie}}</option>
    </select>
  </div>
  <footer>
    <button v-on:click="">Marck all tasks as complete</button>
    <button v-on:click="">Delete all complete tasks</button>
  </footer>
</template>

<script>
  export default {
    props:{
        title: String,
    },

    data() {
        return{
          categories: [],
          
        }
    },

    methods:{
    },

    computed: {
    }
  } 
</script>

<style>

</style>
