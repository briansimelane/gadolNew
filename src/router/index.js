import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Player from '../views/Player.vue'
import Create from '../views/Create.vue'
import Join from '../views/Join.vue'
import Room from '../views/Room.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/player',
    name: 'Player',
    component: Player
  },
  {
    path: '/create',
    name: 'Create',
    component: Create
  },
  {
    path: '/join',
    name: 'Join',
    component: Join
  },
  {
    path: '/room',
    name: 'Room',
    component: Room
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
