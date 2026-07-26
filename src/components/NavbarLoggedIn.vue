<template>
    <nav class="">
        <div class="nav-wrapper amber accent-4 padding-left black-text">
        <router-link to="/" class="brand-logo left black-text hide-on-med-and-down">Gadol Online</router-link>
        <router-link to="/" class="brand-logo center black-text smaller-font hide-on-med-and-up">Gadol Online</router-link>
        
        <ul id="nav-mobile" class="right hide-on-med-and-down">
               <li v-if="userName">You are logged in as: {{ userName }} </li> 
               <li><a @click="handleLogout">Logout<i class="material-icons right">highlight_off</i></a></li>
        </ul>
        </div>
    </nav>
</template>

<script>
import useSession from '../composables/useSession'
import { useRouter } from 'vue-router'
import M from 'materialize-css'

export default {
  setup() {
    const { logout, userName } = useSession()  
    const router = useRouter()

    const handleLogout = async () => {
      await logout()
      router.push({ name: 'Login' })
      M.toast({ html: 'You logged out' })
    }

    return { handleLogout, userName }
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

.smaller-font {
  font-size: 2rem;
}
</style>