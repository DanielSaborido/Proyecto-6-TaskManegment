<template>
    <h1>{{titlePage}}</h1>
    <form>
        <div>
          <label htmlFor="title">Title Task:</label>
          <input
            type="text"
            id="title"
            name="title"
            v-model=title
          />
        </div>
        <div>
          <label htmlFor="description">Description Task:</label>
          <input
            type="textarea"
            id="description"
            name="description"
            v-model=description
          />
        </div>
        <div>
          <label htmlFor="category">Category Task:</label>
          <input
            type="text"
            id="category"
            name="category"
            v-model=category
          />
        </div>
        <div>
          <label htmlFor="status">Status Task:</label>
          <select>
            <option value="complete">Complete</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <button type="submit">Create Task</button>
      </form>
  </template>
  
  <script>
    export default {
      props:{
          titlePage: String,
      },
  
      data() {
          return{
            title: "",
            description: "",
            category: "",
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
  