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
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            v-model=password
          />
        </div>
        <a href="">Forget password?</a>
        <button type="submit">Log in</button>
      </form>
      <button >Create Account</button>
  </template>
  
  <script>
    export default {
      props:{
          title: String,
      },
  
      data() {
          return{
            email: "",
            password: "",
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
  