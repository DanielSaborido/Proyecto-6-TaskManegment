<template>
    <h1>{{title}}</h1>
    <form>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            v-model=email
          />
        </div>
        <button type="submit">Sent recover</button>
      </form>
  </template>
  
  <script>
    export default {
      props:{
          title: String,
      },
  
      data() {
          return{
            email: "",
          }
      },
  
      methods:{
        validateEmail() {
            const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            return re.test(this.email)
        }
      },
  
      computed: {
      }
    } 
  </script>
  
  <style>
  
  </style>
  