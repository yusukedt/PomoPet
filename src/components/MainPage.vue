<template>
  <div class="main-page-wrapper">
    <div class="main-page">
      <img src="../assets/pomopet.png" alt="Logo" class="logo" />
      <div class="main-page-button">
        <button class="custom-button main-login-button" @click="goToLogin">
          Login
        </button>
        <button class="custom-button main-signup-button" @click="goToRegister">
          Sign Up
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goToLogin() {
      this.$router.push({ name: "login" });
    },
    goToRegister() {
      this.$router.push({ name: "register" });
    },
  },
};
</script>

<style scoped>
.main-page-wrapper {
  margin: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(#66b1cc, white);
  background-size: cover;
  background-position: center;
  overflow: hidden;
}
/* Add a specific class for MainPage */
.main-page {
  display: flex;
  flex-direction: row;
  text-align: center; /* Center the title */
  align-items: center;
}
.main-page-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  padding: 5rem;
  border-radius: 10px;
  background: linear-gradient(#aee1f1, #d2e5eb);
  color: #333;
  text-align: center;
}
@media only screen and (orientation: portrait) {
  .main-page-button {
    background: rgba(255, 255, 255, 0);
    backdrop-filter: none;
    box-shadow: none;
  }
}

.logo {
  max-width: 300px;
}
.custom-button {
  padding: 10px;
  background-color: #66b1cc;
  color: black;
  border: 1px solid black;
  border-radius: 5px;
  font-size: 16px;
  font-family: "Quicksand", sans-serif;
  transition: background-color 0.3s ease, border-color 0.3s ease,
    outline 0.3s ease;
}
.main-login-button {
  background-color: #66b1cc;
  border-color: black;
}
.main-login-button:hover {
  background-color: #599db6;
  border-color: black;
}
.main-signup-button {
  background-color: #66b1cc;
  border-color: black;
}
.main-signup-button:hover {
  background-color: #599db6;
  border-color: black;
}
.main-signup-button:active {
  background-color: rgb(142, 142, 158);
  border-color: black;
}
@media only screen and (orientation: landscape) {
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
@media only screen and (orientation: portrait) {
  .main-page {
    flex-direction: column; /* Stack vertically */
  }

  .main-page-button {
    flex-direction: column;
    width: 300px;
  }
}
</style>
