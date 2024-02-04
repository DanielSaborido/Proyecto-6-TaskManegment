<template>
  <form v-show=login>
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
    <a @click="forget=true; login=false">Forget password?</a>
    <button type="submit">Log in</button>
  </form>
  <button v-show=login @click="create=true; login=false">Create Account</button>
  <form v-show=create>
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
    <div>
      <label htmlFor="Rpassword">Repeat password:</label>
      <input
        type="Rpassword"
        id="Rpassword"
        name="Rpassword"
        v-model=Rpassword
      />
    </div>
    <button type="submit" @click="create=false; login=true">Create Account</button>
  </form>
  <form v-show=forget>
    <div>
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        v-model=email
      />
    </div>
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