import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import FacilitatorHub from '../views/FacilitatorHub.vue'
import GameRoom from '../views/GameRoom.vue'
import useSession from '../composables/useSession'

const homeGuard = async (to, from, next) => {
  const { restoreSession, role, roomId } = useSession()
  await restoreSession()
  if (roomId.value && (role.value === 'PLAYER' || role.value === 'FACILITATOR' || role.value === 'SPECTATOR')) {
    next({ name: 'GameRoom', params: { id: roomId.value } })
  } else if (role.value === 'FACILITATOR' || role.value === 'ADMIN') {
    next({ name: 'FacilitatorHub' })
  } else {
    next({ name: 'Login' })
  }
}

const loginGuard = async (to, from, next) => {
  const { restoreSession, role, roomId } = useSession()
  await restoreSession()
  if (roomId.value && (role.value === 'PLAYER' || role.value === 'FACILITATOR' || role.value === 'SPECTATOR')) {
    next({ name: 'GameRoom', params: { id: roomId.value } })
  } else if (role.value === 'FACILITATOR' || role.value === 'ADMIN') {
    next({ name: 'FacilitatorHub' })
  } else {
    next()
  }
}

const requireFacilitator = async (to, from, next) => {
  const { restoreSession, role } = useSession()
  await restoreSession()
  if (role.value === 'FACILITATOR' || role.value === 'ADMIN') {
    next()
  } else {
    next({ name: 'Login' })
  }
}

const requireGameRoom = async (to, from, next) => {
  const { restoreSession, role, roomId } = useSession()
  const res = await restoreSession()
  const targetRoomId = to.params.id

  if (!res.success && res.message === 'This game has ended') {
    M.toast({ html: 'This game has ended.' })
    next({ name: 'Login' })
    return
  }

  if (role.value === 'ADMIN' || role.value === 'FACILITATOR' || role.value === 'SPECTATOR') {
    next()
  } else if (role.value === 'PLAYER' && roomId.value === targetRoomId) {
    next()
  } else {
    next({ name: 'Login' })
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    beforeEnter: homeGuard,
    component: { template: '<div>Loading...</div>' } // Handled by guard redirect
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: loginGuard
  },
  {
    path: '/facilitator',
    name: 'FacilitatorHub',
    component: FacilitatorHub,
    beforeEnter: requireFacilitator
  },
  {
    path: '/gameroom/:id',
    name: 'GameRoom',
    component: GameRoom,
    props: true,
    beforeEnter: requireGameRoom
  },
  // Catch all, redirect to home
  {
    path: '/:catchAll(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
