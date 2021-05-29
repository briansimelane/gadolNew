<template>
  <h5>Game component output </h5>
  <p>Game ID : {{ game}}</p> 
</template>

<script>
import getGame from '../composables/getRoomData'
import { useRoute } from 'vue-router'

export default {
   props: ['gameID'],
    setup(props) {
        const route = useRoute()
        console.log(route)

        const { game, error, load } = getGame(props.gameID)

        load()
        
        console.log('From the Game component: ', game )
        return { game, error }
    }


}
</script>

<style>

</style>