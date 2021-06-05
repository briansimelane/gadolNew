<template>
  <div class="container-fluid">
    
      <NavbarLoggedIn  />

      <div class="container">
        
        <h5>Welcome {{ user.displayName }}!</h5>
        
        <div class="row">
            <div class="col s12 m12">
              <p>This is the player restricted area. Here you will find your created rooms or be able to join another player's room.</p>
            </div>
        </div>

        <div class="row">
          <div class="col s12 m12 center">
            <router-link to="/create" class="waves-effect waves-light btn space-allaround amber accent-4  black-text"><i class="material-icons left">build</i>Create a room</router-link>
            <router-link to="/join" class="waves-effect waves-light btn amber accent-4  black-text"><i class="material-icons left">fingerprint</i>Join a room</router-link>
          </div>
        </div>



        <div class="row">
            <div class="col s12 m12">
              <h6>Your created rooms:</h6>
              <div v-show="!haveRooms">
                <p class="red-text"><em>You currenly have no rooms open</em></p>
                
              </div>

              <div v-show="haveRooms">
                <table class="highlight">
                  <thead>
                    <tr>
                        <th>Room name</th>
                        <th class="center">Player count</th>
                        <th class="center">Timed game?</th>
                        <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="room in roomsData" :key="room.id">
                      <td>{{ room.name }}</td>
                      <td class="center">{{ room.players }}</td>
                      <td class="center">{{ room.timed }}</td>
                      <td><button class="btn space-allaround green darken-3" @click="joinRoom(room.id)" >Join</button>
                        <button class="btn red darken-4" @click="deleteRoom(room.id)">Delete</button></td>
                    </tr>
                  </tbody>
                </table>

              </div>

            </div>
        </div>

      </div>

  </div>
</template>

<script>

import NavbarLoggedIn from '../components/NavbarLoggedIn'
import getUser from '../composables/getUser'
import { projectAuth } from '../firebase/config'
import { projectFirestore } from '../firebase/config'
import { ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'


export default {
  components: { NavbarLoggedIn },
  setup() {
    const { user } = getUser() 
    const roomsData = ref(null)
    const router = useRouter()

// Keep track of User's authentication status (listen for auth status changes)
projectAuth.onAuthStateChanged(user => {
    if(user) {
        // If there is a user - it means they are logged in
        // get data from the database
        projectFirestore.collection('rooms').where('creator', '==', user.uid).onSnapshot(snapshot => {
        // calls the function in the app.js to setup guides
        
          let results = []

          snapshot.docs.forEach(doc => {
            results.push({...doc.data(), id: doc.id})
          })
          
        
          // update values
          roomsData.value = results
          console.log(results)
        

        

            projectFirestore.collection('players').doc(user.uid).get().then(doc => {
                const surname = doc.data().surname
                
                console.log('user logged in: ' + surname);
            });

        }, err => {
                console.log(err.message);
            });
        
    }else {
        // User not logged in
        
        console.log('user logged out')
    }
})


const haveRooms = 1;

const deleteRoom = async (room) => {
  await projectFirestore.collection('rooms').doc(room).delete()
  M.toast({html: 'Room has been deleted.'})
  console.log(room)

}

const joinRoom = (roomToJoin) => {
  router.push ({ name: 'GameRoom', params: {id: roomToJoin}})
  console.log('Room joined');
  M.toast({html: 'Room has been joined'})
}

    return { user, haveRooms, roomsData, deleteRoom, joinRoom }
  }
}

</script>
