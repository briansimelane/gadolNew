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
                        <th class="center">Rules</th>
                        <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="room in roomsData" :key="room.id">
                      <td>{{ room.name }}</td>
                      <td class="center">{{ room.numPlayers }}</td>
                      <td class="center">{{ room.rules }}</td>
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

import NavbarLoggedIn from '../components/NavbarLoggedIn.vue'
import getUser from '../composables/getUser'
import { projectAuth } from '../firebase/config'
import { projectFirestore } from '../firebase/config'
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, onSnapshot, doc, getDoc, deleteDoc } from 'firebase/firestore'

export default {
  components: { NavbarLoggedIn },
  setup() {
    const { user } = getUser() 
    const roomsData = ref([])
    const router = useRouter()
    const userID = ref()
    let unsubSnapshot = null

    // Keep track of User's authentication status
    const unsubAuth = onAuthStateChanged(projectAuth, user => {
      if (user) {
        userID.value = user.uid

        // Set up real-time listener for rooms created by the user
        const q = query(
          collection(projectFirestore, 'rooms'),
          where('creator', '==', user.uid)
        )
        unsubSnapshot = onSnapshot(q, snapshot => {
          let results = []
          snapshot.forEach(doc => {
            results.push({ ...doc.data(), id: doc.id })
          })
          roomsData.value = results
          console.log(results)

          // Fetch player profile data
          getDoc(doc(projectFirestore, 'players', user.uid)).then(playerDoc => {
            if (playerDoc.exists()) {
              const surname = playerDoc.data().surname
              console.log('user logged in: ' + surname)
            }
          })
        }, err => {
          console.log("This is the error: " + err.message)
        })
      } else {
        console.log('user logged out')
        roomsData.value = []
        if (unsubSnapshot) unsubSnapshot()
      }
    })

    onUnmounted(() => {
      unsubAuth()
      if (unsubSnapshot) unsubSnapshot()
    })

    const haveRooms = ref(true)

    const deleteRoom = async (room) => {
      try {
        await deleteDoc(doc(projectFirestore, 'rooms', room))
        M.toast({ html: 'Room has been deleted.' })
        console.log("Room deleted: " + room)
      } catch (err) {
        console.log("Error deleting room:", err)
      }
    }

    const joinRoom = (roomToJoin) => {
      router.push({ name: 'GameRoom', params: { id: roomToJoin } })
      console.log('Room joined')
      M.toast({ html: 'Room has been joined' })
    }

    return { user, haveRooms, roomsData, deleteRoom, joinRoom }
  }
}
</script>
