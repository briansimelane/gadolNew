<template>
   <p>Game room : {{ game }}</p> 
  

</template>

<script>
import getGame from '../composables/getRoomData'
import { useRoute } from 'vue-router'
import { ref } from '@vue/reactivity'

export default {
   props: ['gameID'],
   data() {
     return {
       
     }
   },
   mounted(){
     const currentGame = ref()
        const route = useRoute()
        console.log(route)

        const { game, error, load } = getGame(this.gameID)

        load()

        const rules = () => {

          if(game.rules == 2) {
            rules = "Contracts" }
            else {
              rules = "1st to 15 points"
            }
        }
        
       

        console.log('From the Game component: ', game )
        console.log('From the Game component JSON: ', currentGame.value )
        return { game, error, currentGame, rules }
   }
    

}
</script>

<style>

</style>