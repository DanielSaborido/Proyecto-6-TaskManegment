<template>
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
      <label htmlFor="comment">Comment:</label>
      <input
        type="comment"
        id="comment"
        name="comment"
        v-model=comment
      />
    </div>
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

    methods:{
      validateEmail() {
          const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          return re.test(this.email)
      }
    }
  } 
</script>