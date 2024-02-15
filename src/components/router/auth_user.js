const autentication = (to, from, next) => {
  return new Promise(resolve => {
    const userLogued = localStorage.getItem('userId') || null
    const trialStarted = localStorage.getItem('trialStarted') || false
    const trialEndDate = localStorage.getItem('trialEndDate')
    const date = new Date()
    userLogued ?
      next('/tasks')
      : trialStarted ? 
        (date > trialEndDate ? 
          next() 
          : next('/tasks')) 
        : next()
  })
}

export default autentication