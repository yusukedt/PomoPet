<template>
  <div class="timer-page-wrapper">
    <div class="timer-page">
      <div class="timer-display-wrapper">
        <h2 class="session-label">
          {{ currentMode == "work" ? "Session" : "Break" }}
        </h2>
        <!-- Timer Display -->
        <div class="timer-display">{{ formatTime(remainingTime) }}</div>
        <div class="timer-buttons">
          <!-- Timer Buttons -->
          <button @click="toggleTimer">
            {{ isRunning ? "Pause" : "Start" }}
          </button>
          <button @click="resetTimer">Reset</button>
        </div>
      </div>
      <!-- Timer Controls -->
      <div class="timer-control-wrapper">
        <!-- Break Timer -->
        <div class="timer-control-break">
          <h3>Break Length</h3>
          <div class="control-buttons">
            <button @click="decreaseBreakDuration">-</button>
            <span>{{ breakDuration / 60 }}</span>
            <button @click="increaseBreakDuration">+</button>
          </div>
        </div>
        <div class="timer-control-work">
          <!-- Session Timer -->
          <h3>Session Length</h3>
          <div class="control-buttons">
            <button @click="decreaseWorkDuration">-</button>
            <span>{{ workDuration / 60 }}</span>
            <button @click="increaseWorkDuration">+</button>
          </div>
        </div>
      </div>
      <div class="pomodoro-counter">
        Pomodoros Completed: {{ pomodoroCount }}
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  name: "TimerPage",
  data() {
    return {
      workDuration: 25 * 60, // 25 minutes work
      breakDuration: 5 * 60, // 5 minutes rest
      remainingTime: this.currentMode === "work" ? 25 * 60 : 5 * 60,
      isRunning: false,
      currentMode: "work", // "work" or "break"
      timer: null,
      pomodoroCount: 0,
    };
  },
  async created() {
    this.remainingTime = this.workDuration;
    // Load the user's pomodoro count when the component is created
    await this.loadPomodoroCount();
  },
  methods: {
    async loadPomodoroCount() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userDoc = doc(db, "users", user.email);
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
        const userDoc = doc(db, "users", user.email); // Reference the user's document

        await updateDoc(userDoc, {
          pomodoroCount: this.pomodoroCount, // Update the pomodoroCount in Firestore
        });
      } else {
        console.error("No user is logged in");
      }
    },

    // Reset the timer to the work duration
    resetTimer() {
      clearInterval(this.timer);
      this.isRunning = false;
      this.remainingTime = this.workDuration;
      this.currentMode = "work";
    },

    // Increase / Decrease durations
    increaseBreakDuration() {
      if (this.breakDuration < 60 * 60) this.breakDuration += 60;
      if (!this.isRunning && this.currentMode === "break") {
        this.remainingTime = this.breakDuration; // Update remaining time when in break mode
      }
    },

    decreaseBreakDuration() {
      if (this.breakDuration > 60) this.breakDuration -= 60;
      if (!this.isRunning && this.currentMode === "break") {
        this.remainingTime = this.breakDuration; // Update remaining time when in break mode
      }
    },

    increaseWorkDuration() {
      if (this.workDuration < 60 * 60) this.workDuration += 60;
      if (!this.isRunning && this.currentMode === "work") {
        this.remainingTime = this.workDuration; // Update remaining time when in work mode
      }
    },

    decreaseWorkDuration() {
      if (this.workDuration > 60) this.workDuration -= 60;
      if (!this.isRunning && this.currentMode === "work") {
        this.remainingTime = this.workDuration; // Update remaining time when in work mode
      }
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
  background-color: #aecdb6;
  padding: 30px;
  z-index: 10;
  justify-content: center;
  align-items: center;
  width: 50vw;
  border: 1px solid black;
  border-radius: 30px;
}

@media only screen and (orientation: portrait) {
  .timer-page {
    width: 80vw;
    height: 55vh;
  }
}

@media only screen and (orientation: landscape) {
  .timer-page {
    width: 50vw;
    height: 60vh;
  }
}

.timer-display-wrapper {
  justify-content: center;
  align-items: center;
  background-color: white;
  border: 1px solid black;
  border-radius: 30px;
  padding: 10px;
  margin-top: 20px;
}

.session-label {
  font-size: 24px;
  margin: 0;
}

.timer-display {
  font-size: 48px;
  margin: 20px 0;
}

.timer-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.timer-buttons button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: 2px solid black;
  border-radius: 10px;
  min-width: 20%;
  background: rgb(255, 255, 255);
  transition: transform 0.2s ease-in-out;
}

@media only screen and (orientation: portrait) {
  .timer-buttons button {
    font-size: 10px;
  }
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

.timer-control-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 20px;
  gap: 20px;
}

.timer-control-break,
.timer-control-work {
  background-color: #9bb6a2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  padding: 10px;
  border: 1px solid black;
  border-radius: 20px;
  margin: 5px;
  gap: 5px;
}

@media only screen and (orientation: portrait) {
  .timer-control-break,
  .timer-control-work {
    width: 80%;
  }
}

.timer-control-break h3,
.timer-control-work h3 {
  margin: 0;
}

@media only screen and (orientation: portrait) {
  .timer-control-break h3,
  .timer-control-work h3 {
    font-size: 14px;
  }
}

.control-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-buttons button {
  background-color: rgba(255, 255, 255, 0);
  border: 0px;
  font-size: 20px;
  color: white;
  width: 20px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.control-buttons button:hover {
  transform: scale(1.05);
}

.control-buttons span {
  font-size: 18px;
  padding: 0 5px;
}

@media only screen and (orientation: portrait) {
  .control-buttons span {
    font-size: 14px;
  }
}

.pomodoro-counter {
  margin-top: 20px;
  font-size: 20px;
  color: #333;
}

@media only screen and (orientation: portrait) {
  .pomodoro-counter {
    margin-top: 10px;
    font-size: 16px;
  }
}
</style>
