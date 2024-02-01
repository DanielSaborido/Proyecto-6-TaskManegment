<template>
  <h1>{{title}}</h1>
  <div>
    <button v-on:click="">New Task</button>
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
  </div>
  <button v-on:click="">Marck all tasks as complete</button>
  <button v-on:click="">Delete all complete tasks</button>
</template>

<script>
  export default {
    props:{
        title: String,
    },

    data() {
        return{
          
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
