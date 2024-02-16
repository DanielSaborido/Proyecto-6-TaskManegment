export function isAuthenticated() {
  const userLogued = localStorage.getItem('userId') || null
  const trialStarted = localStorage.getItem('trialStarted') || false
  const trialEndDate = new Date(localStorage.getItem('trialEndDate'))
  const date = new Date()
  if (userLogued) {
    return true
  } else if (trialStarted && trialEndDate && trialEndDate > date) {
    return true
  }
  return false
}

export function isUserLogged() {
  const userLogued = localStorage.getItem('userId') || null
  return userLogued
}