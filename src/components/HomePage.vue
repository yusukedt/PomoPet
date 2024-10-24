<template>
  <div class="home-page-wrapper">
    <div class="background">
      <div class="user-info" ref="dropdown" @click.stop="toggleDropdown">
        {{ userEmail || "User not logged in" }}
        <div v-show="showDropdown" class="dropdown-menu" @click.stop>
          <button @click="logout">Logout</button>
        </div>
      </div>
      <div class="clickable-element clock" @click="showTimer">
        <img src="../assets/clock.png" alt="Clock" class="clock-image" />
      </div>
      <div v-if="showTimerModal" class="modal-backdrop" @click="hideTimer">
        <div class="timer-modal" @click.stop>
          <TimerPage />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import TimerPage from "./TimerPage.vue";

export default {
  name: "HomePage",
  components: { TimerPage },
  data() {
    return {
      userEmail: "", // Store the current user's email
      showDropdown: false, // For showing/hiding the dropdown menu
      showTimerModal: false,
      clickSound: new Audio(require("../assets/clock-click.mp3")),
    };
  },
  mounted() {
    // Event listener to detect clicks outside dropdown
    document.addEventListener("click", this.handleClickOutside);

    // Check if user is logged in and get email
    const user = auth.currentUser;
    if (user) {
      this.userEmail = user.email;
    } else {
      // User is not signed in, redirect to login page
      this.$router.push("/login");
    }
  },
  beforeUnmount() {
    // Remove event listener when component is unmounted
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    playClickSound() {
      this.clickSound.volume = 0.5;
      this.clickSound.currentTime = 0;
      this.clickSound.play();
    },
    handleClickOutside(event) {
      // Check if click target is outside the dropdown
      if (this.showDropdown && !this.$refs.dropdown.contains(event.target)) {
        this.showDropdown = false;
      }
    },
    showTimer() {
      this.playClickSound();
      this.showTimerModal = true;
    },
    hideTimer() {
      this.showTimerModal = false;
    },
    goToTimerPage() {
      // Navigate to timer page
      this.$router.push("/timer");
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    async logout() {
      try {
        await signOut(auth);
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("lastLoginTime");
        this.userEmail = "";
        this.showDropdown = false;
        this.$nextTick(() => {
          this.$router.push("/login"); // Redirect to login page after logout
        });
      } catch (error) {
        console.error("Error logging out:", error);
      }
    },
  },
};
</script>

<style scoped>
.home-page-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  position: relative;
}

.background {
  width: 100vw;
  height: 100vh;
  background-image: url("../assets/homebg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
}

@media (max-width: 768px) {
  .background {
    background-size: 400%;
    background-position: 70% 30%;
  }
}

/* Modal backdrop with blur */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px); /* Blur the background */
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease-in-out;
  z-index: 100;
}

.timer-modal {
  position: fixed;
  width: 30vw;
  height: 60vh;
  background-color: white;
  border-radius: 40px;
  padding: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  animation: zoomIn 0.8s forwards;
  overflow: hidden;
}

@media (max-width: 768px) {
  .timer-modal {
    width: 70vw;
    height: 60vh;
  }
}

@media (max-height: 650px) {
  .timer-modal {
    width: 30vw;
    height: 70vh;
  }
}

@keyframes zoomIn {
  0% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
}

/* Style for the clickable clock element */
.clickable-element {
  position: absolute;
  cursor: pointer;
  transition: filter 0.3s ease;
}

/* Position the clock specifically */
.clock {
  position: absolute;
  top: calc(75.1%); /* You can tweak this to ensure alignment */
  left: calc(58.6%); /* You can tweak this to ensure alignment */
  transform: translate(-112%, -44%); /* Center the clock */
}

.clock-image {
  width: 59%;
  height: auto; /* Keeps the aspect ratio */
}

/* .clock-image:hover {
  filter: drop-shadow(0 0 20px rgba(227, 227, 92, 0.8));
} */

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
  font-family: "Quicksand", sans-serif;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.user-info:hover {
  background-color: #f9f9f9;
}

.dropdown-menu {
  display: flex;
  margin-top: 5px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: absolute;
  width: 100%;
  min-width: auto;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
}

.dropdown-menu button {
  background: none;
  border: none;
  color: #007bff;
  padding: 5px;
  width: 100%;
  cursor: pointer;
  font-size: 14px;
  font-family: "Quicksand", sans-serif;
  text-align: center;
}

.dropdown-menu button:hover {
  background-color: #f1f1f1;
}
</style>
