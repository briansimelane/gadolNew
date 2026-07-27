<template>
  <nav class="game-room-nav">
    <div class="nav-wrapper green darken-4 padding-left">
      <router-link to="/" class="brand-logo left hide-on-small-only">Gadol Online</router-link>
      <span class="brand-logo-small left hide-on-med-and-up">Gadol</span>

      <ul id="nav-mobile" class="right nav-items-list">
        <li class="user-display-item">
          <i class="material-icons tiny">account_circle</i>
          <span>{{ displayUser }}</span>
        </li>
        <li v-if="isFacilitatorOrAdmin">
          <button class="btn-flat white-text hub-btn" @click="goToHub" title="Facilitator Dashboard">
            <i class="material-icons" style="font-size: 1.1rem; margin-right: 4px;">dashboard</i>
            <span class="hide-on-small-only">Hub</span>
          </button>
        </li>
        <li>
          <a @click="handleExit" class="exit-link" title="Exit Game">
            <i class="material-icons" style="font-size: 1.1rem; margin-right: 4px;">highlight_off</i>
            <span class="hide-on-small-only">Exit</span>
          </a>
        </li> 
      </ul>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue'
import useSession from '../composables/useSession'
import getUser from '../composables/getUser'
import { useRouter } from 'vue-router'
import M from 'materialize-css'

export default {
  name: 'NavbarInRoom',
  props: {
    roomId: {
      type: String,
      default: ''
    },
    roomName: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const { user } = getUser()
    const { role, seat, userName, logout } = useSession()
    const router = useRouter()

    const isFacilitatorOrAdmin = computed(() => {
      return role.value === 'ADMIN' || role.value === 'FACILITATOR'
    })

    const displayUser = computed(() => {
      if (role.value === 'ADMIN' || role.value === 'FACILITATOR') {
        return userName.value || 'Facilitator'
      }
      if (role.value === 'SPECTATOR') {
        return 'Spectator'
      }
      if (role.value === 'PLAYER') {
        if (userName.value) {
          return `${userName.value} (Seat ${seat.value || 1})`
        }
        return seat.value ? `Player (Seat ${seat.value})` : 'Player'
      }
      return user.value?.displayName || user.value?.email || 'Player'
    })

    const goToHub = () => {
      router.push({ name: 'FacilitatorHub' })
    }

    const handleExit = async () => {
      await logout()
      router.push({ name: 'Login' })
      M.toast({ html: 'You exited the game' })
    }

    return { displayUser, isFacilitatorOrAdmin, goToHub, handleExit }
  }
}
</script>

<style scoped>
.game-room-nav {
  height: 48px;
  line-height: 48px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
.padding-left {
  padding-left: 12px;
  padding-right: 12px;
}
.brand-logo {
  font-weight: 700;
}
.brand-logo-small {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  line-height: 48px;
}
.nav-items-list {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 48px;
}
.user-display-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 4px;
}
.hub-btn {
  padding: 0 10px;
  height: 32px;
  line-height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.18);
  font-weight: 600;
  text-transform: none;
  font-size: 0.85rem;
}
.hub-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}
.exit-link {
  display: inline-flex;
  align-items: center;
  height: 32px;
  line-height: 32px;
  padding: 0 10px;
  border-radius: 6px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
}
.exit-link:hover {
  background: rgba(255, 255, 255, 0.25);
}
</style>