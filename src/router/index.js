import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../components/MainPage.vue';
import LoginPage from '../components/LoginPage.vue';
import RegisterPage from '../components/RegisterPage.vue';
import HomePage from '../components/HomePage.vue';
import TimerPage from '../components/TimerPage.vue';
import CalendarPage from '../components/CalendarPage.vue';

const routes = [
  { path: '/', name: 'main', component: MainPage, meta: { title: 'Main Page' }}, // Main page with Login and Sign Up options
  { path: '/login', name: 'login', component: LoginPage, meta: { title: 'Login Page' }}, // Separate Login page
  { path: '/register', name: 'register', component: RegisterPage, meta: { title: 'Register Page' } }, // Separate Register page
  { path: '/home', name: 'home', component: HomePage, meta: { title: 'Home Page' } }, // Home page after successful login
  { path: '/timer', name: 'timer', component: TimerPage, meta: { title: 'Timer Page' } }, // Timer page 
  { path: '/calendar', name: 'calendar', component: CalendarPage, meta: { title: 'Calendar Page'} } // Calendar Page
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
