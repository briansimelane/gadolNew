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
import { ref, onUnmounted } from 'vue'
import getUser from '../composables/getUser'
import { projectAuth } from '../firebase/config'
import { projectFirestore } from '../firebase/config'
import NavbarInLobby from '../components/NavbarInLobby.vue'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'

export default {
  components: { NavbarInLobby },
  props: ['id'],
  setup(props) {
    const { user } = getUser() 
    const gameData = ref(null)
    let unsubSnapshot = null
  
    const unsubAuth = onAuthStateChanged(projectAuth, user => {
      if(user) {
        console.log('From inside the fetch: ', props.id)
        unsubSnapshot = onSnapshot(doc(projectFirestore, 'rooms', props.id), snapshot => {
          let results = snapshot.data() 
          gameData.value = results
          console.log("Game data: ", results)
          console.log("Rules: ", results.rules)
        }, err => {
          console.log(err.message);
        });
      } else {
        console.log('user logged out')
        gameData.value = null
        if (unsubSnapshot) unsubSnapshot()
      }
    })

    onUnmounted(() => {
      unsubAuth()
      if (unsubSnapshot) unsubSnapshot()
    })

    return { user, gameData }
  }
}
</script>
