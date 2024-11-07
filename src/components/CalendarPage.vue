<template>
  <div class="calendar-page-wrapper">
    <div class="calendar-page">
      <div class="calendar-header">
        <button @click="prevMonth">Prev</button>
        <h2>{{ monthNames[currentMonth] }} {{ currentYear }}</h2>
        <button @click="nextMonth">Next</button>
      </div>
      <div class="calendar-grid">
        <div class="calendar-day" v-for="day in daysOfWeek" :key="day">
          {{ day }}
        </div>
        <div
          v-for="(date, index) in calendarDays"
          :key="index"
          :class="['calendar-date', { 'greyed-out': date.isOtherMonth }]"
          @click="!date.isOtherMonth && openTodoList(date.date)"
        >
          {{ date.date }}
          <span
            v-if="!date.isOtherMonth && hasTasks(date.dateString)"
            class="task-dot"
          ></span>
        </div>
      </div>
    </div>
    <!-- Task input -->
    <div v-if="showModal" class="todolist-wrapper" @click="closeModal">
      <div class="todolist" @click.stop>
        <h3>Tasks for {{ selectedDate }}</h3>
        <ul>
          <li
            v-for="(task, index) in todoList[selectedDate] || []"
            :key="index"
          >
            <input
              type="checkbox"
              :checked="task.done"
              @change="updateTask(index)"
            />
            <span :class="{ 'task-done': task.done }">{{ task.text }}</span>
            <button @click="deleteTask(index)" class="delete-task">
              Delete
            </button>
          </li>
        </ul>
        <input
          type="text"
          v-model="newTask"
          placeholder="Add a new task"
          @keyup.enter="addTask"
        />
        <button @click="addTask" class="add-task">Add Task</button>
        <button @click="closeModal" class="done-button">Done</button>
      </div>
    </div>
  </div>
</template>

<script>
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default {
  name: "CalendarPage",
  data() {
    return {
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      calendarDays: [],
      monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      userEmail: "",
      todoList: {},
      showModal: false,
      selectedDate: null,
      newTask: "",
    };
  },
  async created() {
    this.updateCalendar();
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      if (auth.currentUser) {
        this.userEmail = auth.currentUser.email;
        const docRef = doc(db, "tasks", this.userEmail);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this.todoList = docSnap.data().todoList || {};
        } else {
          // If the document does not exist, create an empty one
          await setDoc(docRef, { todoList: {} });
        }
      }
    },
    async saveTasks() {
      if (auth.currentUser) {
        const docRef = doc(db, "tasks", this.userEmail);
        await setDoc(docRef, { todoList: this.todoList }, { merge: true });
      }
    },
    async addTask() {
      if (this.newTask.trim() !== "") {
        if (!this.todoList[this.selectedDate]) {
          this.todoList[this.selectedDate] = [];
        }
        this.todoList[this.selectedDate].push({
          text: this.newTask,
          done: false,
        });
        this.newTask = "";
        await this.saveTasks();
      }
    },
    async deleteTask(index) {
      this.todoList[this.selectedDate].splice(index, 1);
      if (this.todoList[this.selectedDate].length === 0) {
        delete this.todoList[this.selectedDate];
      }
      await this.saveTasks();
    },
    async updateTask(index) {
      if (this.todoList[this.selectedDate]) {
        // Toggle the 'done' state
        const task = this.todoList[this.selectedDate][index];
        task.done = !task.done;

        // Log to check the updated task state
        console.log(`Updated task at index ${index}:`, task);

        // Save the updated tasks to Firebase
        await this.saveTasks();
      }
    },
    updateCalendar() {
      const firstDayOfMonth = new Date(
        this.currentYear,
        this.currentMonth,
        1
      ).getDay();
      const daysInCurrentMonth = new Date(
        this.currentYear,
        this.currentMonth + 1,
        0
      ).getDate();
      const daysInPrevMonth = new Date(
        this.currentYear,
        this.currentMonth,
        0
      ).getDate();

      this.calendarDays = [];

      // Days from previous month
      for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        const date = daysInPrevMonth - i;
        this.calendarDays.push({
          date,
          isOtherMonth: true,
          dateString: `${String(date).padStart(2, "0")}/${String(
            this.currentMonth === 0 ? 12 : this.currentMonth
          ).padStart(2, "0")}/${
            this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear
          }`,
        });
      }

      // Days in current month
      for (let date = 1; date <= daysInCurrentMonth; date++) {
        this.calendarDays.push({
          date,
          isOtherMonth: false,
          dateString: `${String(date).padStart(2, "0")}/${String(
            this.currentMonth + 1
          ).padStart(2, "0")}/${this.currentYear}`,
        });
      }
      // Days from next month to complete the grid
      const remainingDays = 35 - this.calendarDays.length;
      for (let i = 1; i <= remainingDays; i++) {
        this.calendarDays.push({
          date: i,
          isOtherMonth: true,
          dateString: `${String(i).padStart(2, "0")}/${String(
            this.currentMonth === 11 ? 1 : this.currentMonth + 2
          ).padStart(2, "0")}/${
            this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear
          }`,
        });
      }
    },
    prevMonth() {
      this.currentMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
      this.currentYear =
        this.currentMonth === 11 ? this.currentYear - 1 : this.currentYear;
      this.updateCalendar();
    },
    nextMonth() {
      this.currentMonth = this.currentMonth === 11 ? 0 : this.currentMonth + 1;
      this.currentYear =
        this.currentMonth === 0 ? this.currentYear + 1 : this.currentYear;
      this.updateCalendar();
    },
    openTodoList(date) {
      this.selectedDate = `${String(date).padStart(2, "0")}/${String(
        this.currentMonth + 1
      ).padStart(2, "0")}/${this.currentYear}`;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.newTask = "";
    },
    hasTasks(dateString) {
      return this.todoList[dateString] && this.todoList[dateString].length > 0;
    },
  },
};
</script>

<style scoped>
.calendar-page-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 100%;
  max-width: 800px;
  height: fit-content;
  padding: 2rem;
}

.calendar-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.calendar-header h2 {
  font-size: 2rem;
  margin: 20px;
  font-family: "Quicksand", sans-serif;
  font-weight: bold;
}

.calendar-header button {
  border: 1px solid black;
  border-radius: 5px;
  font-family: "Quicksand", sans-serif;
  font-size: 1rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  width: 100%;
  max-width: 600px;
}

.calendar-day,
.calendar-date {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5vh;
  border: 1px solid #ccc;
  border-radius: 7px;
  font-family: "Quicksand", sans-serif;
}

.calendar-date {
  position: relative;
  cursor: pointer;
}

.calendar-day {
  border: 2px solid #c0c0c0;
  height: 6vh;
}

.calendar-date.greyed-out {
  color: #aaa;
  background-color: #f0f0f0;
}

.todolist-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
.todolist {
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  width: 40vw;
  max-width: 450px;
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 101;
}

@media only screen and (orientation: portrait) {
  .todolist {
    width: 80vw;
  }
}
.todolist h3 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
  font-family: "Quicksand", sans-serif;
}

/* Task List */
.todolist ul {
  list-style: none;
  padding: 0;
}

.todolist li {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 8px;
  border-bottom: 1px solid #e0e0e0;
  gap: 10px;
  font-family: "Quicksand", sans-serif;
}

.todolist li:last-child {
  border-bottom: none;
}

.task-done {
  text-decoration: line-through;
  color: #aaa;
}

.task-text {
  font-size: 16px;
  color: #333;
}

.task-dot {
  position: absolute;
  display: inline-block;
  bottom: 0.3vh;
  left: 50%;
  transform: translateX(-50%);
  width: 0.5rem;
  height: 0.5rem;
  background-color: #656f78;
  border-radius: 50%;
}

.delete-task {
  display: none;
  border: none;
  border-radius: 5px;
  color: rgb(0, 0, 0);
  cursor: pointer;
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.3s ease;
  font-size: 10px;
  font-family: "Quicksand", sans-serif;
}

.todolist li:hover .delete-task {
  display: inline;
  opacity: 1;
}

/* Task Input */
.todolist input[type="text"] {
  width: 100%;
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  font-family: "Quicksand", sans-serif;
  box-sizing: border-box;
}

.todolist input[type="checkbox"] {
  margin-top: 2px;
}

/* 'Add Task' and 'Done' Button Styles */
.add-task,
.done-button {
  padding: 6px 10px;
  background-color: #dab894;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  font-family: "Quicksand", sans-serif;
}

.add-task:hover,
.done-button:hover {
  background-color: #c9aa89;
}
</style>
