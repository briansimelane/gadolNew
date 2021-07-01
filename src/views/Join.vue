<template>
  <div class="container-fluid">
    
      <NavbarLoggedIn />

      <div class="container">
        <div class="center">
          <h5><i class="material-icons space-right">fingerprint</i>Join a game room</h5>
        </div>
        
        
        <div class="row">
            <div class="col s12 m12">
              <p class="center">A room is a place where you can join your friends or teammates to play Gadol.</p>
              <p class="center">Use the ID given to you to join the game.</p>
            </div>
        </div>

        <div class="row">
          <!-- spacing div -->
          <div class="col s12 m2"></div>

          <div class="col s12 m8">
            <div class="card horizontal">           
              <div class="card-stacked">
                <div class="card-content">
                  
                    <form @submit.prevent="joinRoom()">
                            <div class="row">
                              <div class="input-field col s12 m12 ">
                                <input id="room_id" type="text" class="validate" v-model="roomID" required>
                                <label for="room_id" >Enter the room ID</label>
                              </div>
                             
                            </div>
                            
                            <div class="row">
                              <div class="col s12 m12 center">
                                <button type="submit" class="waves-effect waves-light btn amber accent-4 black-text"><i class="material-icons left">fingerprint</i>Join a room</button>
                                <div class="center space-allaround"><span>If you would like to create a room instead, click <router-link to="/create">here</router-link>.</span></div>
                              </div>
                            </div>

                        </form>  



                </div>
              </div>
            </div>
          </div>  

          <!-- spacing div -->
          <div class="col s12 m2"></div>

        </div>

        

      </div>

  </div>
</template>

<script>
import { ref } from '@vue/reactivity';
import NavbarLoggedIn from '../components/NavbarLoggedIn'
import { useRouter } from 'vue-router'


export default {
  components: { NavbarLoggedIn },
  setup() {
    let roomID =ref()
    const router = useRouter()
  //const roomGameId = roomID.value

    const joinRoom = () => {
      
      router.push ({ name: 'GameRoom', params: {id: roomID.value }})
      console.log('Room joined', roomID.value );
      M.toast({html: 'Room has been joined'})
      console.log('Join a room clicked');
    };



    const haveRooms = null;

    return { joinRoom, haveRooms, roomID }
  }
}

</script>
