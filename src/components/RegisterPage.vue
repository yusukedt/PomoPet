<template>
    <div class="register-page">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div class="form-group">
          <input type="email" v-model="identifier" class="form-control" id="email" placeholder="Email" required />
        </div>
        <div class="form-group">
          <input type="password" v-model="password" class="form-control" id="password" placeholder="Password" required />
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
        <p v-if="error" class="text-danger">
            <span class="error-icon">🚨</span>{{ error }}
        </p>
    </div>
  </template>

<script>
import { createUserWithEmailAndPassword } from "firebase/auth";
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
    async register() {
    this.loading = true;
    this.error = '';
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
        await createUserWithEmailAndPassword(auth, this.identifier, this.password);
        // Log registration success
        logEvent(analytics, 'sign_up', { method: 'email' });
        this.clearFields();
        this.goToLogin(); // Redirect to login after successful registration
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
    clearFields() {
    this.identifier = '';
    this.password = '';
    }
}
};
</script>

<style scoped>
@import "../assets/register.css";
</style>
