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
        <li v-if="roomId">
          <button class="btn-flat white-text share-id-btn" @click="copyRoomId" title="Copy Room ID">
            <i class="material-icons">share</i>
          </button>
        </li>
        <li>
          <a @click="handleExit" class="exit-link" title="Exit Game">
            <i class="material-icons right">highlight_off</i>
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

    const copyRoomId = () => {
      if (!props.roomId) return
      if (navigator.clipboard) {
        navigator.clipboard.writeText(props.roomId)
        M.toast({ html: 'Room ID copied to clipboard!' })
      } else {
        M.toast({ html: `Room ID: ${props.roomId}` })
      }
    }

    const handleExit = async () => {
      await logout()
      router.push({ name: 'Login' })
      M.toast({ html: 'You exited the game' })
    }

    return { displayUser, copyRoomId, handleExit }
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
.room-nav-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
}
.brand-title {
  color: #ffffff;
  font-weight: 700;
}
.room-name-chip {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 1px solid rgba(255, 255, 255, 0.3);
}
.nav-items-list {
  display: flex;
  align-items: center;
  gap: 8px;
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
}
.share-id-btn {
  padding: 0 10px;
  height: 32px;
  line-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.12);
}
.exit-link {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  line-height: 32px;
  padding: 0 10px;
  border-radius: 6px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.12);
}
</style>