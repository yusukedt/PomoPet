<template>
  <div class="home-page-wrapper">
    <!-- Background elements -->
    <div class="background">
      <div class="user-info" ref="dropdown" @click.stop="toggleDropdown">
        {{ userEmail || "User not logged in" }}
        <div v-show="showDropdown" class="dropdown-menu" @click.stop>
          <button @click="logout">Logout</button>
        </div>
      </div>
      <!-- Calendar elements -->
      <div class="clickable-element calendar" @click="showCalendar">
        <img
          src="../assets/calendar.png"
          alt="Calendar"
          class="calendar-image"
        />
      </div>
      <div
        v-if="showCalendarModal"
        class="modal-backdrop"
        @click="hideCalendar"
      >
        <div class="calendar-modal" @click.stop>
          <CalendarPage />
        </div>
      </div>
      <!-- Clock elements -->
      <div class="clickable-element clock" @click="showTimer">
        <img src="../assets/clock.png" alt="Clock" class="clock-image" />
      </div>
      <div v-if="showTimerModal" class="modal-backdrop" @click="hideTimer">
        <div class="timer-modal" @click.stop>
          <TimerPage />
        </div>
      </div>
      <!-- Pet elements -->
      <PetPart :pomodoroCount="pomodoroCount" />
    </div>
  </div>
</template>

<script>
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import TimerPage from "./TimerPage.vue";
import CalendarPage from "./CalendarPage.vue";
import PetPart from "./PetPart.vue";

export default {
  name: "HomePage",
  components: { TimerPage, PetPart, CalendarPage },
  data() {
    return {
      userEmail: "", // Store the current user's email
      showDropdown: false, // For showing/hiding the dropdown menu
      showTimerModal: false, // For showing/hiding the timer modal
      showCalendarModal: false, // For showing/hiding the calendar modal
      clickSound: new Audio(require("../assets/clock-click.mp3")),
      flipSound: new Audio(require("../assets/calendar-flip.mp3")),
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
    playFlipSound() {
      this.flipSound.volume = 0.5;
      this.flipSound.currentTime = 0;
      this.flipSound.play();
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
    showCalendar() {
      this.playFlipSound();
      this.showCalendarModal = true;
    },
    hideCalendar() {
      this.showCalendarModal = false;
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
  margin: 0;
}

.background {
  width: 100vw;
  height: 100vh;
  background-image: url("../assets/homebg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  top: 0;
  left: 0;
}

@media only screen and (orientation: landscape) {
  .background {
    background-size: cover;
    background-position: center;
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
  width: 50vw;
  height: 60vh;
  background-color: white;
  border-radius: 40px;
  padding: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  animation: zoomIn 0.8s forwards;
  overflow: hidden;
}

@media only screen and (orientation: portrait) {
  .timer-modal {
    width: 80vw;
    height: 50vh;
  }
}

.calendar-modal {
  position: fixed;
  width: 50vw;
  height: 60vh;
  background-color: white;
  border-radius: 40px;
  padding: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  animation: zoomIn 0.8s forwards;
  overflow: hidden;
}

@media only screen and (orientation: portrait) {
  .calendar-modal {
    width: 90vw;
    height: 55vh;
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

.clock {
  position: absolute;
  top: calc(75.1%);
  left: calc(58.6%);
  transform: translate(-112%, -44%);
}

.clock-image {
  width: 100%;
  height: auto;
}

@media only screen and (orientation: portrait) {
  .clock {
    top: 73.3%;
    left: 95%;
  }
  .clock-image {
    width: 22vw;
  }
}

.calendar {
  position: absolute;
  top: 30%;
  left: 20%;
}

.calendar-image {
  width: 100%;
  height: auto;
}

@media only screen and (orientation: portrait) {
  .calendar {
    top: 44.3%;
    left: 21%;
  }
  .calendar-image {
    width: 45vw;
  }
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
  font-family: "Quicksand", sans-serif;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.user-info:hover {
  background-color: #f9f9f9;
}

@media only screen and (orientation: portrait) {
  .user-info {
    top: 10px;
    right: 10px;
    font-size: 10px;
    padding: 5px;
  }
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
  width: 100%;
  cursor: pointer;
  font-size: 14px;
  font-family: "Quicksand", sans-serif;
  text-align: center;
}

.dropdown-menu button:hover {
  background-color: #f1f1f1;
}

@media only screen and (orientation: portrait) {
  .dropdown-menu button {
    font-size: 10px;
    padding: 0px;
  }
}
</style>
