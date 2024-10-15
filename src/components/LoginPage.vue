<template>
  <div class="login-page-wrapper">
    <button @click="goToMain" class="back-button" aria-label="Go back">
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12H3M12 21l-9-9 9-9"></path>
      </svg>
    </button>
    <div class="login-page">
      <h2>Welcome</h2>
      <h5>Sign In</h5>
      <form @submit.prevent="login">
        <div class="form-group">
          <input type="text" v-model="identifier" class="form-control" placeholder="Email" required />
        </div>
        <div class="form-group">
          <input type="password" v-model="password" class="form-control" placeholder="Password" required />
        </div>
        <button type="submit" class="login-button" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-else>Login</span>
        </button>
      </form>
      <p class="register-prompt">Don't have an account?</p>
        <div class="create-account-container">
            <button class="create-account-link" @click="goToRegister">Create an account</button>
        </div>
        <p v-if="error" class="text-danger">
            <span class="error-icon">⚠️</span>{{ error }}
        </p>
    </div>
  </div>
</template>
  
  
  <script>
  import { signInWithEmailAndPassword } from "firebase/auth";
  import { logEvent } from "firebase/analytics";
  import { auth, analytics } from "../firebase";
  
  export default {
    data() {
      return {
        identifier: '',
        password: '',
        error: '',
        loading: false
      };
    },
    methods: {
      async login() {
        this.loading = true;
        this.error = '';
        this.identifier = this.identifier.trim();
        this.password = this.password.trim();
  
        if (!this.identifier || !this.password) {
          this.error = 'Email and password are required.';
          this.loading = false;
          return;
        }
  
        try {
          // Now try to sign
          await signInWithEmailAndPassword(auth, this.identifier, this.password);
          this.$router.push("/home"); // Redirect to home on successful login
          logEvent(analytics, 'login', { method: 'email' });
        } catch (err) {
          this.handleError(err);
        } finally {
          this.loading = false;
        }
      },
      handleError(err) {
        console.error("Error:", err);
        // Handle common Firebase error messages
        switch (err.code) {
          case 'auth/invalid-email':
            this.error = 'Invalid email address.';
            break;
          case 'auth/user-not-found':
            this.error = 'No user found with this email.';
            break;
          case 'auth/wrong-password':
            this.error = 'Incorrect password. Please try again.';
            break;
          case 'auth/too-many-requests':
            this.error = 'Too many requests. Please try again later.';
            break;
          case 'auth/invalid-credential':
            this.error = 'Invalid email or password.';
            break;
          default:
            this.error = 'An error has occurred. Please try again.';
        }
      },
      goToRegister() {
        this.$router.push('/register'); // Navigate to the registration page
      },
      goToMain() {
        this.$router.push('/');
      }
    }
  };
  </script>
  
<style scoped>
/* General Styles */
.login-page h2 {
  font-family: 'Quicksand', sans-serif;
  font-weight: bold;
}
.login-page h5 {
  margin-top: 10px; /* Adjust this value as needed */
  font-family: 'Quicksand', sans-serif;
  font-size: 16px;
}
.login-page-wrapper {
  margin: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10%;
  background-image: url('../assets/pexels.jpg');
  background-size: cover;
  background-position: center;
}

/* Login Container Class */
.login-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 400px; /* Fixed maximum width */
  width: 100%; /* Ensure the container fits the available width */
  padding: 2rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1); /* Light translucent color */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px) contrast(0.8); /* Adjusts blur and contrast */
  color: #333;
  text-align: center;
}

/* Input Fields */
input.form-control {
  display: block;
  width: 300px; /* Fill the width of the container */
  margin: 20px 0;
  padding: 10px;
  box-sizing: border-box;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  font-family: 'Quicksand', sans-serif;
  background-color: #f9f9f9;
}
input.form-control::placeholder {
  color: #aaa;
  opacity: 1;
}
.login-button {
  display: block;
  width: 100%;
  min-height: 40px;
  padding: 5px;
  background-color: #6c96c6;
  color: rgb(255, 255, 255);
  border: 1px solid black; /* Darker blue border */
  border-radius: 5px;
  font-family: 'Quicksand', sans-serif;
  margin: 15px 0;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease; /* Smooth transition for hover */
}
.login-button:hover {
  background-color: #5d7fa6;
}
.login-button.loading {
  background-color: #cccccc; /* Grey out */
  color: #666666;
  border-color: #999999;
  cursor: not-allowed;
}
.login-button:disabled {
  pointer-events: none;
}
.spinner {
  border: 2px solid #f3f3f3; /* Light gray */
  border-top: 2px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px; /* Space between spinner and button text */
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
.error-message {
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  font-family: 'Quicksand', sans-serif;
}
.error-icon {
  margin-right: 8px;
  font-size: 18px;
  display: inline-block;
}
.register-prompt {
  margin-top: 0.5rem;
  text-align: center;
  font-family: 'Quicksand', sans-serif;
}

.create-account-container {
  text-align: center;
  margin-top: -0.5rem;
}

.create-account-link {
  padding: 0;
  border: none;
  background: none;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
  font-family: 'Quicksand', sans-serif;
}

.create-account-link:hover {
  color: #0056b3; /* Darker shade on hover */
}

/* Styles for Back Button */
.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  padding: 5px;
  font-size: 16px;
  transition: color 0.3s ease;
}

.back-button:hover {
  color: #0056b3;
}

.back-button svg {
  width: 24px;
  height: 24px;
  stroke: currentColor;
}
</style>