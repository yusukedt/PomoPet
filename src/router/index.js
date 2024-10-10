import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/LoginPage.vue';
import HomePage from '../components/HomePage.vue'; // You’ll need to create this component

const routes = [
  { path: '/', component: LoginPage },
  { path: '/home', component: HomePage }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
