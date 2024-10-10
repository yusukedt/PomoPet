<template>
    <div class="main-page">
      <img src="../assets/mainlogo.png" alt="Logo" class="logo" /> <!-- Replace with your logo path -->
      <button class="custom-button main-login-button" @click="goToLogin">Login</button>
      <button class="custom-button main-signup-button" @click="goToRegister">Sign Up</button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      goToLogin() {
        this.$router.push({ name: 'login' });
      },
      goToRegister() {
        this.$router.push({ name: 'register' });
      }
    }
  };
  </script>
  
<style scoped>
@import "../assets/main.css"
</style>
  