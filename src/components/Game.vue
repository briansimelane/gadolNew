<template>
  <h3>This is where the game will be. </h3>
  <p>Game ID : {{ game.name}}</p>
</template>

<script>
import getGame from '../composables/getRoomData'
import { useRoute } from 'vue-router'

export default {
   props: ['gameID'],
    setup(props) {
        const route = useRoute()
        console.log(route)

        const { game, error, load } = getGame(props.value)

        load()
        

        return { game, error }
    }


}
</script>

<style>

</style>