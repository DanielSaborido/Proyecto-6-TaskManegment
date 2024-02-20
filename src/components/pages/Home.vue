<template>
  <h2>Welcome to Fast Task</h2>
  <h3>What is Fast Task?</h3>
  <p>Fast Task is a task management application designed to help you organize your life. With Fast Task, you can create, manage, and prioritize your tasks efficiently.</p>
  <h3>Main Features</h3>
    <p><strong>Task Creation</strong>: Add new tasks with just a few clicks. You can set the title, description, category, and deadline for each task.</p>
    <p><strong>Task Management</strong>: View all your tasks in one place. You can sort your tasks by priority or status.</p>
    <p><strong>Task Prioritization</strong>: Mark tasks as completed and delete all completed tasks with ease.</p>
    <p><strong>Security</strong>: Log in to your account to access your tasks from anywhere.</p>
  <h3>How does it work?</h3>
  <p>Here are some examples of how you can use Fast Task to manage your tasks:</p>
    <p><strong>Example 1</strong>: future example of working</p>

  <h3>Ready to get started?</h3>
  <p>Create your account today and start organizing your tasks with Fast Task.</p>
  <button @click="startTrial">Try of 15 days</button>
</template>

<script>
export default{
  methods: {
    startTrial() {
      localStorage.setItem('trialStarted', true)
      const trialEndDate = new Date()
      trialEndDate.setDate(trialEndDate.getDate() + 15)
      localStorage.setItem('trialEndDate', trialEndDate)
      this.$router.push('/tasks')
    },
  },
}
</script>