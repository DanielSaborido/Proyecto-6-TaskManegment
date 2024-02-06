<template>
  <form v-show=login>
    <label>Email:</label>
    <input
      type="email"
      name="email"
      v-model=email
    />
    <label>Password:</label>
    <input
      type="password"
      name="password"
      v-model=password
    />
    <a @click="forget=true; login=false">Forget password?</a>
    <button type="submit">Log in</button>
  </form>
  <button v-show=login @click="create=true; login=false">Create Account</button>
  <form v-show=create>
    <label>Email:</label>
    <input
      type="email"
      name="email"
      v-model=email
    />
    <label>Password:</label>
    <input
      type="password"
      name="password"
      v-model=password
    />
    <label>Repeat password:</label>
    <input
      type="password"
      name="Rpassword"
      v-model=Rpassword
    />
    <button type="submit" @click="create=false; login=true">Create Account</button>
  </form>
  <form v-show=forget>
    <label>Email:</label>
    <input
      type="email"
      name="email"
      v-model=email
    />
    <button type="submit" @click="forget=false; login=true">Sent recover</button>
  </form>
</template>

<script>
  export default {  
    data() {
        return{
          email: "",
          password: "",
          Rpassword: "",
          login: true,
          create: false,
          forget: false,
        }
    },

    methods:{
      validateEmail() {
          const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          return re.test(this.email)
      },
      validatePassword() {
          return this.password === this.Rpassword
      }
    },

    computed: {
    }
  } 
</script>