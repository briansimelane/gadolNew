<template>
    <nav class="">
        <div class="nav-wrapper purple darken-4 padding-left ">
        <router-link to="/" class="brand-logo left">Gadol Online</router-link>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li class="right padding-right">You are logged in as: {{ user.displayName }} </li> 
        </ul>
        </div>
    </nav>
</template>

<script>
import getUser from '../composables/getUser'

export default {
    setup(){
        const { user } = getUser() 

        return { user }
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