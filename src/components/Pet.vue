<template>
  <div class="pet-container">
    <img :src="petImage" alt="Your Pet" class="pet-image" />
    <div class="pet-info">
      <h3>Your Pet</h3>
      <p>Food: {{ foodAmount }}</p>
      <p>Growth Level: {{ growthLevel }}</p>
    </div>
    <button @click="feedPet" :disabled="foodAmount <= 0">Feed Pet</button>
  </div>
</template>

<script>
export default {
  name: "Pet",
  props: {
    pomodoroCount: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      foodAmount: 0,
      growthLevel: 0,
    };
  },
  computed: {
    petImage() {
      // Change the image based on growth level
      if (this.growthLevel >= 3) {
        return require("../assets/pet_happy.png"); // Image when fully grown
      } else if (this.growthLevel >= 1) {
        return require("../assets/pet_growth.png"); // Growth stage image
      }
      return require("../assets/pet_baby.png"); // Baby pet image
    },
  },
  watch: {
    pomodoroCount(newCount) {
      this.updateFoodAndGrowth(newCount);
    },
  },
  methods: {
    updateFoodAndGrowth(count) {
      // For every 5 pomodoros, increase food and growth level
      const cycles = Math.floor(count / 5);
      this.foodAmount = cycles * 10; // Example: Each cycle gives 10 food
      this.growthLevel = cycles; // Growth level increases with cycles
    },
    feedPet() {
      if (this.foodAmount > 0) {
        this.foodAmount--;
        this.growthLevel = Math.min(this.growthLevel + 1, 3); // Cap growth level
      }
    },
  },
  created() {
    this.updateFoodAndGrowth(this.pomodoroCount);
  },
};
</script>

<style scoped>
.pet-container {
  text-align: center;
  margin: 20px;
}

.pet-image {
  width: 150px; /* Adjust as necessary */
}

.pet-info {
  margin: 10px 0;
}

button {
  padding: 10px 15px;
  cursor: pointer;
}
</style>
