<template>
  <div class="container-fluid">
    
      <NavbarLoggedIn />

      <div class="container">
        <div class="center">
          <br>
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
                  
                    <form class="col s12" @submit.prevent="createRoom()">
                            <div class="row">
                              <div class="input-field col s12 m6">
                                <input id="room_name" type="text" class="validate" v-model="roomName" required>
                                <label for="room_name">Give the room a name</label>
                              </div>
                              <div class="input-field col s12 m6">
                                <select v-model="numberPlayers" required>
                                  <option value="2" disabled selected>Choose your option</option>
                                  <option value="2">2 players</option>
                                  <option value="3">3 players</option>
                                  <option value="4">4 players</option>
                                </select>
                                <label>Number of players / teams</label>
                              </div>
                            </div>
                            
                        <!--    <div class="row margin-bottom">
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
                            -->

                            <div class="row">
                              <div class="col s12 remove-margin">
                                <span>Which rules would you like to play with?</span>
                              </div>
                            
                            
                              <div class="col s12">
                                <select v-model="gameWinCondition" required>
                                  <option value="contracts" disabled selected>Choose your option</option>
                                  <option value="points">1st to 15 points (No contract fulfilment) </option>
                                  <option value="contracts">Highest value (Game ends with a contract fulfilment)</option>
                                </select>
                                
                              </div>

                              
                              
                            </div>
                            

                            <div class="row">
                              <div class="col s12 space-allaround"></div>
                              <div class="col s12 m12 center">
                                <button type="submit" class="waves-effect waves-light btn amber accent-4 black-text"><i class="material-icons left">build</i>Create a room</button>
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
import NavbarLoggedIn from '../components/NavbarLoggedIn.vue'
import M from 'materialize-css'
import { ref } from 'vue'
import getUser from '../composables/getUser'
import useCollection from '../composables/useCollection'
import { useRouter } from 'vue-router'


export default {
  components: { NavbarLoggedIn },
  setup() {
    const { user } = getUser()
    const { error, addDoc } = useCollection('rooms')
    const router = useRouter()

    const roomName = ref('')
    const numberPlayers = ref('')
    const gameTimed = ref('')
    const gameReserve = ref('')
    const gameWinCondition = ref('')

    const numPlayers = parseInt(numberPlayers.value)
    
    // global variables for the game
    let resetValues // JSON reset file values
    
    // cards variables
    let resetRedCards
    let resetGreenCards
    let resetYellowCards
    let resetPurpleCards
    let resetBlackCards
    let resetContractCards

    // temp resources variables
    let maxNumberOfPlayers
    let maxTempResources

    let marketTempRed 
    let marketTempGreen 
    let marketTempYellow 
    let marketTempPurple 
    let marketTempBlack 

    // player start resources
    let playerStartCash
    let playerStartProduction
    let playerTempRed
    let playerTempGreen
    let playerTempYellow
    let playerTempPurple
    let playerTempBlack
    let playerPermRed
    let playerPermGreen
    let playerPermYellow
    let playerPermPurple
    let playerPermBlack
    let playerStartValue
    let playerStartCost
    let playerStartDebtors

// Initialisation function to bring JSON start state values
   fetch('/reset.json') 
        .then(response => response.json())
        .then(data => {
           
// Assign JSON game file to variables
    resetValues = data.ResetTable

   //Updated Temporary Resources Starting Values
    marketTempRed = resetValues.temporaryResources.red
    marketTempGreen = resetValues.temporaryResources.green
    marketTempYellow = resetValues.temporaryResources.yellow
    marketTempPurple = resetValues.temporaryResources.purple
    marketTempBlack = resetValues.temporaryResources.black

    maxTempResources = resetValues.playerReset.maxTempResources // for controlling a rule
    maxNumberOfPlayers = resetValues.numberOfPlayers // for controlling a rule

    // Resource Cards assignment to variables
    // Red Resources Cards
    resetRedCards = resetValues.resourcesCards.redCards
    
    // Green Resources Cards
    resetGreenCards = resetValues.resourcesCards.greenCards
    
    // Yellow Resources Cards
    resetYellowCards = resetValues.resourcesCards.yellowCards
    
    // PurpleResources Cards
    resetPurpleCards = resetValues.resourcesCards.purpleCards
    
    // BlackResources Cards
    resetBlackCards = resetValues.resourcesCards.blackCards
    
    // Contract Cards
    resetContractCards = resetValues.contractCards

    // starting values for the players
    playerStartCash = resetValues.playerReset.cash
    playerStartProduction = resetValues.playerReset.production
    playerTempRed = resetValues.playerReset.temporaryResources.red
    playerTempGreen = resetValues.playerReset.temporaryResources.green
    playerTempYellow = resetValues.playerReset.temporaryResources.yellow
    playerTempPurple = resetValues.playerReset.temporaryResources.purple
    playerTempBlack = resetValues.playerReset.temporaryResources.black
    playerPermRed = resetValues.playerReset.permanentResources.red
    playerPermGreen = resetValues.playerReset.permanentResources.green
    playerPermYellow = resetValues.playerReset.permanentResources.yellow
    playerPermPurple = resetValues.playerReset.permanentResources.purple
    playerPermBlack = resetValues.playerReset.permanentResources.black
    playerStartValue = resetValues.playerReset.value
    playerStartCost = resetValues.playerReset.cost
    playerStartDebtors = resetValues.playerReset.debtors

    
    


    console.log('from create view - reset values (Player start cash): ', playerStartCash)
      })
 

// Shuffle deck of cards function
const shuffle = (array) => {
    var tmp, current, top = array.length;
    if (top) while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }
    return array;
    }



// Function to create room and pass data to Firestore
    const createRoom = async () => {

      // processed variables to push to Firebase
    const gameState = 0;
    const facilitator = ""
    const shuffledContractCards = shuffle(resetContractCards);
    const shuffledGreenCards = shuffle(resetGreenCards);
    const shuffledYellowCards = shuffle(resetYellowCards);
    const shuffledRedCards = shuffle(resetRedCards);
    const shuffledPurpleCards = shuffle(resetPurpleCards);
    const shuffledBlackCards = shuffle(resetBlackCards);
    const makePlayerScore = () => ({
      greenTemp: playerTempGreen,
      redTemp: playerTempRed,
      yellowTemp: playerTempYellow,
      purpleTemp: playerTempPurple,
      blackTemp: playerTempBlack,
      greenPerm: playerPermGreen,
      redPerm: playerPermRed,
      yellowPerm: playerPermYellow,
      purplePerm: playerPermPurple,
      blackPerm: playerPermBlack,
      cash: playerStartCash,
      production: playerStartProduction,
      value: playerStartValue,
      costs: playerStartCost,
      debtors: playerStartDebtors,
      TempTokensTakenCounter: 0,
      greenTokenTaken: false,
      redTokenTaken: false,
      yellowTokenTaken: false,
      purpleTokenTaken: false,
      blackTokenTaken: false
    })

    const playersArray = []
    for (let i = 1; i <= 4; i++) {
      playersArray.push({
        seat: i,
        joined: false,
        name: '',
        online: false,
        uid: '',
        scores: makePlayerScore()
      })
    }

    const currentPlayer = 0;
            
    const roomDetails = {
      creator: user.value.uid,
      name: roomName.value,
      numPlayers: numberPlayers.value,
      timed: gameTimed.value,
      reserve: gameReserve.value,
      rules: gameWinCondition.value,
      maxnumberofplayers: resetValues.numberOfPlayers,
      lastAction: "",
      gstate: gameState,
      modalPoints: false,
      modalContracts: false,
      facilitator: facilitator,
      currentPlayer: currentPlayer,
      z00contractCards: shuffledContractCards,
      z01greenCards: shuffledGreenCards,
      z02yellowCards: shuffledYellowCards,
      z03redCards: shuffledRedCards,
      z04purpleCards: shuffledPurpleCards,
      z05blackCards: shuffledBlackCards,
      z06holderCards: [0, 0, 0],
      z07marketRedTokens: marketTempRed,
      z08marketGreenTokens: marketTempGreen,
      z09marketYellowTokens: marketTempYellow,
      z10marketPurpleTokens: marketTempPurple,
      z11marketBlackTokens: marketTempBlack,
      players: playersArray,
      schemaVersion: 2
    }

            await addDoc(roomDetails)
                  if(!error.value) {
                    
                    router.push ({ name: 'Player'})
                    console.log('Room created');
                    M.toast({html: 'Room has been created'})
              }

            console.log(roomDetails)           
    }

   

// Check: is the following variable needed? check its use.
    const haveRooms = null;

    

    return { createRoom, haveRooms, user, roomName, numberPlayers, gameTimed, gameReserve, gameWinCondition }
  },
  mounted() {
        M.AutoInit()
    }
}

</script>
