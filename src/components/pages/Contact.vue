<template>
  <form @submit.prevent="sentComments">
    <label htmlFor="email">Email:</label>
    <input
      type="text"
      id="email"
      name="email"
      v-model=email
    />
    <p class="alert" v-if="email && !validateEmail">
      Error. The email is not valid.
    </p>
    <label htmlFor="comment">Comment:</label>
    <input
      type="comment"
      id="comment"
      name="comment"
      v-model=comment
    />
    <button type="submit">Send comment</button>
  </form>
  <section class="container message error-message" v-if="showErrorMessage" >
    <p>Error: Please check your input.</p>
    <ul>
      <li v-if="!validateEmail">Email is not valid.</li>
      <li v-if="{comment}">There is not comment.</li>
    </ul>
    <button @click="hideErrorMessage">Close</button>
  </section>
</template>

<script>
  export default {  
    data() {
        return{
          email: null,
          comment: null,
          showErrorMessage: false,
        }
    },

    methods: {
      sentComments() {
        if (this.comment && this.validateEmail) {
          console.log("Comments sent")
        } else {
          this.showErrorMessage = true
        }
      },
      hideErrorMessage() {
        this.showErrorMessage = false
      },
    },

    computed: {
      validateEmail() {
          const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          return re.test(this.email)
      }
    }
  } 
</script>