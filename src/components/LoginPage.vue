<template>
    <div class="auth-container">
        <h2 v-if="isRegister">Register</h2>
        <h2 v-else>Login to your account</h2>
  
        <form @submit.prevent="isRegister ? register() : login()">
        <div>
        <div>
        <label>{{ isRegister ? "Email" : "Email" }}:</label>
        <input type="text" v-model="identifier" required />
        </div>
        </div>
        <div>
            <label>Password:</label>
            <input type="password" v-model="password" required />
        </div>
        <button type="submit" :disabled="loading" :class="{ loading: loading }">
            <span v-if="loading" class="spinner"></span>
            <span v-else>{{ isRegister ? 'Register' : 'Login' }}</span>
        </button>
        </form>
  
        <button @click="toggleAuthMode">
        {{ isRegister ? 'Already have an account? Login' : 'Create an Account' }}
        </button>
  
        <p v-if="error">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
  import { logEvent } from "firebase/analytics";
  import { doc, setDoc, collection } from "firebase/firestore";
  import { auth, analytics, db } from "../firebase";
  
  export default {
    data() {
        return {
            identifier: '',
            password: '',
            error: '',
            isRegister: false, // Toggle between login and register modes
            loading: false
        };
    },
    methods: {
        toggleAuthMode() {
            this.isRegister = !this.isRegister;
            this.error = ''; // Clear errors when switching modes
        },
        async register() {
            this.loading = true; // Start loading
            this.error = ''; // Clear any previous error messages
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

            console.log("Registering with:", { email: this.identifier, password: this.password });

            try {
                // Create user account
                const userCredential = await createUserWithEmailAndPassword(auth, this.identifier, this.password);
                const userId = userCredential.user.uid;

                // Store additional user data in Firestore
                await setDoc(doc(collection(db, "users"), userId), {
                    email: this.identifier,
                    password: this.password,
                    createdAt: new Date()
                });

                // Log an analytics event on successful registration
                logEvent(analytics, 'sign_up', { method: 'email' });

                // Switch to login mode and clear fields
                this.toggleAuthMode();
                this.clearFields();

            } catch (err) {
                this.handleError(err);
            } finally {
                this.loading = false; // Stop loading
            }
        },
        async login() {
            this.loading = true; // Start loading
            this.error = ''; // Clear any previous error messages
            this.identifier = this.identifier.trim();
            this.password = this.password.trim();

            if (!this.identifier || !this.password) {
                this.error = 'Email and password are required.';
                this.loading = false;
                return;
            }

            let email = this.identifier;

            try {
                // Sign in with the determined email
                await signInWithEmailAndPassword(auth, email, this.password);
                this.$router.push("/home"); // Redirect to home on successful login

                // Log an analytics event on successful login
                logEvent(analytics, 'login', { method: 'email' });

            } catch (err) {
                this.handleError(err);
            } finally {
                this.loading = false; // Stop loading
            }
        },
        handleError(err) {
            console.error("Error:", err);
            // Handle common Firebase error messages
            switch (err.code) {
                case 'auth/invalid-email':
                    this.error = 'Invalid email address. Please check your input.';
                    break;
                case 'auth/user-not-found':
                    this.error = 'No user found with this email.';
                    break;
                case 'auth/wrong-password':
                    this.error = 'Incorrect password. Please try again.';
                    break;
                case 'auth/weak-password':
                    this.error = 'Password must be at least 6 characters long.';
                    break;
                case 'auth/email-already-in-use':
                    this.error = 'This email is already in use. Please use a different email.';
                    break;
                case 'auth/invalid-credential':
                    this.error = 'Email or password is incorrect.';
                    break;
                case 'auth/too-many-requests':
                    this.error = 'Too many requests. Please try again later.';
                    break;
                default:
                    this.error = 'An error has occurred. Please try again.';
            }
        },
        clearFields() {
            this.identifier = '';
            this.password = '';
        }
    }
};
</script>
  
  <style>
  @import "../assets/main.css";
  </style>