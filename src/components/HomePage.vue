<template>
  <div class="home-page-wrapper">
    <div class="background">
      <div class="user-info" @click="toggleDropdown">
      {{ userEmail || 'User not logged in' }}
      <div v-show="showDropdown" class="dropdown-menu">
        <button @click="logout">Logout</button>
      </div>
    </div>
    <div class="clickable-element clock" @click="goToTimerPage">
      <img src="../assets/clock.png" alt="Clock" class="clock-image">
    </div>
    </div>
  </div>
</template>

<script>
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default {
  name: "HomePage",
  data() {
    return {
      userEmail: "", // Store the current user's email
      showDropdown: false // For showing/hiding the dropdown menu
    };
  },
  mounted() {
    // Check if user is logged in and get email
    const user = auth.currentUser;
    if (user) {
      this.userEmail = user.email;
    } else {
      // User is not signed in, redirect to login page
      this.$router.push('/login');
    }
  },
  methods: {
    goToTimerPage() {
      // Navigate to timer page
      this.$router.push('/timer');
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    async logout() {
      try {
        await signOut(auth);
        this.userEmail ="";
        this.$router.push('/login'); // Redirect to login page after logout
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
  }
};
</script>

<style scoped>
.home-page-wrapper {
    width: 100vw;
    height: 100vh;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
}

.background {
  width: 100vw;
  height: 100vh;
  background-image: url('../assets/homebg.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  overflow: hidden;
}

/* Style for the clickable clock element */
.clickable-element {
  position: absolute;
  cursor: pointer;
  transition: filter 0.3s ease;
}

/* Position the clock specifically */
.clock {
  top: 72.5vh;
  left: 55.66vw;
}

.clock-image {
  width: 5vw;
  height: auto; /* Keeps the aspect ratio */
  transition: box-shadow 0.3s ease;
}

.clock-image:hover {
  filter: drop-shadow(0 0 20px rgba(227, 227, 92, 0.8));
}

/* User Info Button */
.user-info {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
  font-family: 'Quicksand', sans-serif;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.user-info:hover {
  background-color: #f9f9f9;
}

.dropdown-menu {
  margin-top: 5px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: absolute;
  right: 0;
  width: 100px;
  text-align: center;
}

.dropdown-menu button {
  background: none;
  border: none;
  color: #007bff;
  padding: 10px;
  width: 100%;
  cursor: pointer;
  font-size: 14px;
  font-family: 'Quicksand', sans-serif;
}

.dropdown-menu button:hover {
  background-color: #f1f1f1;
}
</style>