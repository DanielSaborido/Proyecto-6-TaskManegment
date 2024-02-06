<template>
  <form @submit.prevent="sentComments">
    <label htmlFor="email">Email:</label>
    <input
      type="email"
      id="email"
      name="email"
      v-model=email
    />
    <label htmlFor="comment">Comment:</label>
    <input
      type="comment"
      id="comment"
      name="comment"
      v-model=comment
    />
    <p v-if="email && !validateEmail">
      Error. The email is not valid.
    </p>
    <button type="submit">Send comment</button>
  </form>
</template>

<script>
  export default {  
    data() {
        return{
          email: "",
          comment: "",
        }
    },

    methods: {
      sentComments() {
        if (this.validateEmail) {
          console.log("Comments sent")
        } else {
          console.log("Please check the email is invalid.")
        }
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