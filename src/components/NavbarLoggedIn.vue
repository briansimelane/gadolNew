<template>
    <nav class="">
        <div class="nav-wrapper amber accent-4 padding-left black-text">
        <router-link to="/" class="brand-logo left black-text hide-on-med-and-down">Gadol Online</router-link>
        <router-link to="/" class="brand-logo center black-text smaller-font hide-on-med-and-up">Gadol Online</router-link>
        
        <ul id="nav-mobile" class="right hide-on-med-and-down">
               <li>You are logged in as: {{ user.displayName }} </li> 
              <!-- <li><a @click="handleClick">Exit Game <i class="material-icons right">exit_to_app</i></a></li> -->
              <li><a @click="handleLogout">Logout<i class="material-icons right">highlight_off</i></a></li>
        </ul>
        </div>
    </nav>
</template>

<script>
import useLogout from '../composables/useLogout'
import getUser from '../composables/getUser'
import { useRouter } from 'vue-router'

export default {
  setup(props, context) {
    const { logout, error } = useLogout()
    const { user } = getUser()  
    const router = useRouter()

  const handleClick = async () => {
    await logout()
    if(!error.value) {
      console.log('user logged out')
      router.push ({ name: 'Home'})
      M.toast({html: 'You logged out'})
            }
    }

  const handleLogout = async () => {
    await logout()
    if(!error.value) {
      console.log('user logged out')
      router.push ({ name: 'Home'})
      M.toast({html: 'You logged out'})
        }
    }

  return { handleClick, handleLogout, user }

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