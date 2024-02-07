<template>
  <form v-show=login @submit.prevent="loginAcount">
    <label>Email:</label>
    <input
      type="text"
      name="email"
      v-model=email
    />
    <p v-if="email && !validateEmail">
      Error. The email is not valid.
    </p>
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
  <form v-show=create @submit.prevent="createAcount">
    <label>Name:</label>
    <input
      type="name"
      name="name"
      v-model=name
    />
    <p v-if="name && !validateName">
      Error. The name is not valid.
    </p>
    <label>Email:</label>
    <input
      type="text"
      name="email"
      v-model=email
    />
    <p v-if="email && !validateEmail">
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
    <p v-if="Rpassword && !validatePassword">
      Error. The two passwords are diferents.
    </p>
    <label>Phone:</label>
    <input
      type="tel"
      name="phone"
      v-model=phone
    />
    <button type="submit">Create Account</button>
  </form>
  <form v-show=forget @submit.prevent="rememberPassword">
    <label>Email:</label>
    <input
      type="text"
      name="email"
      v-model=email
    />
    <p v-if="email && !validateEmail">
      Error. The email is not valid.
    </p>
    <button type="submit">Sent recover</button>
  </form>
  <div v-if="showErrorMessage" class="error-message">
    <p>Error: Please check your input.</p>
    <ul>
      <li v-if="create && !validateName">Name is not valid.</li>
      <li v-if="!validateEmail">Email is not valid.</li>
      <li v-if="{password}">Password is not valid.</li>
      <li v-if="create && !validatePassword">Passwords do not match.</li>
    </ul>
    <button @click="hideErrorMessage">Close</button>
  </div>
</template>

<script>
  export default {  
    data() {
        return{
          name: null,
          email: null,
          password: null,
          Rpassword: null,
          phone: null,
          login: true,
          create: false,
          forget: false,
          showErrorMessage: false,
        }
    },

    methods: {
      loginAcount() {
        if (this.validateEmail && this.password) {
          console.log("Login successful!")
        } else {
          console.log("Login failed. Please check your email and password.")
          this.showErrorMessage = true
        }
      },
      createAcount() {
        if (this.validateName && this.validateEmail && this.validatePassword) {
          console.log("Account created successfully!")
          this.create=false
          this.login=true
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
        const re = /^[A-Z][a-z]{2,}$/
        return re.test(this.name)
      }
    },
  } 
</script>
