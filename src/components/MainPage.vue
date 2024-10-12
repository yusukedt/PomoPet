<template>
  <div class="main-page-wrapper">
    <div class="main-page">
      <img src="../assets/mainlogo.png" alt="Logo" class="logo" />
      <button class="custom-button main-login-button" @click="goToLogin">Login</button>
      <button class="custom-button main-signup-button" @click="goToRegister">Sign Up</button>
    </div>
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
.main-page-wrapper {
  margin: 0;
  height: 100vh;
  display: flex; /* Use flexbox */
  justify-content: center; /* Center horizontally */
  align-items: flex-start; /* Center vertically */
  padding: 10%;
  background-image: url('../assets/pexels.jpg');
  background-size: cover;
  background-position: center;
}
/* Add a specific class for MainPage */
.main-page {
  text-align: center; /* Center the title */
  width: 100%;
}
.main-page button {
  display: block;
  width: 200px;
  margin: 20px auto;
}
.logo {
  max-width: 300px;
  margin-bottom: 10px; /* Space between logo and buttons */
}
.custom-button {
  display: block;
  width: 200px;
  margin: 20px auto;
  padding: 10px;
  background-color: #D6D6E9;
  color: black;
  border: 1px solid black;
  border-radius: 5px;
  font-size: 16px;
  font-family: 'Quicksand', sans-serif;
  transition: background-color 0.3s ease, border-color 0.3s ease, outline 0.3s ease; /* Smooth transition for hover effect */
}
.main-login-button {
  background-color: #D6D6E9;
  border-color: black;
}
.main-login-button:hover {
  background-color: #b8b8ca;
  border-color: black;
}
.main-signup-button {
  background-color: #D6D6E9;
  border-color: black;
}
.main-signup-button:hover {
  background-color: #b8b8ca;
  border-color: black;
}
.main-signup-button:active {
  background-color: #9c9cac;
  border-color: black;
}
</style>
