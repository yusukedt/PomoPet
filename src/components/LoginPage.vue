<template>
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
            <span class="error-icon">🚨</span>{{ error }}
        </p>
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
          default:
            this.error = 'An error has occurred. Please try again.';
        }
      },
      goToRegister() {
        this.$router.push('/register'); // Navigate to the registration page
      }
    }
  };
  </script>
  
  <style scoped>
  @import "../assets/login.css";
  </style>
