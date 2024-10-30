<template>
  <div class="pet-container">
    <img
      :src="petImage"
      alt="Your Pet"
      class="pet-image"
      @click="togglePetInfo"
    />
    <div class="pet-info" v-if="showPetInfo">
      <h3>Your Pet</h3>
      <p>Food: {{ foodAmount }}</p>
      <p>Growth Level: {{ growthLevel }}</p>
      <button @click="feedPet" :disabled="foodAmount <= 0">Feed Pet</button>
    </div>
  </div>
</template>

<script>
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default {
  name: "PetPart",
  data() {
    return {
      foodAmount: 0,
      growthLevel: 0,
      pomodoroCount: 0,
      showPetInfo: false,
    };
  },
  computed: {
    petImage() {
      // Change the image based on growth level
      if (this.growthLevel >= 3) {
        return require("../assets/tokage1.jpg"); // Image when fully grown
      } else if (this.growthLevel >= 1) {
        return require("../assets/tokage2.jpg"); // Growth stage image
      }
      return require("../assets/tokage3.jpg"); // Baby pet image
    },
  },
  watch: {
    pomodoroCount(newCount) {
      this.updateFoodAndGrowth(newCount);
    },
  },
  methods: {
    async fetchPomodoroCount() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userDoc = doc(db, "users", user.email);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          this.pomodoroCount = docSnap.data().pomodoroCount || 0;
        } else {
          console.error("User document does not exist");
        }
      } else {
        console.error("No user is logged in.");
      }
    },
    async updateFoodAndGrowth(count) {
      // For every 5 pomodoros, increase food and growth level
      const cycles = Math.floor(count / 5);
      this.foodAmount = cycles * 10; // Example: Each cycle gives 10 food
      this.growthLevel = cycles; // Growth level increases with cycles

      await this.updateDatabase();
    },
    async feedPet() {
      if (this.foodAmount > 0) {
        this.foodAmount -= 5;
        this.growthLevel = Math.min(this.growthLevel + 1, 5); // Cap growth level

        await this.updateDatabase();
      }
    },
    async updateDatabase() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userDoc = doc(db, "users", user.email);
        try {
          await updateDoc(userDoc, {
            foodAmount: this.foodAmount,
            growthLevel: this.growthLevel,
          });
        } catch (error) {
          console.error("Error updating user data:", error);
        }
      }
    },
    togglePetInfo() {
      this.showPetInfo = !this.showPetInfo;
    },
  },
  async created() {
    await this.fetchPomodoroCount();
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
  cursor: pointer;
}

@media only screen and (orientation: portrait) {
  .pet-image {
    width: 100px;
  }
}

.pet-info {
  margin: 10px 0;
}

.pet-info button {
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}
</style>
