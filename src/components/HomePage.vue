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
      <!-- Lamp elements -->
      <div class="clickable-element lamp" @click="toggleLamp">
        <img
          :src="isLampOn ? lampOnImage : lampOffImage"
          alt="Lamp"
          class="lamp-image"
        />
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
        <div class="calendar-sidebar-wrapper">
          <div class="calendar-modal" @click.stop>
            <CalendarPage />
            <!-- Sidebar elements (within calendar modal) -->
            <button @click="toggleSidebar" class="sidebar-toggle-button">
              Tasks
            </button>
          </div>
          <div v-if="showSidebar" class="sidebar">
            <h3>Tasks for today</h3>
            <div v-if="tasks.length === 0">No tasks for today.</div>
            <ul v-else>
              <li v-for="task in tasks" :key="task.id">{{ task.text }}</li>
            </ul>
          </div>
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
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import TimerPage from "./TimerPage.vue";
import CalendarPage from "./CalendarPage.vue";
import PetPart from "./PetPart.vue";
import lampOffImage from "../assets/lamp-off.png";
import lampOnImage from "../assets/lamp-on.png";

export default {
  name: "HomePage",
  components: { TimerPage, PetPart, CalendarPage },
  data() {
    return {
      userEmail: "", // Store the current user's email
      showDropdown: false, // For showing/hiding the dropdown menu
      showTimerModal: false, // For showing/hiding the timer modal
      showCalendarModal: false, // For showing/hiding the calendar modal
      showSidebar: false, // For showing/hiding the calendar sidebar
      isLampOn: false, // Toggle lamp state
      lampOffImage,
      lampOnImage,
      currentDate: new Date().toISOString().slice(0, 10), // Get current date
      tasks: [],
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
    toggleLamp() {
      this.isLampOn = !this.isLampOn;
    },
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
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
      this.fetchTasks();
    },
    async fetchTasks() {
      console.log("User Email:", this.userEmail);
      if (this.userEmail) {
        try {
          const docRef = doc(db, "users", this.userEmail);
          const docSnap = await getDoc(docRef);

          console.log("Document snapshot:", docSnap.data());

          if (docSnap.exists()) {
            const todoList = docSnap.data().todoList || {};
            console.log("Todo List:", todoList);

            // Format the current date to match 'MM/DD/YYYY'
            this.currentDate = this.formatDate(new Date()); // Ensure this is the correct format
            console.log("Current Date:", this.currentDate);

            // Access the tasks using the correct date format
            this.tasks = todoList[this.currentDate] || [];
            console.log("Tasks for date", this.currentDate, ":", this.tasks);
          } else {
            console.log("No such document!");
            this.tasks = [];
          }
        } catch (error) {
          console.error("Error fetching tasks: ", error);
        }
      }
    },

    formatDate(date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
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
  width: 100%;
  height: 100%;
  background-image: url("../assets/homebg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  top: 0;
  left: 0;
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

.timer-modal,
.calendar-modal {
  position: relative;
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
    width: 95vw;
    height: 55vh;
  }
  .timer-modal {
    width: 80vw;
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

.lamp {
  position: absolute;
  top: 21.2%;
  left: 52.5%;
}

.lamp-image {
  width: auto;
  height: 37.2vh;
}

.clock {
  position: absolute;
  top: 65.5%;
  left: 52.5%;
  transform: translate(50%, 50%);
}

.clock-image {
  width: 6.1vw;
  height: auto;
}

.calendar {
  position: absolute;
  top: 44.3%;
  left: 42.2%;
}

.calendar-image {
  width: 12vw;
  height: auto;
}

@media only screen and (orientation: portrait) {
  .clock {
    top: 64%;
    left: 60%;
  }
  .clock-image {
    width: 23vw;
  }
  .calendar {
    top: 44.3%;
    left: 21%;
  }
  .calendar-image {
    width: 45vw;
  }
  .lamp {
    top: 24.4%;
    left: 58.4%;
  }
  .lamp-image {
    height: 33vh;
  }
}

/* User Info Button */
.user-info {
  position: absolute;
  top: 2vw;
  right: 2vw;
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
    top: 1vw;
    right: 1vw;
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

.calendar-sidebar-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 60vh;
  position: relative;
  gap: 10px;
}

@media only screen and (orientation: portrait) {
  .calendar-sidebar-wrapper {
    flex-direction: column;
    height: 80vh;
  }
  .sidebar {
    min-width: 95vw;
    max-height: 25vh;
    overflow: auto;
  }
  .sidebar-toggle-button {
    font-size: 10px;
  }
}

.sidebar-toggle-button {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: #dab894;
  color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  z-index: 10;
  font-family: "Quicksand", sans-serif;
}

.sidebar {
  position: relative;
  justify-content: center;
  width: 20vw;
  height: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 25px;
  z-index: 10;
  font-family: "Quicksand", sans-serif;
}

.sidebar h3 {
  margin: 0 0 10px;
  text-align: center;
}

.sidebar ul {
  list-style-type: circle;
  padding: 0;
}

.sidebar li {
  padding: 5px 0;
  border-bottom: 1px solid #e0e0e0;
}
</style>
