<template>
    <nav class="">
        <div class="nav-wrapper green darken-3 padding-left">
        <router-link to="/" class="brand-logo left">Gadol Online</router-link>
        <ul id="nav-mobile" class="right">
        <li class="padding-right">You are logged in as: <span style="font-weight: bold;">{{ displayUser }}</span></li>
        <li><a @click="handleExit" style="cursor: pointer;">Exit game<i class="material-icons right">highlight_off</i></a></li> 
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
    setup() {
        const { user } = getUser()
        const { role, seat, userName, logout } = useSession()
        const router = useRouter()

        const displayUser = computed(() => {
          if (role.value === 'ADMIN' || role.value === 'FACILITATOR') {
            return userName.value || 'Facilitator'
          }
          if (role.value === 'PLAYER') {
            if (userName.value) {
              return `${userName.value} (Seat ${seat.value || 1})`
            }
            return seat.value ? `Player (Seat ${seat.value})` : 'Player'
          }
          return user.value?.displayName || user.value?.email || 'Player'
        })

        const handleExit = async () => {
          await logout()
          router.push({ name: 'Login' })
          M.toast({ html: 'You exited the game' })
        }

        return { displayUser, handleExit }
    }
}
</script>

<style scoped>
.padding-left {
    padding-left: 5px;
}
.padding-right {
    padding-right: 15px;
}
</style>