<template>
  <div class="container-fluid gameRoomBg">
    
      <NavbarInLobby />

      <div class="container-fluid">
        <div class="col s12 space-left margin-bottom-small center">
          <h6 class="white-text"> Welcome to the game room lobby</h6>
        </div>
      </div>

  

  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import getUser from '../composables/getUser'
import { projectAuth } from '../firebase/config'
import { projectFirestore } from '../firebase/config'
import NavbarInLobby from '../components/NavbarInLobby'




export default {
  components: { NavbarInLobby },
  props: ['id'],
  setup(props) {

    const { user } = getUser() 
    let gameData = ref(null)
  
    // Connection to the game       
const dbConnectionGame = projectFirestore.collection('rooms').doc(props.id)
    

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
          console.log("Game data: ", results)
          console.log("Rules: ", results.rules)
          

        }, err => {
                console.log(err.message);
            });
        
    }else {
        // User not logged in
        
        console.log('user logged out')
    }
})




        return { user, gameData }
  }
}

</script>
