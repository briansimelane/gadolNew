import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Player from '../views/Player.vue'
import Create from '../views/Create.vue'
import Join from '../views/Join.vue'
import Room from '../views/Room.vue'
import GameRoom from '../views/GameRoom.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import { projectAuth } from '../firebase/config'


// auth guard
const requireAuth = async (to, from, next) => {
  let user = projectAuth.currentUser
  console.log('currect user in auth guard: ', user)
  if(!user){
    next({ name: 'Home' })
  } else
    next()
 
}


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
    component: Player,
    beforeEnter: requireAuth
  },
  {
    path: '/create',
    name: 'Create',
    component: Create,
    beforeEnter: requireAuth
  },
  {
    path: '/join',
    name: 'Join',
    component: Join,
    beforeEnter: requireAuth
  },
  {
    path: '/room/:id',
    name: 'Room',
    component: Room,
    props: true,
    beforeEnter: requireAuth
  },
  {
    path: '/gameroom/:id',
    name: 'GameRoom',
    component: GameRoom,
    props: true,
    beforeEnter: requireAuth
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
