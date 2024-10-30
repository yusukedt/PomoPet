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
          class="calendar-date"
          v-for="(date, index) in daysInMonth"
          :key="index"
        >
          {{ date }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CalendarPage",
  data() {
    return {
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      daysInMonth: [],
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
    };
  },
  methods: {
    updateCalendar() {
      const daysInCurrentMonth = new Date(
        this.currentYear,
        this.currentMonth + 1,
        0
      ).getDate();
      this.daysInMonth = Array.from(
        { length: daysInCurrentMonth },
        (_, i) => i + 1
      );
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
  },
  created() {
    this.updateCalendar();
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
}

.calendar-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.calendar-header h2 {
  font-size: 19px;
  margin: 20px;
}

.calendar-header button {
  border: 2px solid black;
  border-radius: 5px;
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
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 7px;
}
</style>
