<template>
  <form v-show=login @submit.prevent="loginAcount">
    <label>Email:</label>
    <input
      type="text"
      name="email"
      v-model=email
    />
    <p class="alert" v-if="email && !validateEmail">
      Error. The email is not valid.
    </p>
    <label>Password:</label>
    <input
      type="password"
      name="password"
      v-model=password
    />
    <a class="remember" @click="forget=true; login=false">Forget password?</a>
    <button type="submit">Log in</button>
  </form>
  <button v-show=login @click="create=true; login=false">Create Account</button>
  <form v-show=create @submit.prevent="createAccount">
    <label>Name:</label>
    <input
      type="name"
      name="name"
      v-model=name
    />
    <p class="alert" v-if="name && !validateName">
      Error. The name is not valid.
    </p>
    <label>Email:</label>
    <input
      type="text"
      name="email"
      v-model=email
    />
    <p class="alert" v-if="email && !validateEmail">
      Error. The email is not valid.
    </p>
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
    <p class="alert" v-if="Rpassword && !validatePassword">
      Error. The two passwords are diferents.
    </p>
    <button type="submit">Create Account</button>
  </form>
  <button v-show=create @click="create=false; login=true">Back to login</button>
  <form v-show=forget @submit.prevent="rememberPassword">
    <label>Email:</label>
    <input
      type="text"
      name="email"
      v-model=email
    />
    <p class="alert" v-if="email && !validateEmail">
      Error. The email is not valid.
    </p>
    <button type="submit">Sent recover</button>
  </form>
  <button v-show=forget @click="forget=false; login=true">Back to login</button>
  <section class="container message error-message" v-if="showErrorMessage" >
    <p>Error: Please check your input.</p>
    <ul>
      <li v-if="create && !validateName">Name is not valid.</li>
      <li v-if="!validateEmail">Email is not valid.</li>
      <li v-if="{password}">Password is not valid.</li>
      <li v-if="create && !validatePassword">Passwords do not match.</li>
    </ul>
    <button @click="hideErrorMessage">Close</button>
  </section>
</template>

<script>
import { useAuthStore } from '../stores/authStore'
  export default {  
    data() {
        return{
          name: null,
          email: null,
          password: null,
          Rpassword: null,
          login: true,
          create: false,
          forget: false,
          showErrorMessage: false,
        }
    },
    methods: {
      async searchUser(){
        const users = await fetch(`http://api-proyecto-6.test/api/users`).then((result) => result.json())
        console.log(users)
        let user = users.find(user => user.email === this.email)
        if (user) {
          const userLog = useAuthStore()
          userLog.login(user.id)
          this.$router.push('/tasks')
        } else {
          console.log("The email was not found in the database.")
        }
      },
      async loginAcount() {
        if (this.validateEmail && this.password) {
          try {
            const response = await fetch('http://api-proyecto-6.test/api/check-password', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: this.email,
                password: this.password,
              }),
            })
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            if (data.message === 'Password correct') {
              this.searchUser()
            } else {
              console.log("Incorrect email or password.")
              this.showErrorMessage = true
            }
          } catch (error) {
            console.error(error)
          }
        } else {
          console.log("Login failed. Please check your email and password.")
          this.showErrorMessage = true
        }
      },
      async createAccount() {
        if (this.validateName && this.validateEmail && this.validatePassword) {
          try {
            const response = await fetch('http://api-proyecto-6.test/api/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: this.name,
                email: this.email,
                password: this.password,
              }),
            })
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            console.log(data)
            this.searchUser()
          } catch (error) {
            console.error(error)
          }
        } else {
          this.showErrorMessage = true
        }
      },
      rememberPassword() {
        if (this.validateEmail) {
          console.log("Password recovery email sent successfully!")
          this.forget=false
          this.login=true
        } else {
          this.showErrorMessage = true
        }
      },
      hideErrorMessage() {
        this.showErrorMessage = false
      },
    },
    computed:{
      validateEmail() {
          const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          return re.test(this.email)
      },
      validatePassword() {
          return this.password === this.Rpassword
      },
      validateName() {
        const re = /^[a-zA-Z\s]{3,}$/
        return re.test(this.name)
      }
    },
  } 
</script>
