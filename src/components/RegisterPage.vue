<template>
  <div class="register-page-wrapper">
    <button @click="goToMain" class="back-button" aria-label="Go back">
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12H3M12 21l-9-9 9-9"></path>
      </svg>
    </button>
    <div class="register-page">
      <h2>Register</h2>
      <form @submit.prevent="register">
      <div class="form-group">
        <input type="email" v-model="identifier" class="form-control" id="email" placeholder="Email" required :disabled="loading" />
      </div>
      <div class="form-group">
        <input type="password" v-model="password" class="form-control" id="password" placeholder="Password" required :disabled="loading" />
      </div>
      <button type="submit" class="register-button" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span v-else>Register</span>
      </button>
      </form>
      <p class="login-prompt">Already have an account?</p>
      <div class="login-container">
      <button class="login-link" @click="goToLogin">Login to your account</button>
    </div>
      <p v-if="success" class="text-success" aria-live="polite">{{ success }}</p>
      <p v-if="error" class="text-danger" aria-live="assertive">
        <span class="error-icon">⚠️</span>{{ error }}
      </p>
    </div>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { logEvent } from "firebase/analytics";
import { auth, analytics, db } from "../firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";

export default {
data() {
  return {
  identifier: '',
  password: '',
  error: '',
  loading: false,
  success: ''
  };
},
methods: {
  async register() {
  this.loading = true;
  this.error = '';
  this.success = '';
  this.identifier = this.identifier.trim();
  this.password = this.password.trim();

  if (!this.identifier || !this.password) {
      this.error = "Email and password are required.";
      this.loading = false;
      return;
  }
  if (!this.identifier.includes("@")) {
      this.error = "Please provide a valid email address.";
      this.loading = false;
      return;
  }
  if (this.password.length < 6) {
      this.error = "Password must be at least 6 characters long.";
      this.loading = false;
      return;
  }

  try {
      // Sign out existing user
      await signOut(auth);
      
      const userCredential = await createUserWithEmailAndPassword(auth, this.identifier, this.password);
      const user = userCredential.user;

      // Create a user document in Firestore
      await setDoc(doc(db, "users", this.identifier), {
          createdAt: Timestamp.now(),
          uid: user.uid,
          email: this.identifier,
          password: this.password
      });
      // Log registration success
      logEvent(analytics, 'sign_up', { method: 'email' });
      this.success = "Your account has been successfully created!";
      this.clearFields();

      // Add delay before navigating
      setTimeout(() => {
        this.success = '';
        this.goToLogin();
    }, 1200);
  } catch (err) {
      this.handleError(err);
  } finally {
      this.loading = false;
  }
  },
  handleError(err) {
  console.error("Error:", err);
  console.error("Error Code:", err.code);
  // Handle common Firebase error messages
  switch (err.code) {
      case 'auth/email-already-in-use':
      this.error = 'This email is already in use.';
      break;
      case 'auth/invalid-email':
      this.error = 'Invalid email address.';
      break;
      case 'auth/weak-password':
      this.error = 'Password must be at least 6 characters long.';
      break;
      default:
      this.error = 'An error has occurred. Please try again.';
  }
  },
  goToLogin() {
    this.$router.push('/login'); // Navigate to the login page
  },
  goToMain() {
    this.$router.push('/')
  },
  clearFields() {
  this.identifier = '';
  this.password = '';
  }
}
};
</script>

<style scoped>
/* General Styles */
.register-page h2 {
    font-family: 'Quicksand', sans-serif;
    font-weight: bold;
}
.register-page-wrapper {
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

/* Register Container Class */
.register-page {
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
    background-color: #f9f9f9;
    font-family: 'Quicksand', sans-serif;
}
input.form-control:disabled {
    background-color: #e9ecef; /* A light gray color for disabled inputs */
    cursor: not-allowed; /* Change cursor to indicate disabled state */
}

/* Register Page Specific Button Styles */
.register-button {
    display: block;
    width: 100%; /* Fill the width of the container */
    min-height: 40px;
    padding: 5px;
    background-color: #6c96c6;
    color: rgb(255, 255, 255);
    border: 1px solid black;
    border-radius: 5px;
    font-family: 'Quicksand', sans-serif;
    margin: 15px 0;
    cursor: pointer;
    transition: background-color 0.3s ease, border-color 0.3s ease; /* Smooth transition for hover */
}

.register-button:hover {
    background-color: #5d7fa6;
}

/* Spinner and Error Messages */
.spinner {
    border: 2px solid #f3f3f3;
    border-top: 2px solid #3498db;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px; /* Space between spinner and button text */
}

/* Success message */
.text-success {
    color: green;
    font-size: 1rem;
    margin-top: 1rem;
    text-align: center;
}

.error-message {
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
}

.error-icon {
    margin-right: 8px;
    font-size: 18px;
    display: inline-block;
}

/* Login Prompt */
.login-prompt {
    margin-top: 0.5rem;
    text-align: center;
    font-family: 'Quicksand', sans-serif;
}

.login-container {
    text-align: center;
    margin-top: -0.5rem;
}

/* Login Link */
.login-link {
    padding: 0;
    border: none;
    background: none;
    color: #007bff;
    cursor: pointer;
    text-decoration: underline;
    font-family: 'Quicksand', sans-serif;
}

.login-link:hover {
    color: #0056b3;
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