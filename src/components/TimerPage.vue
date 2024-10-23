<!-- src/components/Home.vue -->
<template>
  <div class="timer-page-wrapper">
    <div class="timer-page">
      <h2>Pomodoro Timer</h2>
        <div class="timer-display">{{ formatTime(remainingTime) }}</div>
        <div class="timer-buttons">
          <button @click="toggleTimer">{{ isRunning ? 'Pause' : 'Start' }}</button>
          <button @click="resetTimer">Reset</button>
        </div>
        <div class="timer-mode">{{ currentMode === 'work' ? 'Work Time' : 'Break Time' }}</div>
    </div>
  </div>
</template>
    
<script>
    export default {
      name: "TimerPage",
      data() {
        return {
            workDuration: 0.1 * 60, // 25 minutes work
            breakDuration: 5  * 60, // 5 minutes rest
            remainingTime: 0.1 * 60, // Initially set to work duration
            isRunning: false,
            currentMode: "work", // "work" or "break"
            timer: null,
        };
      },
      methods: {
    // Format the remaining time as MM:SS
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
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
    switchMode() {
      if (this.currentMode === "work") {
        this.currentMode = "break";
        this.remainingTime = this.breakDuration;
      } else {
        this.currentMode = "work";
        this.remainingTime = this.workDuration;
      }
    },

    // Reset the timer to the work duration
    resetTimer() {
      clearInterval(this.timer);
      this.isRunning = false;
      this.remainingTime = this.workDuration;
      this.currentMode = "work";
    }
  },
  beforeUnmount() {
    clearInterval(this.timer); // Clear the timer when component is destroyed
  }
};
</script>

<style scoped>
.timer-page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.timer-page {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9); /* Semi-transparent white */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
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
  border-radius: 10px;
  min-width: 100px;
}

.timer-mode {
  margin-top: 20px;
  font-size: 24px;
  color: #555;
}
</style>