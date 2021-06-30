<template>
    <nav class="">
        <div class="nav-wrapper green darken-3 padding-left ">
        <router-link to="/" class="brand-logo left">Gadol Online</router-link>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li class="padding-right">You are logged in as: {{ user.displayName }} </li>
        <li><a @click="handleExit">Exit game<i class="material-icons right">highlight_off</i></a></li> 
        </ul>
        </div>
    </nav>
</template>

<script>
import getUser from '../composables/getUser'
import { useRouter } from 'vue-router'

export default {
    setup(){
        const { user } = getUser() 
        const router = useRouter()


        const handleExit = () => {
                console.log('user exited the game')
                router.push ({ name: 'Player', params: {
                    user: user,
                }})
                M.toast({html: 'You exited the game'})
                
                    
                }

        return { user, handleExit }
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