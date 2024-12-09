<template>
  <div class="login-page-wrapper">
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
    <div class="login-logo-wrapper">
      <img src="../assets/pomopet.png" alt="Logo" class="logo" />
      <div class="login-page">
        <form @submit.prevent="login">
          <div class="email-input">
            <input
              type="text"
              v-model="identifier"
              class="form-control"
              placeholder="Email"
              required
            />
          </div>
          <div class="password-input">
            <input
              type="password"
              v-model="password"
              class="form-control"
              placeholder="Password"
              required
            />
          </div>
          <div class="checkbox-input form-check">
            <input
              type="checkbox"
              v-model="rememberMe"
              class="form-check-input"
              id="rememberMe"
            />
            <label class="form-check-label" for="rememberMe">Remember Me</label>
          </div>
          <p v-if="error" class="text-danger">
            <span class="error-icon">⚠️</span>{{ error }}
          </p>
          <div class="login-button-wrapper">
            <button type="submit" class="login-button" :disabled="loading">
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span v-else>Login</span>
            </button>
            <button class="forgot-password-link" @click="resetPassword">
              Forgot Password
            </button>
            <p v-if="resetEmailSent" class="text-success">
              Password reset email sent! Please check your inbox.
            </p>
          </div>
        </form>
        <div class="create-account-container">
          <button class="create-account-link" @click="goToRegister">
            New User? Create an account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { logEvent } from "firebase/analytics";
import { auth, analytics, db } from "../firebase";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default {
  data() {
    return {
      identifier: "",
      password: "",
      error: "",
      loading: false,
      rememberMe: false,
      resetEmailSent: false,
    };
  },
  beforeRouteEnter(to, from, next) {
    const lastLoginTime = localStorage.getItem("lastLoginTime");
    const rememberedEmail = localStorage.getItem("rememberedEmail");

    if (lastLoginTime && rememberedEmail) {
      const currentTime = new Date();
      const hoursSinceLastLogin =
        (currentTime - new Date(lastLoginTime)) / (1000 * 60 * 60);

      if (hoursSinceLastLogin < 24) {
        // Check if the user still exists in the Firebase database
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", rememberedEmail)
        );
        getDocs(userQuery)
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              // User exists, proceed to home page
              next("/home");
            } else {
              // User does not exist, clear local storage and proceed to login page
              localStorage.removeItem("rememberedEmail");
              localStorage.removeItem("lastLoginTime");
              next();
            }
          })
          .catch((error) => {
            console.error("Error checking user existence:", error);
            next(); // Proceed to login page if there's an error
          });
        return;
      }
    }
    next(); // Proceed to login page if no recent login or user data not found
  },
  methods: {
    async login() {
      this.loading = true;
      this.error = "";
      this.identifier = this.identifier.trim();
      this.password = this.password.trim();

      if (!this.identifier || !this.password) {
        this.error = "Email and password are required.";
        this.loading = false;
        return;
      }

      try {
        // Now try to sign
        await signInWithEmailAndPassword(auth, this.identifier, this.password);
        // Get user data from database
        const userDoc = await this.getUserData(this.identifier);

        if (this.rememberMe) {
          const currentTime = new Date();
          // Store user email and timestamp in localStorage
          localStorage.setItem("rememberedEmail", this.identifier);
          localStorage.setItem("lastLoginTime", currentTime.toISOString());

          // Update last login
          await updateDoc(doc(db, "users", userDoc.id), {
            lastLogin: currentTime,
          });
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("lastLoginTime");
        }
        this.$router.push("/home"); // Redirect to home on successful login
        logEvent(analytics, "login", { method: "email" });
      } catch (err) {
        this.handleError(err);
      } finally {
        this.loading = false;
      }
    },
    async resetPassword() {
      this.error = "";
      this.resetEmailSent = false;

      const email = prompt(
        "Please enter your email address for password reset."
      );
      if (email) {
        try {
          await sendPasswordResetEmail(auth, email);
          this.resetEmailSent = true;
        } catch (err) {
          console.error("Error sending password reset email:", err);
          this.handleError(err);
        }
      }
    },
    handleError(err) {
      console.error("Error:", err);
      // Handle common Firebase error messages
      switch (err.code) {
        case "auth/invalid-email":
          this.error = "Invalid email address.";
          break;
        case "auth/user-not-found":
          this.error = "No user found with this email.";
          break;
        case "auth/wrong-password":
          this.error = "Incorrect password. Please try again.";
          break;
        case "auth/too-many-requests":
          this.error = "Too many requests. Please try again later.";
          break;
        case "auth/invalid-credential":
          this.error = "Invalid email or password.";
          break;
        default:
          this.error = "An error has occurred. Please try again.";
      }
    },
    async getUserData(email) {
      const userQuery = query(
        collection(db, "users"),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0]; // Return the first matching user document
      }
      throw new Error("User not found");
    },
    goToRegister() {
      this.$router.push("/register"); // Navigate to the registration page
    },
    goToMain() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>

/* General Styles */
.login-page-wrapper {
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

.login-logo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media only screen and (orientation: portrait) {
  .login-logo-wrapper {
    flex-direction: column;
  }
}

@media only screen and (orientation: landscape) {
  .login-logo-wrapper {
    gap: 10vw;
  }
}

.logo {
  max-width: 300px;
}
/* Login Container Class */
.login-page {
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
  .login-page {
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
  width: 310px; /* Fill the width of the container */
  margin-bottom: 20px;
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

.login-button-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.login-button {
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
.login-button:hover {
  background-color: #599db6;
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.text-danger {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  font-family: "Quicksand", sans-serif;
}
.error-icon {
  margin-right: 8px;
  font-size: 18px;
  display: inline-block;
}
.register-prompt {
  margin-top: 0.5rem;
  text-align: center;
  font-family: "Quicksand", sans-serif;
}

.create-account-container {
  text-align: center;
}

.create-account-link {
  padding: 5px;
  padding-left: 15px;
  padding-right: 15px;
  border: 2px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
  font-family: "Quicksand", sans-serif;
}

.forgot-password-link {
  padding: 0;
  border: none;
  background: none;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
  font-family: "Quicksand", sans-serif;
  margin: 0 0.5rem;
}

.create-account-link:hover {
  background-color: #e6e6e6;
}

.forgot-password-link:hover {
  color: #0056b3; /* Darker shade on hover */
}

.text-success {
  color: green;
  font-family: "Quicksand", sans-serif;
  margin-top: 20px;
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

.form-check {
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 0;
  gap: 5px;
  margin-bottom: 10px;
}

.form-check-input {
  margin-bottom: 4.5px;
  position: relative;
}
</style>
