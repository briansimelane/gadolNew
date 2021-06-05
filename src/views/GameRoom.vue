<template>
  <div class="container-fluid">
    
      <NavbarInRoom />

      <div class="container-fluid">
        <div class="center">
          <h5>Game room page</h5>
          <h6>Room ID: <span class="red-text">{{id}}</span> </h6>
        </div>
        <div class="row">
          <div class="col s12 center">
            <span>Return your dashboard: <button class="btn" @click="returnToplayer()">here</button></span>
            
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            <h6>Game data</h6>
            <!-- <p>{{ game }}</p> -->
            <p> Room name: {{ gameData.name}}</p>
            <p> Players: {{ gameData.players}}</p>
            
            
          </div>
        </div>
      </div>

      <div class="container-fluid yellow">
        <div class="row">
          <div class="col s4 space-allaround ">
            
          </div>
        </div>
      </div>

  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import getUser from '../composables/getUser'
import { projectAuth } from '../firebase/config'
import { projectFirestore } from '../firebase/config'
import { useRouter } from 'vue-router'
import NavbarInRoom from '../components/NavbarInRoom'
/* import getGame from '../composables/getRoomData' */




export default {
  components: { NavbarInRoom },
  props: ['id'],
  setup(props) {
    const { user } = getUser() 
    const gameData = ref(null)
    const router = useRouter()
      
      
/* Trying using the code from the player side */
// Keep track of User's authentication status (listen for auth status changes)
projectAuth.onAuthStateChanged(user => {
    if(user) {
        // If there is a user - it means they are logged in
        // get data from the database
        console.log('From inside the fetch: ', props.id)
        projectFirestore.collection('rooms').doc(props.id).onSnapshot(snapshot => {

          let results = snapshot.data()

       /*   snapshot.docs.forEach(doc => {
            results.push({...doc.data(), id: doc.id})
          }) */
          
        
          // update values
          gameData.value = results
          console.log(results)
        
          

        }, err => {
                console.log(err.message);
            });
        
    }else {
        // User not logged in
        
        console.log('user logged out')
    }
})



const returnToplayer = () => {
  router.push ({ name: 'Player'})
  console.log('Room exited');
  M.toast({html: 'Game room exited'})
}






     /* USING THE getGame composable 
     const { game, error, load } = getGame(props.id)

        load()
        
        gameData.value = game
        console.log(game) 

        return { game, error, gameData } */

        return { user, gameData, returnToplayer  }
  }
}

</script>
