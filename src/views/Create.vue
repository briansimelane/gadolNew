<template>
  <div class="container-fluid">
    
      <NavbarLoggedIn />

      <div class="container">
        <div class="center">
          <h5 class="remove-margin"><i class="material-icons space-right">build</i>Create a game room</h5>
        </div>
        
        
        <div class="row remove-margin">
            <div class="col s12 m12">
              <p class="center">A room is a place where you, {{ user.displayName}}, can invite your friends or teammates to play Gadol with you.</p>
              <p class="center">Once a room is created - you can share the game ID for others to join you.</p>
            </div>
        </div>

        <div class="row">
          <!-- spacing div -->
          <div class="col s12 m1"></div>

          <div class="col s12 m10">
            <div class="card horizontal">           
              <div class="card-stacked">
                <div class="card-content">
                  
                    <form class="col s12">
                            <div class="row">
                              <div class="input-field col s12 m6">
                                <input id="room_name" type="text" class="validate" v-model="roomName">
                                <label for="room_name">Give the room a name</label>
                              </div>
                              <div class="input-field col s12 m6">
                                <select v-model="numberPlayers">
                                  <option value="2" disabled selected>Choose your option</option>
                                  <option value="2">2 players</option>
                                  <option value="3">3 players</option>
                                  <option value="4">4 players</option>
                                </select>
                                <label>Number of players / teams</label>
                              </div>
                            </div>
                            
                            <div class="row margin-bottom">
                              <div class="col s12">
                                <span>Please enable options you would like to add:</span>
                              </div>
                              
                              <div class="input-field col s12 m6">
                                <label>
                                  <input type="checkbox" v-model="gameTimed"/>
                                  <span>Timed game</span>
                                </label>
                              </div>
                              <div class="input-field col s12 m6">
                                <label>
                                  <input type="checkbox" v-model="gameReserve" />
                                  <span>Reserve card action</span>
                                </label>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col s12 remove-margin">
                                <span>Which rules would you like to play with?</span>
                              </div>
                            
                            
                              <div class="col s12">
                                <select v-model="gameWinCondition">
                                  <option value="0" disabled selected>Choose your option</option>
                                  <option value="1">1st to 15 points (No contract fulfilment) </option>
                                  <option value="2">Highest value (Game ends with a contract fulfilment)</option>
                                </select>
                                
                              </div>

                              
                              
                            </div>
                            

                            <div class="row">
                              <div class="col s12 space-allaround"></div>
                              <div class="col s12 m12 center">
                                <a class="waves-effect waves-light btn amber accent-4 black-text" @click="createRoom"><i class="material-icons left">build</i>Create a room</a>
                                <div class="center space-allaround"><span>If you would like to join a room instead, click <router-link to="/join">here</router-link>.</span></div>
                              </div>
                            </div>
                        </form>  



                </div>
              </div>
            </div>
          </div>  

          <!-- spacing div -->
          <div class="col s12 m1"></div>

        </div>

        

      </div>

  </div>
</template>

<script>
import NavbarLoggedIn from '../components/NavbarLoggedIn'
import M from 'materialize-css'
import { ref } from '@vue/reactivity'
import getUser from '../composables/getUser'


export default {
  components: { NavbarLoggedIn },
  setup() {
    const { user } = getUser();
    const roomName = ref('')
    const numberPlayers = ref('')
    const gameContracts = ref('')
    const gameTimed = ref('')
    const gameReserve = ref('')
    const gameWinCondition = ref('')
   

    const createRoom = () => {
      const roomDetails = {
        creator: user.value.uid,
        name: roomName.value,
        players: numberPlayers.value,
        timed: gameTimed.value,
        reserve: gameReserve.value,
        rules: gameWinCondition.value
      }

      console.log(roomDetails)
      

    };

   

    const haveRooms = null;

    return { createRoom, haveRooms, user, roomName, numberPlayers, gameContracts, gameTimed, gameReserve, gameWinCondition }
  },
  mounted() {
        M.AutoInit()
    }
}

</script>
