<template>
  <div class="main-page-wrapper">
    <div class="main-page">
      <img src="../assets/mainlogo.png" alt="Logo" class="logo" />
      <div class="main-page-button">
        <button class="custom-button main-login-button" @click="goToLogin">Login</button>
        <button class="custom-button main-signup-button" @click="goToRegister">Sign Up</button>
      </div>
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
  align-items: center; /* Center vertically */
  padding: 10%;
  background-image: url('../assets/pexels.jpg');
  background-size: cover;
  background-position: center;
}
/* Add a specific class for MainPage */
.main-page {
  display: flex;
  flex-direction: row;
  text-align: center; /* Center the title */
  align-items: center;
  width: 100%;
}
.main-page-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  padding: 5rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1); /* Light translucent color */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px) contrast(0.8); /* Adjusts blur and contrast */
  color: #333;
  text-align: center;
}
.logo {
  max-width: 300px;
}
.custom-button {
  /* display: block; */
  /* margin: 20px auto; */
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
@media (min-width: 768px) {
  .main-page {
    flex-direction: row; /* Align logo and buttons horizontally */
    justify-content: center; /* Center logo and buttons together */
  }

  .main-page-button {
    flex-direction: column; /* Stack buttons vertically next to logo */
    margin-left: 100px; /* Space between logo and buttons */
    width: 400px;
  }
}

/* Stack buttons below logo on smaller screens */
@media (max-width: 768px) {
  .main-page {
    flex-direction: column; /* Stack vertically */
  }

  .main-page-button {
    flex-direction: column;
    width: 300px;
  }
}
</style>
