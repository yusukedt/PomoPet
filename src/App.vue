<template>
  <div id="app">
    <transition name="fade" @after-leave="handleAfterLeave">
      <router-view v-if="!loading"></router-view>
    </transition>
    <transition name="fade">
      <div v-if="loading" class="loading-indicator"></div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      loading: false,
    };
  },
  watch: {
    $route(to) {
      this.loading = true; // Show loading indicator on route change
      this.updateTitle(to.meta.title); // Update the title based on the route's metadata

      // Simulate a delay (remove this in production)
      setTimeout(() => {
        this.loading = false; // Hide loading indicator after 1 second
      }, 1000);
    },
  },
  methods: {
    handleAfterLeave() {
      // After the old page has faded out, allow the new page to render
      this.loading = false;
    },
    updateTitle(title) {
      // Set the document title
      document.title = `PomoPet - ${title}`;
    },
  },
};
</script>

<style>
/* Transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter,
.fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

/* Loading indicator styles */
.loading-indicator {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5em;
  color: #333;
}
</style>
