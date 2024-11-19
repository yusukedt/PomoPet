<template>
  <div class="register-page-wrapper">
    <button @click="goToMain" class="back-button" aria-label="Go back">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12H3M12 21l-9-9 9-9"></path>
      </svg>
    </button>
    <div class="register-logo-wrapper">
      <img src="../assets/pomopet.png" alt="Logo" class="logo" />
      <div class="register-page">
        <form @submit.prevent="register">
          <div class="username-bday">
            <div class="username-input">
              <input
                type="text"
                v-model="username"
                class="form-control"
                id="username"
                placeholder="Username"
                required
                :disabled="loading"
              />
            </div>
            <div class="date-input">
              <input
                type="date"
                v-model="birthday"
                class="form-control"
                id="birthday"
                placeholder="dd/mm/yyyy"
                ref="datepicker"
                :disabled="loading"
              />
            </div>
          </div>
          <div class="email-input">
            <input
              type="email"
              v-model="identifier"
              class="form-control"
              id="email"
              placeholder="Email"
              required
              :disabled="loading"
            />
          </div>
          <div class="password-input">
            <input
              type="password"
              v-model="password"
              class="form-control"
              id="password"
              placeholder="Password"
              required
              :disabled="loading"
            />
          </div>
          <div class="register-button-wrapper">
            <button type="submit" class="register-button" :disabled="loading">
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span v-else>Register</span>
            </button>
          </div>
        </form>
        <div class="login-container">
          <button class="login-link" @click="goToLogin">
            Returning user? Login
          </button>
        </div>
        <p v-if="success" class="text-success" aria-live="polite">
          {{ success }}
        </p>
        <p v-if="error" class="text-danger" aria-live="assertive">
          <span class="error-icon">⚠️</span>{{ error }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { logEvent } from "firebase/analytics";
import { auth, analytics, db } from "../firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";

export default {
  data() {
    return {
      username: "",
      birthday: "",
      identifier: "",
      password: "",
      error: "",
      loading: false,
      success: "",
    };
  },
  mounted() {
    flatpickr(this.$refs.datepicker, {
      dateFormat: "d/m/Y", // Display format
      maxDate: "today", // Disable future dates
      allowInput: true, // Allow manual input
      appendTo: document.body, // Append the calendar to the body
    });
  },
  methods: {
    async register() {
      this.loading = true;
      this.error = "";
      this.success = "";
      this.identifier = this.identifier.trim();
      this.password = this.password.trim();

      if (!this.username.trim()) {
        this.error = "Username is required.";
        this.loading = false;
        return;
      }
      if (!this.birthday) {
        this.error = "Please select your birthday.";
        this.loading = false;
        return;
      }
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

        // Clear local storage if user is signing up for a new account
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("lastLoginTime");

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.identifier,
          this.password
        );
        const user = userCredential.user;

        // Create a user document in Firestore
        await setDoc(doc(db, "users", this.identifier), {
          createdAt: Timestamp.now(),
          uid: user.uid,
          username: this.username,
          email: this.identifier,
          password: this.password,
          birthday: this.birthday,
        });
        // Log registration success
        logEvent(analytics, "sign_up", { method: "email" });
        this.success = "Your account has been successfully created!";
        this.clearFields();

        // Add delay before navigating
        setTimeout(() => {
          this.success = "";
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
        case "auth/email-already-in-use":
          this.error = "This email is already in use.";
          break;
        case "auth/invalid-email":
          this.error = "Invalid email address.";
          break;
        case "auth/weak-password":
          this.error = "Password must be at least 6 characters long.";
          break;
        default:
          this.error = "An error has occurred. Please try again.";
      }
    },
    goToLogin() {
      this.$router.push("/login"); // Navigate to the login page
    },
    goToMain() {
      this.$router.push("/");
    },
    clearFields() {
      this.identifier = "";
      this.password = "";
    },
  },
};
</script>

<style scoped>
/* General Styles */
.register-page-wrapper {
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

.register-logo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media only screen and (orientation: portrait) {
  .register-logo-wrapper {
    flex-direction: column;
  }
}

@media only screen and (orientation: landscape) {
  .register-logo-wrapper {
    gap: 10vw;
  }
}

.logo {
  max-width: 300px;
}

/* Register Container Class */
.register-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 350px;
  width: fit-content;
  height: auto;
  padding: 2rem;
  border-radius: 10px;
  background: #d2e7ee;
  color: #333;
  text-align: center;
}

@media only screen and (orientation: portrait) {
  .register-page {
    background: rgba(255, 255, 255, 0);
    backdrop-filter: none;
    box-shadow: none;
  }
}

/* Input Fields */
input.form-control {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%; /* Fill the width of the container */
  margin: 20px 0;
  height: 40px;
  padding: 10px;
  box-sizing: border-box;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 40px;
  font-family: "Quicksand", sans-serif;
  background-color: #f9f9f9;
}

input.form-control::placeholder {
  color: #aaa;
  opacity: 1;
}

.username-bday input.form-control {
  width: 100%;
  margin: 0;
}

birthday.form-control {
  padding: 0;
}

.username-bday {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 10px;
}

input[type="date"].form-control {
  position: relative;
  appearance: none; /* Removes native styling for consistency */
  -webkit-appearance: none; /* Ensures compatibility with WebKit browsers */
}

.register-button-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
/* Register Page Specific Button Styles */
.register-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  min-height: 40px;
  padding: 5px;
  background-color: #66b1cc;
  color: rgb(255, 255, 255);
  border: none;
  border-radius: 5px;
  font-family: "Quicksand", sans-serif;
  margin: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease; /* Smooth transition for hover */
}

.register-button:hover {
  background-color: #599db6;
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
  font-family: "Quicksand", sans-serif;
}

.login-container {
  text-align: center;
}

/* Login Link */
.login-link {
  padding: 5px;
  padding-left: 15px;
  padding-right: 15px;
  border: 2px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 5px;
  font-family: "Quicksand", sans-serif;
}

.login-link:hover {
  background-color: #e6e6e6;
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
