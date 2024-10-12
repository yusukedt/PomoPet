import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../components/MainPage.vue';
import LoginPage from '../components/LoginPage.vue';
import RegisterPage from '../components/RegisterPage.vue';
import HomePage from '../components/HomePage.vue';
import TimerPage from '../components/TimerPage.vue';

const routes = [
  { path: '/', name: 'main', component: MainPage }, // Main page with Login and Sign Up options
  { path: '/login', name: 'login', component: LoginPage }, // Separate Login page
  { path: '/register', name: 'register', component: RegisterPage }, // Separate Register page
  { path: '/home', name: 'home', component: HomePage }, // Home page after successful login
  { path: '/timer', name: 'timer', component: TimerPage }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
