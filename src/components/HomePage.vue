<!-- src/components/Home.vue -->
<template>
  <div class="home-page-wrapper">
    <div class="background">
      <div class="clickable-element clock" @click="goToTimerPage">
        <img src="../assets/clock.png" alt="Clock" class="clock-image">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "HomePage",
    methods: {
      goToTimerPage() {
        // Navigate to timer page
        this.$router.push('/timer');
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
</style>