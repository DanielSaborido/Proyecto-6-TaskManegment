<template>
  <form>
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
    <label htmlFor="status">Status Task:</label>
    <select v-model=status>
      <option value="complete">Complete</option>
      <option value="processing">Processing</option>
      <option value="pending">Pending</option>
    </select>
    <label for="limitDate">Fecha límite:</label>
    <input type="date" id="limitDate" name="limitDate" required>
    <input type="checkbox" 
      id = "priority"
      name = "priority"
      v-model=priority
    />
    <label htmlFor="priority">Task priority</label>
    <button type="submit">Create Task</button>
  </form>
</template>

<script>
  export default {

    data() {
        return{
          title: "",
          description: "",
          category: "",
          status: "",
          priority: false,
        }
    },

    methods:{
    },

    computed: {
    }
  } 
</script>