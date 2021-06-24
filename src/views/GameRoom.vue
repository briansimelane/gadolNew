<template>
  <div class="container-fluid">
    
      <NavbarInRoom />

      <div class="container-fluid">
        <div class="col s12 space-left margin-bottom-small center">
          <h6> Welcome to <span style="font-weight: bold;">{{ gameData.name}}</span> - - - Game Room ID: <span class="red-text grey lighten-3 hoverable">{{id}}</span> <span style="font-style: italic;">(Share this ID with other players for them to join)</span></h6>
        </div>
        

      </div>

      <div class="gameArea">

        <div class="gameNotifications">
            Game notifications
          </div>

        <div class="gameAreaLeft">
        
          <div class="onTableContracts" v-if=" contracts === gameData.rules" >
            
            <div class="contract_card hoverable modal-trigger" href="#modalContract" v-for="contract in gameData.z00contractCards.slice(0,4)" :key="gameData.z00contractCards.index" >
              <div class="contract_details" @click="handleContractCard(contract)">
                <div class="contractValue">{{ contract.Value }}</div>
                <div class="contractCash">{{ contract.Cash }}</div>
                <div class="contractDebtors">{{ contract.Debtors }}</div>
                <div class="redValue">{{ contract.CostRed }}</div>
                <div class="greenValue">{{ contract.CostGreen }}</div>
                <div class="yellowValue">{{ contract.CostYellow }}</div>
                <div class="purpleValue">{{ contract.CostPurple }}</div>
                <div class="blackValue">{{ contract.CostBlack }}</div>
                <div class="productValue">{{ contract.Production }}</div>
              </div>
            </div>
          </div>

        <div class="onTableRow1">
          <div class="resource_card greenResource hoverable  modal-trigger" href="#modalResource" v-for="greenCard in gameData.z01greenCards.slice(0,2)" :key="gameData.z01greenCards.index" >
              <div class="card_details" @click="handleResourceCard(greenCard)">
                <div class="productsValue">{{ greenCard.Production }}</div>
                <div class="redCost">{{ greenCard.CostRed }}</div>
                <div class="greenCost">{{ greenCard.CostGreen }}</div>
                <div class="yellowCost">{{ greenCard.CostYellow }}</div>
                <div class="purpleCost">{{ greenCard.CostPurple }}</div>
                <div class="blackCost">{{ greenCard.CostBlack }}</div>
                
              </div>
          </div>

          <div class="resource_card yellowResource hoverable modal-trigger" href="#modalResource" v-for="yellowCard in gameData.z02yellowCards.slice(0,2)" :key="gameData.z02yellowCards.index" >
              <div class="card_details" @click="handleResourceCard(yellowCard)">
                <div class="productsValue">{{ yellowCard.Production }}</div>
                <div class="redCost">{{ yellowCard.CostRed }}</div>
                <div class="greenCost">{{ yellowCard.CostGreen }}</div>
                <div class="yellowCost">{{ yellowCard.CostYellow }}</div>
                <div class="purpleCost">{{ yellowCard.CostPurple }}</div>
                <div class="blackCost">{{ yellowCard.CostBlack }}</div>
                
              </div>
          </div>

        </div>

        <div class="onTableRow2">
          <div class="resource_card redResource hoverable modal-trigger" href="#modalResource" v-for="redCard in gameData.z03redCards.slice(0,2)" :key="gameData.z03redCards.index" >
              <div class="card_details" @click="handleResourceCard(redCard)">
                <div class="productsValue">{{ redCard.Production }}</div>
                <div class="redCost">{{ redCard.CostRed }}</div>
                <div class="greenCost">{{ redCard.CostGreen }}</div>
                <div class="yellowCost">{{ redCard.CostYellow }}</div>
                <div class="purpleCost">{{ redCard.CostPurple }}</div>
                <div class="blackCost">{{ redCard.CostBlack }}</div>
              </div>
          </div>

          <div class="resource_card purpleResource hoverable modal-trigger" href="#modalResource" v-for="purpleCard in gameData.z04purpleCards.slice(0,2)" :key="gameData.z04purpleCards.index" >
              <div class="card_details" @click="handleResourceCard(purpleCard)">
                <div class="productsValue">{{ purpleCard.Production }}</div>
                <div class="redCost">{{ purpleCard.CostRed }}</div>
                <div class="greenCost">{{ purpleCard.CostGreen }}</div>
                <div class="yellowCost">{{ purpleCard.CostYellow }}</div>
                <div class="purpleCost">{{ purpleCard.CostPurple }}</div>
                <div class="blackCost">{{ purpleCard.CostBlack }}</div>
              </div>
          </div>
        </div>

        <div class="onTableRow3">
          <div class="resource_card blackResource hoverable modal-trigger" href="#modalResource" v-for="blackCard in gameData.z05blackCards.slice(0,2)" :key="gameData.z05blackCards.index" >
              <div class="card_details" @click="handleResourceCard(blackCard)">
                <div class="productsValue">{{ blackCard.Production }}</div>
                <div class="redCost">{{ blackCard.CostRed }}</div>
                <div class="greenCost">{{ blackCard.CostGreen }}</div>
                <div class="yellowCost">{{ blackCard.CostYellow }}</div>
                <div class="purpleCost">{{ blackCard.CostPurple }}</div>
                <div class="blackCost">{{ blackCard.CostBlack }}</div>
              </div>
          </div>

        </div>


<h5>Upcoming cards</h5> 
        <div class="upComingCards">
          
          
          <div class="resource_card greenResource" v-for="greenCard in gameData.z01greenCards.slice(2,3)" :key="gameData.z01greenCards.index" >
              <div class="card_details">
                <div class="productsValue">{{ greenCard.Production }}</div>
                <div class="redCost">{{ greenCard.CostRed }}</div>
                <div class="greenCost">{{ greenCard.CostGreen }}</div>
                <div class="yellowCost">{{ greenCard.CostYellow }}</div>
                <div class="purpleCost">{{ greenCard.CostPurple }}</div>
                <div class="blackCost">{{ greenCard.CostBlack }}</div>
              </div>
          </div>


        <div class="resource_card yellowResource" v-for="yellowCard in gameData.z02yellowCards.slice(2,3)" :key="gameData.z02yellowCards.index" >
              <div class="card_details">
                <div class="productsValue">{{ yellowCard.Production }}</div>
                <div class="redCost">{{ yellowCard.CostRed }}</div>
                <div class="greenCost">{{ yellowCard.CostGreen }}</div>
                <div class="yellowCost">{{ yellowCard.CostYellow }}</div>
                <div class="purpleCost">{{ yellowCard.CostPurple }}</div>
                <div class="blackCost">{{ yellowCard.CostBlack }}</div>
              </div>
          </div>

          <div class="resource_card redResource" v-for="redCard in gameData.z03redCards.slice(2,3)" :key="gameData.z03redCards.index" >
              <div class="card_details">
                <div class="productsValue">{{ redCard.Production }}</div>
                <div class="redCost">{{ redCard.CostRed }}</div>
                <div class="greenCost">{{ redCard.CostGreen }}</div>
                <div class="yellowCost">{{ redCard.CostYellow }}</div>
                <div class="purpleCost">{{ redCard.CostPurple }}</div>
                <div class="blackCost">{{ redCard.CostBlack }}</div>
              </div>
          </div>

          <div class="resource_card purpleResource" v-for="purpleCard in gameData.z04purpleCards.slice(2,3)" :key="gameData.z04purpleCards.index" >
              <div class="card_details">
                <div class="productsValue">{{ purpleCard.Production }}</div>
                <div class="redCost">{{ purpleCard.CostRed }}</div>
                <div class="greenCost">{{ purpleCard.CostGreen }}</div>
                <div class="yellowCost">{{ purpleCard.CostYellow }}</div>
                <div class="purpleCost">{{ purpleCard.CostPurple }}</div>
                <div class="blackCost">{{ purpleCard.CostBlack }}</div>
              </div>
          </div>

          <div class="resource_card blackResource" v-for="blackCard in gameData.z05blackCards.slice(2,3)" :key="gameData.z05blackCards.index" >
              <div class="card_details">
                <div class="productsValue">{{ blackCard.Production }}</div>
                <div class="redCost">{{ blackCard.CostRed }}</div>
                <div class="greenCost">{{ blackCard.CostGreen }}</div>
                <div class="yellowCost">{{ blackCard.CostYellow }}</div>
                <div class="purpleCost">{{ blackCard.CostPurple }}</div>
                <div class="blackCost">{{ blackCard.CostBlack }}</div>
              </div>
          </div>

          
        </div>

        <div class="tempResources">
           <div class="tokens_card">
             <div class="tokens_details">
                <div class="tokensLabel">Temporary Resources</div>
                <div class="redTokens hoverable"></div>
                <div id="redTokensValue">{{ gameData.z07marketRedTokens }}</div>
                <div class="greenTokens hoverable"></div>
                <div id="greenTokensValue">{{ gameData.z08marketGreenTokens }}</div>
                <div class="yellowTokens hoverable"></div>
                <div id="yellowTokensValue">{{ gameData.z09marketYellowTokens }}</div>
                <div class="purpleTokens hoverable"></div>
                <div id="purpleTokensValue">{{ gameData.z10marketPurpleTokens }}</div>
                <div class="blackTokens hoverable"></div>
                <div id="blackTokensValue">{{ gameData.z11marketBlackTokens }}</div>
             </div>
              
           </div>
        </div>

        </div>
        <div class="gameAreaRight">
          <span class="gameScoringHeader">Score Area</span>

          <div class="gameScoring">
            
            <div class="scoreP1" >
              scoreP1
              <p>Cash: {{ gameData.z12playerCash[0] }}</p>
              <p>Production: {{ gameData.z13playerProduction[0] }}</p>
            </div>
            <hr>

            <div class="scoreP2" v-show="parseInt(gameData.numPlayers) >= 2">
              scoreP2
              <p>Cash: {{ gameData.z12playerCash[1] }}</p>
              <p>Production: {{ gameData.z13playerProduction[1] }}</p>
            </div>
            <hr>

            <div class="scoreP3" v-show="parseInt(gameData.numPlayers) >= 3">
              scoreP3
              <p>Cash: {{ gameData.z12playerCash[2] }}</p>
              <p>Production: {{ gameData.z13playerProduction[2] }}</p>
            </div>
            <hr>

            <div class="scoreP4" v-show="parseInt(gameData.numPlayers) >= 4">
              scoreP4 
              <p>Cash: {{ gameData.z12playerCash[3] }}</p>
              <p>Production: {{ gameData.z13playerProduction[3] }}</p>
            </div>
          </div>

          <div class="gameChat">
            gameChat
          </div>
        </div>
      </div>



  <!-- Modal: Contracts -->
  <div id="modalContract" class="modal">
    <div class="modal-content">
      <h4>Contract Card</h4>

      <div class="row">
        <div class="col s4">
            <div class="contract_card">
                <div class="contract_details_modal">
                    <div v-for="(value, index) in contractCardID" :key="index" :class="index">
                    {{ value }}
                    </div>
                </div>   
            </div>
        </div>

        <div class="col s8">
          <div>
            <ul class="center">
              <li>A Contract card can only be fulfilled if you have permanent resources (cards) not temporary resources (tokens).</li>
              <br>
              <li>The resource cards must produce at least the required Production.</li>
            </ul>
            <hr>
            <div v-show="contractAfford">
              <button class="btn waves-effect waves-light green darken-3">Complete the contract
                <i class="material-icons right">send</i>
              </button>
            </div>
            <div v-show="!contractAfford">
              <button class="btn waves-effect waves-light red darken-3 disabled">You need more resources
                <i class="material-icons right">send</i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <hr>
      
    </div>
    <div class="modal-footer">
      <a  class="modal-close waves-effect waves-green btn-flat">Close</a>
    </div>
  </div>


<!-- Modal: Resources -->
  <div id="modalResource" class="modal">
    <div class="modal-content">
      <h4>Permanent Resource Card</h4>

      <div class="row">
        <div class="col s4">
            <div class="resource_card" :class="resourceCardBackground">
                <div class="card_details_modal">
                    <div v-for="(value, index) in resourceCardID" :key="index" :class="index">
                    {{ value }}
                    </div>
                </div>   
            </div>
        </div>

        <div class="col s8">
          <div>
            <ul class="center">
              <li>A permanent resource card may be bought with a combination of other permanent resources (cards) or temporary resources (tokens).</li>
              <br>
              <li>The number on the top left of the card shows its value of Production.</li>
            </ul>
            <hr>
            <div v-show="resourceAfford">
              <button class="btn waves-effect waves-light green darken-3">Buy the card
                <i class="material-icons right">send</i>
              </button>
            </div>
            <div v-show="!resourceAfford">
              <button class="btn waves-effect waves-light red darken-3 disabled">You need more resources
                <i class="material-icons right">send</i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <hr>
      
    </div>
    <div class="modal-footer">
      <a  class="modal-close waves-effect waves-green btn-flat">Close</a>
    </div>
  </div>





  </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import getUser from '../composables/getUser'
import { projectAuth } from '../firebase/config'
import { projectFirestore } from '../firebase/config'
import NavbarInRoom from '../components/NavbarInRoom'
import { computed, onMounted } from 'vue'


export default {
  components: { NavbarInRoom },
  props: ['id'],
  setup(props) {
    const { user } = getUser() 
    let gameData = ref(null)
    
    // variable to hold the contracts value to check
    const contracts = "contracts"

    
    
    onMounted(() => {
      M.AutoInit()
       
    })
      
      


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



// Function to deal with clicking cards
const contractCardID = ref()
const contractAfford = ref()
const resourceCardID = ref()
const resourceAfford = ref()
const resourceCardBackground = ref()



  /* Trigger Modals for cards */
      const handleContractCard = (id) => {
        contractCardID.value = id
        contractAfford.value = false
        console.log('Contract card clicked', contractCardID.value.Ref )    
      }

      const handleResourceCard = (id) => {
        resourceCardID.value = id
        resourceAfford.value = true
        

        // find which image must
        switch (resourceCardID.value.Colour) {
            case "Red":
              resourceCardBackground.value = "redResource"
              break
            case "Green":
              resourceCardBackground.value = "greenResource"
              break
            case "Purple":
              resourceCardBackground.value = "purpleResource"
              break
            case "Yellow":
              resourceCardBackground.value = "yellowResource"
              break
            case "Black":
              resourceCardBackground.value = "blackResource"
              
          }

        console.log('Resource card clicked', resourceCardID.value.Ref )    
      }


        return { user, gameData, contracts, handleContractCard, contractCardID,
                  contractAfford, resourceCardID, resourceAfford, handleResourceCard,
                  resourceCardBackground
        }
  }
}

</script>
