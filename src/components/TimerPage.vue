<!-- src/components/Home.vue -->
<template>
    <div class="timer-page-wrapper">
        <div class="timer-page">
        <h2>Timer Page</h2>
        </div>
    </div>
</template>
    
<script>
    export default {
      name: "TimerPage"
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
    display: flex;
}
</style>