<!-- src/components/Home.vue -->
<template>
  <div class="timer-page-wrapper">
    <div class="timer-page">
      <h2>Timer</h2>
      <div class="timer-display">{{ formatTime(remainingTime) }}</div>
      <div class="timer-buttons">
        <button @click="toggleTimer">
          {{ isRunning ? "Pause" : "Start" }}
        </button>
        <button @click="resetTimer">Reset</button>
      </div>
      <div class="timer-mode">
        {{ currentMode === "work" ? "Work Time" : "Break Time" }}
      </div>
      <div class="pomodoro-counter">
        Pomodoros Completed: {{ pomodoroCount }}
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'; 
import { getAuth } from 'firebase/auth';

export default {
  name: "TimerPage",
  data() {
    return {
      workDuration: 0.1 * 60, // 25 minutes work
      breakDuration: 5 * 60, // 5 minutes rest
      remainingTime: 0.1 * 60, // Initially set to work duration
      isRunning: false,
      currentMode: "work", // "work" or "break"
      timer: null,
      pomodoroCount: 0,
    };
  },
  async created() {
    // Load the user's pomodoro count when the component is created
    await this.loadPomodoroCount();
  },
  methods: {
    async loadPomodoroCount() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userDoc = doc(db, 'users', user.email);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          this.pomodoroCount = docSnap.data().pomodoroCount || 0;
        } else {
          await setDoc(userDoc, { pomodoroCount: 0 });
        }
      } else {
        console.error("No user is logged in.");
      }
    },
    // Format the remaining time as MM:SS
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
        2,
        "0"
      )}`;
    },

    // Start or pause the timer
    toggleTimer() {
      if (this.isRunning) {
        clearInterval(this.timer);
        this.isRunning = false;
      } else {
        this.timer = setInterval(this.countdown, 1000);
        this.isRunning = true;
      }
    },

    // Countdown logic for the timer
    countdown() {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        this.switchMode(); // Switch between work and break modes
      }
    },

    // Switch between work and break modes
    async switchMode() {
      if (this.currentMode === "work") {
        this.currentMode = "break";
        this.remainingTime = this.breakDuration;
        this.pomodoroCount++;
        await this.updatePomodoroCount();
      } else {
        this.currentMode = "work";
        this.remainingTime = this.workDuration;
      }
    },

    // Update the user's pomodoro count in Firestore
    async updatePomodoroCount() {
      const auth = getAuth(); // Get Firebase authentication instance
      const user = auth.currentUser; // Get the logged-in user

      if (user) {
        const userDoc = doc(db, 'users', user.email); // Reference the user's document

        await updateDoc(userDoc, {
          pomodoroCount: this.pomodoroCount, // Update the pomodoroCount in Firestore
        });
      } else {
        console.error('No user is logged in');
      }
    },

    // Reset the timer to the work duration
    resetTimer() {
      clearInterval(this.timer);
      this.isRunning = false;
      this.remainingTime = this.workDuration;
      this.currentMode = "work";
    },
  },
  beforeUnmount() {
    clearInterval(this.timer); // Clear the timer when component is destroyed
  },
};
</script>

<style scoped>
.timer-page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.timer-page {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0);
  padding: 20px;
  z-index: 10;
}

.timer-display {
  font-size: 48px;
  margin: 20px 0;
}

.timer-buttons {
  display: flex;
  gap: 10px;
}

.timer-buttons button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: 2px solid black;
  border-radius: 10px;
  min-width: 100px;
  background: rgb(255, 255, 255);
  transition: background-color 0.3s, transform 0.2s;
  will-change: transform;
}

.timer-buttons button:hover {
  background-color: rgb(230, 223, 223);
  transform: scale(1.05);
}

.timer-mode {
  margin-top: 20px;
  font-size: 24px;
  color: #555;
}

.pomodoro-counter {
  margin-top: 20px;
  font-size: 20px;
  color: #333;
}
</style>
