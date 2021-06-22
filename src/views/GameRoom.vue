<template>
  <div class="container-fluid">
    
      <NavbarInRoom />

      <div class="container-fluid">
        <div class="col s12 space-left">
          <h6> Welcome to Game Room ID: <span class="red-text grey lighten-3 multipadding-5">{{id}}</span> </h6>
        </div>
        
        <div class="row">
          <div class="col s12">
            <p>Game data</p>
            <!-- <p>{{ game }}</p> -->
            <p> Room name: {{ gameData.name}}</p>
            <p> Players: {{ gameData.numPlayers}}</p>
            
            
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




     /* USING THE getGame composable 
     const { game, error, load } = getGame(props.id)

        load()
        
        gameData.value = game
        console.log(game) 

        return { game, error, gameData } */

        return { user, gameData  }
  }
}

</script>
