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


        <div class="upComingCards">
          <h5><i class="material-icons right">send</i>Upcoming cards</h5>
          
          <div class="resource_card greenResource" v-for="greenCard in gameData.z01greenCards.slice(2,3)" :key="gameData.z01greenCards.index" >
              <div class="card_details greyOut">
                <div class="productsValue">{{ greenCard.Production }}</div>
                <div class="redCost">{{ greenCard.CostRed }}</div>
                <div class="greenCost">{{ greenCard.CostGreen }}</div>
                <div class="yellowCost">{{ greenCard.CostYellow }}</div>
                <div class="purpleCost">{{ greenCard.CostPurple }}</div>
                <div class="blackCost">{{ greenCard.CostBlack }}</div>
              </div>
          </div>


        <div class="resource_card yellowResource" v-for="yellowCard in gameData.z02yellowCards.slice(2,3)" :key="gameData.z02yellowCards.index" >
              <div class="card_details greyOut">
                <div class="productsValue">{{ yellowCard.Production }}</div>
                <div class="redCost">{{ yellowCard.CostRed }}</div>
                <div class="greenCost">{{ yellowCard.CostGreen }}</div>
                <div class="yellowCost">{{ yellowCard.CostYellow }}</div>
                <div class="purpleCost">{{ yellowCard.CostPurple }}</div>
                <div class="blackCost">{{ yellowCard.CostBlack }}</div>
              </div>
          </div>

          <div class="resource_card redResource" v-for="redCard in gameData.z03redCards.slice(2,3)" :key="gameData.z03redCards.index" >
              <div class="card_details greyOut">
                <div class="productsValue">{{ redCard.Production }}</div>
                <div class="redCost">{{ redCard.CostRed }}</div>
                <div class="greenCost">{{ redCard.CostGreen }}</div>
                <div class="yellowCost">{{ redCard.CostYellow }}</div>
                <div class="purpleCost">{{ redCard.CostPurple }}</div>
                <div class="blackCost">{{ redCard.CostBlack }}</div>
              </div>
          </div>

          <div class="resource_card purpleResource" v-for="purpleCard in gameData.z04purpleCards.slice(2,3)" :key="gameData.z04purpleCards.index" >
              <div class="card_details greyOut">
                <div class="productsValue">{{ purpleCard.Production }}</div>
                <div class="redCost">{{ purpleCard.CostRed }}</div>
                <div class="greenCost">{{ purpleCard.CostGreen }}</div>
                <div class="yellowCost">{{ purpleCard.CostYellow }}</div>
                <div class="purpleCost">{{ purpleCard.CostPurple }}</div>
                <div class="blackCost">{{ purpleCard.CostBlack }}</div>
              </div>
          </div>

          <div class="resource_card blackResource" v-for="blackCard in gameData.z05blackCards.slice(2,3)" :key="gameData.z05blackCards.index" >
              <div class="card_details greyOut">
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
          <h6 class="center cyan darken-3 white-text">Temporary resources market</h6>
           <table>
              <tbody>
                <tr class="boldTempResources">
                  <td class="center">{{ gameData.z08marketGreenTokens }}</td>
                  <td class="center">{{ gameData.z07marketRedTokens }}</td>
                  <td class="center">{{ gameData.z09marketYellowTokens }}</td>
                  <td class="center">{{ gameData.z10marketPurpleTokens }}</td>
                  <td class="center">{{ gameData.z11marketBlackTokens }}</td>
                </tr>
                <tr>
                  <td class="center"><img src="../assets/img/greenToken.png" class="tempResourceIcon"/> </td>
                  <td class="center"><img src="../assets/img/redToken.png" class="tempResourceIcon" /></td>
                  <td class="center"><img src="../assets/img/yellowToken.png" class="tempResourceIcon"/></td>
                  <td class="center"><img src="../assets/img/purpleToken.png" class="tempResourceIcon" /></td>
                  <td class="center"><img src="../assets/img/blackToken.png" class="tempResourceIcon" /></td>
                </tr>
                
              </tbody>
            </table>
            <div class="center space-allaround">
              <button class="btn waves-effect waves-light cyan darken-3 modal-trigger" href="#modalTempResources">Acquire resources</button>
            </div>
            
        </div>

        <!-- Test area for actions - Area to be removed -->
        <div class="tempActionsTestArea">
          Actions test area: to be removed
          
          <table>
            <tr>
              <td><button class="btn waves-effect waves-light" @click="nextPlayer()">Next player</button></td>
              <td><button class="btn waves-effect waves-light" @click="testFunction()">Test fuction</button></td>
            </tr>
          </table>

          
            
          
          
        </div>

        </div>
        <div class="gameAreaRight">
          <span class="gameScoringHeader">Score Area</span>

          <div class="gameScoring">
            
            <div class="scoreP1 PlayerScoreArea" >
              
              <div class="scorePlayerHeader yellow">
               <p> 
                 <i class="material-icons" v-show="Player1DOM">send</i>
                 <span class="playerName">Player name (P1)</span> 
                 <i class="material-icons right green-text text-darken-3 white" style="padding-left: 5px; padding-right: 5px;">brightness_1</i>
              </p>
              </div>
              
              <div class="scorePlayerTempResources">
                <table>
                  <tr>
                    <td><img src="../assets/img/greenToken.png" class="playerIconsSizing"/> <p>{{ gameData.z12Player1Scores.greenTemp }}</p></td>
                    <td><img src="../assets/img/redToken.png" class="playerIconsSizing"/> <p>{{ gameData.z12Player1Scores.redTemp }}</p></td>
                    <td><img src="../assets/img/yellowToken.png" class="playerIconsSizing"/> <p>{{ gameData.z12Player1Scores.yellowTemp }}</p></td>
                    <td><img src="../assets/img/purpleToken.png" class="playerIconsSizing"/> <p>{{ gameData.z12Player1Scores.purpleTemp }}</p></td>
                    <td><img src="../assets/img/blackToken.png" class="playerIconsSizing"/> <p>{{ gameData.z12Player1Scores.blackTemp }}</p></td>
                  </tr>
                </table>
              </div>

              <div class="scorePlayerPermResources">
               <table>
                  <tr>
                    <td><img src="../assets/img/greenCardicon.png" class="playerIconsSizing"/> <p>{{gameData.z12Player1Scores.greenPerm }}</p></td>
                    <td><img src="../assets/img/redCardicon.png" class="playerIconsSizing"/> <p>{{ gameData.z12Player1Scores.redPerm }}</p></td>
                    <td><img src="../assets/img/yellowCardicon.png" class="playerIconsSizing"/> <p>{{ gameData.z12Player1Scores.yellowPerm }}</p></td>
                    <td><img src="../assets/img/purpleCardicon.png" class="playerIconsSizing"/> <p>{{ gameData.z12Player1Scores.purplePerm }}</p></td>
                    <td><img src="../assets/img/blackCardicon.png" class="playerIconsSizing"/> <p>{{ gameData.z12Player1Scores.blackPerm }}</p></td>
                  </tr>
                </table>
              </div>

              <div class="scoreFinancials row">
                <div class="col s6">
                  <p>Cash: <span class="scoreFinancialsNumbers">{{ gameData.z12Player1Scores.cash }}</span></p>
                  <p>Production: <span class="scoreFinancialsNumbers">{{ gameData.z12Player1Scores.production }}</span></p>
                </div>
                <div class="col s6">
                  <p>Debtors: <span class="scoreFinancialsNumbers">{{ gameData.z12Player1Scores.debtors }}</span></p>
                  <p>Value: <span class="scoreFinancialsNumbers">{{ gameData.z12Player1Scores.value }}</span></p>
                </div>
                
              </div>
              
              
            </div>

            <div class="scoreP2 PlayerScoreArea" v-show="parseInt(gameData.numPlayers) >= 2">
              <div class="scorePlayerHeader green">
               <p> 
                 <i class="material-icons"  v-show="Player2DOM">send</i>
                 <span class="playerName" >Player name (P2)</span> 
                 <i class="material-icons right green-text text-darken-3 white" style="padding-left: 5px; padding-right: 5px;">brightness_1</i>
              </p>
              </div>
              
              <div class="scorePlayerTempResources">
                <table>
                  <tr>
                    <td><img src="../assets/img/greenToken.png" class="playerIconsSizing"/> <p>{{ gameData.z13Player2Scores.greenTemp }}</p></td>
                    <td><img src="../assets/img/redToken.png" class="playerIconsSizing"/> <p>{{ gameData.z13Player2Scores.redTemp }}</p></td>
                    <td><img src="../assets/img/yellowToken.png" class="playerIconsSizing"/> <p>{{ gameData.z13Player2Scores.yellowTemp }}</p></td>
                    <td><img src="../assets/img/purpleToken.png" class="playerIconsSizing"/> <p>{{ gameData.z13Player2Scores.purpleTemp }}</p></td>
                    <td><img src="../assets/img/blackToken.png" class="playerIconsSizing"/> <p>{{ gameData.z13Player2Scores.blackTemp }}</p></td>
                  </tr>
                </table>
              </div>

              <div class="scorePlayerPermResources">
               <table>
                  <tr>
                    <td><img src="../assets/img/greenCardicon.png" class="playerIconsSizing"/> <p>{{gameData.z13Player2Scores.greenPerm }}</p></td>
                    <td><img src="../assets/img/redCardicon.png" class="playerIconsSizing"/> <p>{{ gameData.z13Player2Scores.redPerm }}</p></td>
                    <td><img src="../assets/img/yellowCardicon.png" class="playerIconsSizing"/> <p>{{ gameData.z13Player2Scores.yellowPerm }}</p></td>
                    <td><img src="../assets/img/purpleCardicon.png" class="playerIconsSizing"/> <p>{{ gameData.z13Player2Scores.purplePerm }}</p></td>
                    <td><img src="../assets/img/blackCardicon.png" class="playerIconsSizing"/> <p>{{ gameData.z13Player2Scores.blackPerm }}</p></td>
                  </tr>
                </table>
              </div>

              <div class="scoreFinancials row">
                <div class="col s6">
                  <p>Cash: <span class="scoreFinancialsNumbers">{{ gameData.z13Player2Scores.cash }}</span></p>
                  <p>Production: <span class="scoreFinancialsNumbers">{{ gameData.z13Player2Scores.production }}</span></p>
                </div>
                <div class="col s6">
                  <p>Debtors: <span class="scoreFinancialsNumbers">{{ gameData.z13Player2Scores.debtors }}</span></p>
                  <p>Value: <span class="scoreFinancialsNumbers">{{ gameData.z13Player2Scores.value }}</span></p>
                </div>
                
              </div>
            </div>


            <div class="scoreP3 PlayerScoreArea" v-show="parseInt(gameData.numPlayers) >= 3">
              <div class="scorePlayerHeader blue">
               <p> 
                 <i class="material-icons"   v-show="Player3DOM">send</i>
                 <span class="playerName" >Player name (P3)</span> 
                 <i class="material-icons right green-text text-darken-3 white" style="padding-left: 5px; padding-right: 5px;">brightness_1</i>
              </p>
              </div>
              
              <div class="scorePlayerTempResources">
                <table>
                  <tr>
                    <td><img src="../assets/img/greenToken.png" class="playerIconsSizing"/> <p>{{ gameData.z14Player3Scores.greenTemp }}</p></td>
                    <td><img src="../assets/img/redToken.png" class="playerIconsSizing"/> <p>{{ gameData.z14Player3Scores.redTemp }}</p></td>
                    <td><img src="../assets/img/yellowToken.png" class="playerIconsSizing"/> <p>{{ gameData.z14Player3Scores.yellowTemp }}</p></td>
                    <td><img src="../assets/img/purpleToken.png" class="playerIconsSizing"/> <p>{{ gameData.z14Player3Scores.purpleTemp }}</p></td>
                    <td><img src="../assets/img/blackToken.png" class="playerIconsSizing"/> <p>{{ gameData.z14Player3Scores.blackTemp }}</p></td>
                  </tr>
                </table>
              </div>

              <div class="scorePlayerPermResources">
               <table>
                  <tr>
                    <td><img src="../assets/img/greenCardicon.png" class="playerIconsSizing"/> <p>{{gameData.z14Player3Scores.greenPerm }}</p></td>
                    <td><img src="../assets/img/redCardicon.png" class="playerIconsSizing"/> <p>{{ gameData.z14Player3Scores.redPerm }}</p></td>
                    <td><img src="../assets/img/yellowCardicon.png" class="playerIconsSizing"/> <p>{{ gameData.z14Player3Scores.yellowPerm }}</p></td>
                    <td><img src="../assets/img/purpleCardicon.png" class="playerIconsSizing"/> <p>{{ gameData.z14Player3Scores.purplePerm }}</p></td>
                    <td><img src="../assets/img/blackCardicon.png" class="playerIconsSizing"/> <p>{{ gameData.z14Player3Scores.blackPerm }}</p></td>
                  </tr>
                </table>
              </div>

              <div class="scoreFinancials row">
               <div class="col s6">
                  <p>Cash: <span class="scoreFinancialsNumbers">{{ gameData.z14Player3Scores.cash }}</span></p>
                  <p>Production: <span class="scoreFinancialsNumbers">{{ gameData.z14Player3Scores.production }}</span></p>
                </div>
                <div class="col s6">
                  <p>Debtors: <span class="scoreFinancialsNumbers">{{ gameData.z14Player3Scores.debtors }}</span></p>
                  <p>Value: <span class="scoreFinancialsNumbers">{{ gameData.z14Player3Scores.value }}</span></p>
                </div>
                
              </div>
            </div>


            <div class="scoreP4 PlayerScoreArea" v-show="parseInt(gameData.numPlayers) >= 4">
              <div class="scorePlayerHeader orange">
               <p> 
                 <i class="material-icons"   v-show="Player4DOM">send</i>
                 <span class="playerName" >Player name (P4)</span> 
                 <i class="material-icons right green-text text-darken-3 white" style="padding-left: 5px; padding-right: 5px;">brightness_1</i>
              </p>
              </div>
              
              <div class="scorePlayerTempResources">
                <table>
                  <tr>
                    <td><img src="../assets/img/greenToken.png" class="playerIconsSizing"/> <p>{{ gameData.z15Player4Scores.greenTemp }}</p></td>
                    <td><img src="../assets/img/redToken.png" class="playerIconsSizing"/> <p>{{ gameData.z15Player4Scores.redTemp }}</p></td>
                    <td><img src="../assets/img/yellowToken.png" class="playerIconsSizing"/> <p>{{ gameData.z15Player4Scores.yellowTemp }}</p></td>
                    <td><img src="../assets/img/purpleToken.png" class="playerIconsSizing"/> <p>{{ gameData.z15Player4Scores.purpleTemp }}</p></td>
                    <td><img src="../assets/img/blackToken.png" class="playerIconsSizing"/> <p>{{ gameData.z15Player4Scores.blackTemp }}</p></td>
                  </tr>
                </table>
              </div>

              <div class="scorePlayerPermResources">
               <table>
                  <tr>
                    <td><img src="../assets/img/greenCardicon.png" class="playerIconsSizing"/> <p>{{gameData.z15Player4Scores.greenPerm }}</p></td>
                    <td><img src="../assets/img/redCardicon.png" class="playerIconsSizing"/> <p>{{ gameData.z15Player4Scores.redPerm }}</p></td>
                    <td><img src="../assets/img/yellowCardicon.png" class="playerIconsSizing"/> <p>{{ gameData.z15Player4Scores.yellowPerm }}</p></td>
                    <td><img src="../assets/img/purpleCardicon.png" class="playerIconsSizing"/> <p>{{ gameData.z15Player4Scores.purplePerm }}</p></td>
                    <td><img src="../assets/img/blackCardicon.png" class="playerIconsSizing"/> <p>{{ gameData.z15Player4Scores.blackPerm }}</p></td>
                  </tr>
                </table>
              </div>

              <div class="scoreFinancials row">
                 <div class="col s6">
                  <p>Cash: <span class="scoreFinancialsNumbers">{{ gameData.z15Player4Scores.cash }}</span></p>
                  <p>Production: <span class="scoreFinancialsNumbers">{{ gameData.z15Player4Scores.production }}</span></p>
                </div>
                <div class="col s6">
                  <p>Debtors: <span class="scoreFinancialsNumbers">{{ gameData.z15Player4Scores.debtors }}</span></p>
                  <p>Value: <span class="scoreFinancialsNumbers">{{ gameData.z15Player4Scores.value }}</span></p>
                </div>
                
              </div>
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
      <h4 class="center">Contract Card</h4>

      <div class="row">
        <div class="col s5 center">
            <div class="contract_card">
                <div class="contract_details_modal">
                    <div v-for="(value, index) in contractCardID" :key="index" :class="index">
                    {{ value }}
                    </div>
                </div>   
            </div>

            <hr>
            <div v-show="contractAfford">
              <button class="btn waves-effect waves-light green darken-3" @click="BuyContract()">Complete the contract
                <i class="material-icons right">send</i>
              </button>
            </div>
            <div v-show="!contractAfford">
              <button class="btn waves-effect waves-light red darken-3 disabled">You can't afford
                <i class="material-icons right">send</i>
              </button>
            </div>


        </div>

        <div class="col s7">
          <div>
            <ul class="center">
              <li>A Contract card can only be fulfilled if you have permanent resources (cards) not temporary resources (tokens).</li>
              <br>
              <li>The resource cards must produce at least the required Production.</li>
            </ul>
            
          </div>
        </div>
      </div>
      
      <hr>
      
    </div>
    <div class="modal-footer">
      <a  class="modal-close waves-effect waves-green btn-flat">Close</a>
    </div>
  </div>


<!-- Modal: Permanent Resources -->
  <div id="modalResource" class="modal">
    <div class="modal-content">
      <h4 class="center">Permanent Resource Card</h4>

      <div class="row">
        <div class="col s4 center">
            <div class="resource_card" :class="resourceCardBackground">
                <div class="card_details_modal">
                    <div v-for="(value, index) in resourceCardID" :key="index" :class="index">
                    {{ value }}
                   </div>
                    
                </div>   
            </div>

            <hr>
            <div v-show="resourceAfford" class="center">
                      <button class="btn waves-effect waves-light green darken-3" @click="BuyPermResource()">Buy the card
                       <i class="material-icons right">send</i>
                       </button>
            </div>
            <div v-show="!resourceAfford" class="center">
              <button class="btn waves-effect waves-light red darken-3 disabled">You can't afford
                <i class="material-icons right">send</i>
              </button>
            </div>

        </div>

        <div class="col s8">
          <div>
            <ul class="center">
              <li>A permanent resource card may be bought with a combination of other permanent resources (cards) or temporary resources (tokens).</li>
              <br>
              <li>The number on the top left of the card shows its value of Production.</li>
            </ul>
            
          </div>
        </div>
      </div>
      
      <hr>
      
    </div>
    <div class="modal-footer">
      <a  class="modal-close waves-effect waves-green btn-flat">Close</a>
    </div>
  </div>

  <!-- Modal: TempResources -->
  <div id="modalTempResources" class="modal">
    <div class="modal-content">
      <h4 class="center">Acquire temporary resources</h4>

      <div class="row">
        <div class="col s8">
            <table>
              <tbody>
                <tr class="boldTempResources">
                  <td class="center">{{ gameData.z08marketGreenTokens }}</td>
                  <td class="center">{{ gameData.z07marketRedTokens }}</td>
                  <td class="center">{{ gameData.z09marketYellowTokens }}</td>
                  <td class="center">{{ gameData.z10marketPurpleTokens }}</td>
                  <td class="center">{{ gameData.z11marketBlackTokens }}</td>
                </tr>
                <tr>
                  <td class="center"><img src="../assets/img/greenToken.png" class="tempResourceIcon"/> </td>
                  <td class="center"><img src="../assets/img/redToken.png" class="tempResourceIcon" /></td>
                  <td class="center"><img src="../assets/img/yellowToken.png" class="tempResourceIcon"/></td>
                  <td class="center"><img src="../assets/img/purpleToken.png" class="tempResourceIcon" /></td>
                  <td class="center"><img src="../assets/img/blackToken.png" class="tempResourceIcon" /></td>
                </tr>

                <tr>
                  <td class="center"><button class="btn-small waves-effect waves-light tempResourceActionBtn" @click="getTwoTokens('green')">Get 2</button></td>
                  <td class="center"><button class="btn-small waves-effect waves-light tempResourceActionBtn" @click="getTwoTokens('red')">Get 2</button></td>
                  <td class="center"><button class="btn-small waves-effect waves-light tempResourceActionBtn" @click="getTwoTokens('yellow')">Get 2</button></td>
                  <td class="center"><button class="btn-small waves-effect waves-light tempResourceActionBtn" @click="getTwoTokens('purple')">Get 2</button></td>
                  <td class="center"><button class="btn-small waves-effect waves-light tempResourceActionBtn" @click="getTwoTokens('black')">Get 2</button></td>
                </tr>

                <tr>
                  <td class="center"><button class="btn-small waves-effect waves-light cyan darken-2 tempResourceActionBtn" @click="getOneToken('green')">Get 1</button></td>
                  <td class="center"><button class="btn-small waves-effect waves-light cyan darken-2 tempResourceActionBtn" @click="getOneToken('red')">Get 1</button></td>
                  <td class="center"><button class="btn-small waves-effect waves-light cyan darken-2 tempResourceActionBtn" @click="getOneToken('yellow')">Get 1</button></td>
                  <td class="center"><button class="btn-small waves-effect waves-light cyan darken-2 tempResourceActionBtn" @click="getOneToken('purple')">Get 1</button></td>
                  <td class="center"><button class="btn-small waves-effect waves-light cyan darken-2 tempResourceActionBtn" @click="getOneToken('black')">Get 1</button></td>
                </tr>
                
                <tr>
                  <td colspan="5"><p class="green-text center">Make your selection</p></td>
                </tr>
              </tbody>
            </table>

            <br>
            
            <div class="center">
              <button class="btn waves-effect waves-light green darken-3">Complete your purchase
                <i class="material-icons right">send</i>
              </button>
            </div>
            <br>
            <div class="center">
              <button class="btn waves-effect waves-light red darken-3">Restart choice
                <i class="material-icons right">send</i>
              </button>
            </div>

        </div>

        <div class="col s4">
          <div>
            <ul class="center">
              <li>You can acquire 2 tokens of the same colour (If there are at least 4 available)</li>
              <br>
              <li>OR</li>
              <br>
              <li>You can aquire 3 different colour tokens (1 each)</li>
            </ul>
            
          </div>
        </div>
      </div>
      
      
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
import M from 'materialize-css'


export default {
  components: { NavbarInRoom },
  props: ['id'],
  setup(props) {

    onMounted(() => {
      M.AutoInit()
       
    })

var ResourcesModal = document.querySelector("#modalTempResources")
//var instance = M.Modal.getInstance(ResourcesModal);



    const { user } = getUser() 
    let gameData = ref(null)

    // Connection to the game       
const dbConnectionGame = projectFirestore.collection('rooms').doc(props.id)
    
    // variable to hold the contracts value to check
    const contracts = "contracts"

    
  // Variables to hold all player variables and labels for the whole game
// generic to use in code and adjust with switch
/* labels */
const LabelplayerBlackPerm = ref()
const LabelplayerBlackTemp = ref()
const LabelplayerGreenPerm = ref()
const LabelplayerGreenTemp = ref()
const LabelplayerYellowPerm = ref()
const LabelplayerYellowTemp = ref()
const LabelplayerPurplePerm = ref()
const LabelplayerPurpleTemp = ref()
const LabelplayerRedPerm = ref()
const LabelplayerRedTemp = ref()
const LabelplayerCash = ref()
const LabelplayerCosts = ref()
const LabelplayerDebtors = ref()
const LabelplayerProduction = ref()
const LabelplayerValue = ref()

/* values */
const ValueplayerBlackPerm = ref()
const ValueplayerBlackTemp = ref()
const ValueplayerGreenPerm = ref()
const ValueplayerGreenTemp = ref()
const ValueplayerYellowPerm = ref()
const ValueplayerYellowTemp = ref()
const ValueplayerPurplePerm = ref()
const ValueplayerPurpleTemp = ref()
const ValueplayerRedPerm = ref()
const ValueplayerRedTemp = ref()
const ValueplayerCash = ref()
const ValueplayerCosts = ref()
const ValueplayerDebtors = ref()
const ValueplayerProduction = ref()
const ValueplayerValue = ref()


  
  



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
        
        // set current player  
        currentPlayer.value = gameData.value.currentPlayer

        switch (currentPlayer.value) {
            case 0:
              // DOM ELEMENTS
              Player1DOM.value = true
              Player2DOM.value = false
              Player3DOM.value = false
              Player4DOM.value = false
              // BACKEND ELEMENTS
                /* Labels */
                LabelplayerBlackPerm.value = "z12Player1Scores.blackPerm"
                LabelplayerBlackTemp.value = "z12Player1Scores.blackTemp"
                LabelplayerGreenPerm.value = "z12Player1Scores.greenPerm"
                LabelplayerGreenTemp.value = "z12Player1Scores.greenTemp"
                LabelplayerYellowPerm.value = "z12Player1Scores.yellowPerm"
                LabelplayerYellowTemp.value = "z12Player1Scores.yellowTemp"
                LabelplayerPurplePerm.value = "z12Player1Scores.purplePerm"
                LabelplayerPurpleTemp.value = "z12Player1Scores.purpleTemp"
                LabelplayerRedPerm.value = "z12Player1Scores.redPerm"
                LabelplayerRedTemp.value = "z12Player1Scores.redTemp"
                LabelplayerCash.value = "z12Player1Scores.cash"
                LabelplayerCosts.value = "z12Player1Scores.costs"
                LabelplayerDebtors.value = "z12Player1Scores.debtors"
                LabelplayerProduction.value = "z12Player1Scores.production"
                LabelplayerValue.value = "z12Player1Scores.value"
                /* Values */
                ValueplayerBlackPerm.value = gameData.value.z12Player1Scores.blackPerm
                ValueplayerBlackTemp.value = gameData.value.z12Player1Scores.blackTemp
                ValueplayerGreenPerm.value = gameData.value.z12Player1Scores.greenPerm
                ValueplayerGreenTemp.value = gameData.value.z12Player1Scores.greenTemp
                ValueplayerYellowPerm.value = gameData.value.z12Player1Scores.yellowPerm
                ValueplayerYellowTemp.value = gameData.value.z12Player1Scores.yellowTemp
                ValueplayerPurplePerm.value = gameData.value.z12Player1Scores.purplePerm
                ValueplayerPurpleTemp.value = gameData.value.z12Player1Scores.purpleTemp
                ValueplayerRedPerm.value = gameData.value.z12Player1Scores.redPerm
                ValueplayerRedTemp.value = gameData.value.z12Player1Scores.redTemp
                ValueplayerCash.value = gameData.value.z12Player1Scores.cash
                ValueplayerCosts.value = gameData.value.z12Player1Scores.costs
                ValueplayerDebtors.value = gameData.value.z12Player1Scores.debtors
                ValueplayerProduction.value = gameData.value.z12Player1Scores.production
                ValueplayerValue.value = gameData.value.z12Player1Scores.value
              break
            case 1:
              Player1DOM.value = false
              Player2DOM.value = true
              Player3DOM.value = false
              Player4DOM.value = false
              // BACKEND ELEMENTS
                /* Labels */
                LabelplayerBlackPerm.value = "z13Player2Scores.blackPerm"
                LabelplayerBlackTemp.value = "z13Player2Scores.blackTemp"
                LabelplayerGreenPerm.value = "z13Player2Scores.greenPerm"
                LabelplayerGreenTemp.value = "z13Player2Scores.greenTemp"
                LabelplayerYellowPerm.value = "z13Player2Scores.yellowPerm"
                LabelplayerYellowTemp.value = "z13Player2Scores.yellowTemp"
                LabelplayerPurplePerm.value = "z13Player2Scores.purplePerm"
                LabelplayerPurpleTemp.value = "z13Player2Scores.purpleTemp"
                LabelplayerRedPerm.value = "z13Player2Scores.redPerm"
                LabelplayerRedTemp.value = "z13Player2Scores.redTemp"
                LabelplayerCash.value = "z13Player2Scores.cash"
                LabelplayerCosts.value = "z13Player2Scores.costs"
                LabelplayerDebtors.value = "z13Player2Scores.debtors"
                LabelplayerProduction.value = "z13Player2Scores.production"
                LabelplayerValue.value = "z13Player2Scores.value"
                /* Values */
                ValueplayerBlackPerm.value = gameData.value.z13Player2Scores.blackPerm
                ValueplayerBlackTemp.value = gameData.value.z13Player2Scores.blackTemp
                ValueplayerGreenPerm.value = gameData.value.z13Player2Scores.greenPerm
                ValueplayerGreenTemp.value = gameData.value.z13Player2Scores.greenTemp
                ValueplayerYellowPerm.value = gameData.value.z13Player2Scores.yellowPerm
                ValueplayerYellowTemp.value = gameData.value.z13Player2Scores.yellowTemp
                ValueplayerPurplePerm.value = gameData.value.z13Player2Scores.purplePerm
                ValueplayerPurpleTemp.value = gameData.value.z13Player2Scores.purpleTemp
                ValueplayerRedPerm.value = gameData.value.z13Player2Scores.redPerm
                ValueplayerRedTemp.value = gameData.value.z13Player2Scores.redTemp
                ValueplayerCash.value = gameData.value.z13Player2Scores.cash
                ValueplayerCosts.value = gameData.value.z13Player2Scores.costs
                ValueplayerDebtors.value = gameData.value.z13Player2Scores.debtors
                ValueplayerProduction.value = gameData.value.z13Player2Scores.production
                ValueplayerValue.value = gameData.value.z13Player2Scores.value
              break
            case 2:
              Player1DOM.value = false
              Player2DOM.value = false
              Player3DOM.value = true
              Player4DOM.value = false
              // BACKEND ELEMENTS
                /* Labels */
                LabelplayerBlackPerm.value = "z14Player3Scores.blackPerm"
                LabelplayerBlackTemp.value = "z14Player3Scores.blackTemp"
                LabelplayerGreenPerm.value = "z14Player3Scores.greenPerm"
                LabelplayerGreenTemp.value = "z14Player3Scores.greenTemp"
                LabelplayerYellowPerm.value = "z14Player3Scores.yellowPerm"
                LabelplayerYellowTemp.value = "z14Player3Scores.yellowTemp"
                LabelplayerPurplePerm.value = "z14Player3Scores.purplePerm"
                LabelplayerPurpleTemp.value = "z14Player3Scores.purpleTemp"
                LabelplayerRedPerm.value = "z14Player3Scores.redPerm"
                LabelplayerRedTemp.value = "z14Player3Scores.redTemp"
                LabelplayerCash.value = "z14Player3Scores.cash"
                LabelplayerCosts.value = "z14Player3Scores.costs"
                LabelplayerDebtors.value = "z14Player3Scores.debtors"
                LabelplayerProduction.value = "z14Player3Scores.production"
                LabelplayerValue.value = "z14Player3Scores.value"
                /* Values */
                ValueplayerBlackPerm.value = gameData.value.z14Player3Scores.blackPerm
                ValueplayerBlackTemp.value = gameData.value.z14Player3Scores.blackTemp
                ValueplayerGreenPerm.value = gameData.value.z14Player3Scores.greenPerm
                ValueplayerGreenTemp.value = gameData.value.z14Player3Scores.greenTemp
                ValueplayerYellowPerm.value = gameData.value.z14Player3Scores.yellowPerm
                ValueplayerYellowTemp.value = gameData.value.z14Player3Scores.yellowTemp
                ValueplayerPurplePerm.value = gameData.value.z14Player3Scores.purplePerm
                ValueplayerPurpleTemp.value = gameData.value.z14Player3Scores.purpleTemp
                ValueplayerRedPerm.value = gameData.value.z14Player3Scores.redPerm
                ValueplayerRedTemp.value = gameData.value.z14Player3Scores.redTemp
                ValueplayerCash.value = gameData.value.z14Player3Scores.cash
                ValueplayerCosts.value = gameData.value.z14Player3Scores.costs
                ValueplayerDebtors.value = gameData.value.z14Player3Scores.debtors
                ValueplayerProduction.value = gameData.value.z14Player3Scores.production
                ValueplayerValue.value = gameData.value.z14Player3Scores.value
              break
            case 3:
              Player1DOM.value = false
              Player2DOM.value = false
              Player3DOM.value = false
              Player4DOM.value = true
              // BACKEND ELEMENTS
                /* Labels */
                LabelplayerBlackPerm.value = "z15Player4Scores.blackPerm"
                LabelplayerBlackTemp.value = "z15Player4Scores.blackTemp"
                LabelplayerGreenPerm.value = "z15Player4Scores.greenPerm"
                LabelplayerGreenTemp.value = "z15Player4Scores.greenTemp"
                LabelplayerYellowPerm.value = "z15Player4Scores.yellowPerm"
                LabelplayerYellowTemp.value = "z15Player4Scores.yellowTemp"
                LabelplayerPurplePerm.value = "z15Player4Scores.purplePerm"
                LabelplayerPurpleTemp.value = "z15Player4Scores.purpleTemp"
                LabelplayerRedPerm.value = "z15Player4Scores.redPerm"
                LabelplayerRedTemp.value = "z15Player4Scores.redTemp"
                LabelplayerCash.value = "z15Player4Scores.cash"
                LabelplayerCosts.value = "z15Player4Scores.costs"
                LabelplayerDebtors.value = "z15Player4Scores.debtors"
                LabelplayerProduction.value = "z15Player4Scores.production"
                LabelplayerValue.value = "z15Player4Scores.value"
                /* Values */
                ValueplayerBlackPerm.value = gameData.value.z15Player4Scores.blackPerm
                ValueplayerBlackTemp.value = gameData.value.z15Player4Scores.blackTemp
                ValueplayerGreenPerm.value = gameData.value.z15Player4Scores.greenPerm
                ValueplayerGreenTemp.value = gameData.value.z15Player4Scores.greenTemp
                ValueplayerYellowPerm.value = gameData.value.z15Player4Scores.yellowPerm
                ValueplayerYellowTemp.value = gameData.value.z15Player4Scores.yellowTemp
                ValueplayerPurplePerm.value = gameData.value.z15Player4Scores.purplePerm
                ValueplayerPurpleTemp.value = gameData.value.z15Player4Scores.purpleTemp
                ValueplayerRedPerm.value = gameData.value.z15Player4Scores.redPerm
                ValueplayerRedTemp.value = gameData.value.z15Player4Scores.redTemp
                ValueplayerCash.value = gameData.value.z15Player4Scores.cash
                ValueplayerCosts.value = gameData.value.z15Player4Scores.costs
                ValueplayerDebtors.value = gameData.value.z15Player4Scores.debtors
                ValueplayerProduction.value = gameData.value.z15Player4Scores.production
                ValueplayerValue.value = gameData.value.z15Player4Scores.value
              
          }
         

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
const lastClickedResourceCard = ref()
const lastClickedResourceCardsArray = ref()
const lastClickedContractCard = ref()
const lastClickedContractCardsArray = ref()
const AdjustedlastClickedContractCardsArray = ref()
const resourceCardBackground = ref()
const Player1DOM = ref(false)
const Player2DOM = ref(false)
const Player3DOM = ref(false)
const Player4DOM = ref(false)

const currentPlayer = ref()


/// PLAYER ACTIONS SCRIPTS

/*--- Rules constants used in calculations --*/
const minTokensToTakeTwo = ref(4)

/* ---- Get TWO tokens ---- */
const getTwoTokens = (colour) => {
  if (colour === "green" && gameData.value.z08marketGreenTokens >= 4) {
            if(ValueplayerCash.value >= 2) {
              dbConnectionGame.update({
                z08marketGreenTokens:  gameData.value.z08marketGreenTokens - 2,
                [LabelplayerGreenTemp.value]: ValueplayerGreenTemp.value + 2,
                [LabelplayerCash.value]: ValueplayerCash.value - 2 
              })
              
              M.toast({html: `2 Green tokens bought by Player ${currentPlayer.value+1}`})
              nextPlayer()  
            }
            else {
              M.toast({html: 'You don\'t have enough cash'})
            }
            console.log('get two '+ colour + " tokens --- script triggered")
        } 
  else if (colour === "red" && gameData.value.z07marketRedTokens >= minTokensToTakeTwo.value) {
            if(ValueplayerCash.value >= 2) {
              dbConnectionGame.update({
                z07marketRedTokens:  gameData.value.z07marketRedTokens - 2,
                [LabelplayerRedTemp.value]: ValueplayerRedTemp.value + 2,
                [LabelplayerCash.value]: ValueplayerCash.value - 2 
              })
              
              M.toast({html: `2 ${colour} tokens bought by Player ${currentPlayer.value+1}`})
              nextPlayer()  
            }
            else {
              M.toast({html: 'You don\'t have enough cash'})
            }
            console.log('get two '+ colour + " tokens --- script triggered")
        } 
  else if (colour === "yellow" && gameData.value.z09marketYellowTokens >= 4) {
            if(ValueplayerCash.value >= 2) {
              dbConnectionGame.update({
                z09marketYellowTokens:  gameData.value.z09marketYellowTokens - 2,
                [LabelplayerYellowTemp.value]: ValueplayerYellowTemp.value + 2,
                [LabelplayerCash.value]: ValueplayerCash.value - 2 
              })
              
              M.toast({html: `2 ${colour} tokens bought by Player ${currentPlayer.value+1}`})
              nextPlayer()  
            }
            else {
              M.toast({html: 'You don\'t have enough cash'})
            }
            console.log('get two '+ colour + " tokens --- script triggered")
        } 
  else if (colour === "purple" && gameData.value.z10marketPurpleTokens >= 4) {
            if(ValueplayerCash.value >= 2) {
              dbConnectionGame.update({
                z10marketPurpleTokens:  gameData.value.z10marketPurpleTokens - 2,
                [LabelplayerPurpleTemp.value]: ValueplayerPurpleTemp.value + 2,
                [LabelplayerCash.value]: ValueplayerCash.value - 2 
              })
              
              M.toast({html: `2 ${colour} tokens bought by Player ${currentPlayer.value+1}`})
              nextPlayer()  
            }
            else {
              M.toast({html: 'You don\'t have enough cash'})
            }
            console.log('get two '+ colour + " tokens --- script triggered")
        }
  else if (colour === "black" && gameData.value.z11marketBlackTokens >= 4) {
            if(ValueplayerCash.value >= 2) {
              dbConnectionGame.update({
                z11marketBlackTokens:  gameData.value.z11marketBlackTokens - 2,
                [LabelplayerBlackTemp.value]: ValueplayerBlackTemp.value + 2,
                [LabelplayerCash.value]: ValueplayerCash.value - 2 
              })
              
              M.toast({html: `2 ${colour} tokens bought by Player ${currentPlayer.value+1}`})
              nextPlayer()  
            }
            else {
              M.toast({html: 'You don\'t have enough cash'})
            }
            console.log('get two '+ colour + " tokens --- script triggered")
        }
}

/* --- Get ONE token --- */
const getOneToken = (colour) => {
  if (colour === "green" && gameData.value.z08marketGreenTokens >= 1) {
            if(ValueplayerCash.value >= 1) {
              dbConnectionGame.update({
                z08marketGreenTokens:  gameData.value.z08marketGreenTokens - 1,
                [LabelplayerGreenTemp.value]: ValueplayerGreenTemp.value + 1,
                [LabelplayerCash.value]: ValueplayerCash.value - 1 
              })
              
              M.toast({html: `1 ${colour}  token bought by Player ${currentPlayer.value+1}`})
              nextPlayer()  
            }
            else {
              M.toast({html: 'You don\'t have enough cash'})
            }
            console.log('get two '+ colour + " tokens --- script triggered")
        } 
  else if (colour === "red" && gameData.value.z07marketRedTokens >= 1) {
            if(ValueplayerCash.value >= 1) {
              dbConnectionGame.update({
                z07marketRedTokens:  gameData.value.z07marketRedTokens - 1,
                [LabelplayerRedTemp.value]: ValueplayerRedTemp.value + 1,
                [LabelplayerCash.value]: ValueplayerCash.value - 1 
              })
              
              M.toast({html: `1 ${colour} token bought by Player ${currentPlayer.value+1}`})
              nextPlayer()  
            }
            else {
              M.toast({html: 'You don\'t have enough cash'})
            }
            console.log('get two '+ colour + " tokens --- script triggered")
        } 
  else if (colour === "yellow" && gameData.value.z09marketYellowTokens >= 1) {
            if(ValueplayerCash.value >= 1) {
              dbConnectionGame.update({
                z09marketYellowTokens:  gameData.value.z09marketYellowTokens - 1,
                [LabelplayerYellowTemp.value]: ValueplayerYellowTemp.value + 1,
                [LabelplayerCash.value]: ValueplayerCash.value - 1 
              })
              
              M.toast({html: `1 ${colour} token bought by Player ${currentPlayer.value+1}`})
              nextPlayer()  
            }
            else {
              M.toast({html: 'You don\'t have enough cash'})
            }
            console.log('get two '+ colour + " tokens --- script triggered")
        } 
  else if (colour === "purple" && gameData.value.z10marketPurpleTokens >= 1) {
            if(ValueplayerCash.value >= 1) {
              dbConnectionGame.update({
                z10marketPurpleTokens:  gameData.value.z10marketPurpleTokens - 1,
                [LabelplayerPurpleTemp.value]: ValueplayerPurpleTemp.value + 1,
                [LabelplayerCash.value]: ValueplayerCash.value - 1 
              })
              
              M.toast({html: `1 ${colour} token bought by Player ${currentPlayer.value+1}`})
              nextPlayer()  
            }
            else {
              M.toast({html: 'You don\'t have enough cash'})
            }
            console.log('get two '+ colour + " tokens --- script triggered")
        }
  else if (colour === "black" && gameData.value.z11marketBlackTokens >= 1) {
            if(ValueplayerCash.value >= 1) {
              dbConnectionGame.update({
                z11marketBlackTokens:  gameData.value.z11marketBlackTokens - 1,
                [LabelplayerBlackTemp.value]: ValueplayerBlackTemp.value + 1,
                [LabelplayerCash.value]: ValueplayerCash.value - 1 
              })
              
              M.toast({html: `1 ${colour} token bought by Player ${currentPlayer.value+1}`})
              nextPlayer()  
            }
            else {
              M.toast({html: 'You don\'t have enough cash'})
            }
            console.log('get two '+ colour + " tokens --- script triggered")
        }
}

/* --- Buy Permanent Resource -- */
const BuyPermResource = () => {
  // Get last clicked card Index from the Array
  const index = lastClickedResourceCardsArray.value.findIndex(function(cards, index) {
    return cards.Ref == lastClickedResourceCard.value.Ref 
  })

  // Can the player afford this card
  if(
    lastClickedResourceCard.value.CostGreen <= ValueplayerGreenTemp.value + ValueplayerGreenPerm.value &&
    lastClickedResourceCard.value.CostRed <= ValueplayerRedTemp.value + ValueplayerRedPerm.value &&  
    lastClickedResourceCard.value.CostYellow <= ValueplayerYellowTemp.value + ValueplayerYellowPerm.value &&  
    lastClickedResourceCard.value.CostPurple <= ValueplayerPurpleTemp.value + ValueplayerPurplePerm.value &&
    lastClickedResourceCard.value.CostBlack <= ValueplayerBlackTemp.value + ValueplayerBlackPerm.value
      ) {
        // Player has enough resources

        let greenTokensAdjust = Math.max(0, lastClickedResourceCard.value.CostGreen - ValueplayerGreenPerm.value )
        let redTokensAdjust = Math.max(0, lastClickedResourceCard.value.CostRed - ValueplayerRedPerm.value )
        let yellowTokensAdjust = Math.max(0, lastClickedResourceCard.value.CostYellow - ValueplayerYellowPerm.value )
        let purpleTokensAdjust = Math.max(0, lastClickedResourceCard.value.CostPurple - ValueplayerPurplePerm.value )
        let blackTokensAdjust = Math.max(0, lastClickedResourceCard.value.CostBlack - ValueplayerBlackPerm.value )

        let cashAdjustment = greenTokensAdjust + redTokensAdjust + yellowTokensAdjust + purpleTokensAdjust + blackTokensAdjust

        let permCardColour = lastClickedResourceCard.value.Colour
        let cardProduction = lastClickedResourceCard.value.Production
        const CardLabel = ref()
        const CardValue = ref()
        

        switch (permCardColour) {
          case 'Green':
            CardLabel.value = LabelplayerGreenPerm.value
            CardValue.value = ValueplayerGreenPerm.value
            break
          case 'Red':
            CardLabel.value = LabelplayerRedPerm.value
            CardValue.value = ValueplayerRedPerm.value
            break
          case 'Yellow':
            CardLabel.value = LabelplayerYellowPerm.value
            CardValue.value = ValueplayerYellowPerm.value
            break
          case 'Purple':
            CardLabel.value = LabelplayerPurplePerm.value
            CardValue.value = ValueplayerPurplePerm.value
            break
          case 'Black':
            CardLabel.value = LabelplayerBlackPerm.value
            CardValue.value = ValueplayerBlackPerm.value
            
        }

         /* Update purchagse in Firebase */
        dbConnectionGame.update({
          // Put tokens back into the market
                z08marketGreenTokens: gameData.value.z08marketGreenTokens + greenTokensAdjust,
                z07marketRedTokens:  gameData.value.z07marketRedTokens + redTokensAdjust,
                z09marketYellowTokens:  gameData.value.z09marketYellowTokens + yellowTokensAdjust,
                z10marketPurpleTokens:  gameData.value.z10marketPurpleTokens + purpleTokensAdjust,
                z11marketBlackTokens:  gameData.value.z11marketBlackTokens + blackTokensAdjust,
        // Update player tokens
                [LabelplayerGreenTemp.value]: ValueplayerGreenTemp.value - greenTokensAdjust,
                [LabelplayerRedTemp.value]: ValueplayerRedTemp.value - redTokensAdjust,
                [LabelplayerYellowTemp.value]: ValueplayerYellowTemp.value - yellowTokensAdjust,
                [LabelplayerPurpleTemp.value]: ValueplayerPurpleTemp.value - purpleTokensAdjust,
                [LabelplayerBlackTemp.value]: ValueplayerBlackTemp.value - blackTokensAdjust,
        // Update player cash
                [LabelplayerCash.value]: ValueplayerCash.value + cashAdjustment,
        // Update permanent resources elements
                [CardLabel.value]: CardValue.value + 1,
                [LabelplayerProduction.value]: ValueplayerProduction.value + cardProduction

        // Delete card from array  
                //[CardLabel.value.index]: projectFirestore.FieldValue.delete()
              })
        
      // Work around to delete a card
      const cardsArray = Array(lastClickedResourceCardsArray)
      console.log('Cards array :', cardsArray)


        M.toast({html: `You can afford this card`})
        console.log('Will deduct ', greenTokensAdjust ,' from Green tokens' )
        console.log('Will deduct ', redTokensAdjust ,' from Red tokens' )
        console.log('Will deduct ', yellowTokensAdjust ,' from Yellow tokens' )
        console.log('Will deduct ', purpleTokensAdjust ,' from Purple tokens' )
        console.log('Will deduct ', blackTokensAdjust ,' from Black tokens' )
        
      } 
      else {
        //Player can't afford the card
          M.toast({html: `You do not have enough resources`})
        }

  console.log('Index of clicked card: ', index)
  console.log("Indexed object chosen: ", lastClickedResourceCardsArray.value[index].Ref)
}

/* --- Buy Permanent Resource -- */
const BuyContract = () => {
  // Get last clicked card Index from the Array
  const index = lastClickedContractCardsArray.value.findIndex(function(cards, index) {
    return cards.Ref == lastClickedContractCard.value.Ref 
  })

  // Can the player afford this card
  if(
    lastClickedContractCard.value.CostGreen <= ValueplayerGreenPerm.value &&
    lastClickedContractCard.value.CostRed <= ValueplayerRedPerm.value &&  
    lastClickedContractCard.value.CostYellow <= ValueplayerYellowPerm.value &&  
    lastClickedContractCard.value.CostPurple <= ValueplayerPurplePerm.value &&
    lastClickedContractCard.value.CostBlack <= ValueplayerBlackPerm.value &&
    lastClickedContractCard.value.Production <= ValueplayerProduction.value
      ) {
                
        // Player has enough resources

         /* Update purchagse in Firebase */
        dbConnectionGame.update({         
        // Update player  values
                [LabelplayerValue.value]: ValueplayerValue.value + lastClickedContractCard.value.Value,
                [LabelplayerProduction.value]: ValueplayerProduction.value - lastClickedContractCard.value.Production,
                [LabelplayerCash.value]: ValueplayerCash.value + lastClickedContractCard.value.Cash,
                [LabelplayerDebtors.value]: ValueplayerDebtors.value + lastClickedContractCard.value.Debtors,
                // Adjust player resources
                [LabelplayerGreenPerm.value]: ValueplayerGreenPerm.value - lastClickedContractCard.value.CostGreen,
                [LabelplayerRedPerm.value]: ValueplayerRedPerm.value - lastClickedContractCard.value.CostRed,
                [LabelplayerYellowPerm.value]: ValueplayerYellowPerm.value - lastClickedContractCard.value.CostYellow,
                [LabelplayerPurplePerm.value]: ValueplayerPurplePerm.value - lastClickedContractCard.value.CostPurple,
                [LabelplayerBlackPerm.value]: ValueplayerBlackPerm.value - lastClickedContractCard.value.CostBlack
              })
        
      // Work around to delete a card
      const cardsArray = lastClickedContractCardsArray.value
      cardsArray.splice(index, 1)

      dbConnectionGame.update({ 
        z00contractCards: cardsArray
      })

        M.toast({html: `You fulfilled a Contract`})
             
      } 
      else {
        //Player can't afford the card
          M.toast({html: `You do not have enough resources`})
        }

  console.log('Index of clicked card: ', index)
  console.log("Indexed object chosen: ", lastClickedContractCardsArray.value[index].Ref)
}






  /* Trigger Modals for cards */
      const handleContractCard = (id) => {
        contractCardID.value = id
        contractAfford.value = true
        lastClickedContractCard.value = contractCardID.value
        lastClickedContractCardsArray.value = gameData.value.z00contractCards
        
        console.log('Contract card clicked', contractCardID.value.Ref )    
      }

      const handleResourceCard = (id) => {
        resourceCardID.value = id
        resourceAfford.value = true
        lastClickedResourceCard.value = resourceCardID.value
        
        // find which image must
        switch (resourceCardID.value.Colour) {
            case "Red":
              resourceCardBackground.value = "redResource"
              lastClickedResourceCardsArray.value = gameData.value.z03redCards
              break
            case "Green":
              resourceCardBackground.value = "greenResource"
              lastClickedResourceCardsArray.value = gameData.value.z01greenCards
              break
            case "Purple":
              resourceCardBackground.value = "purpleResource"
              lastClickedResourceCardsArray.value = gameData.value.z04purpleCards
              break
            case "Yellow":
              resourceCardBackground.value = "yellowResource"
              lastClickedResourceCardsArray.value = gameData.value.z02yellowCards
              break
            case "Black":
              resourceCardBackground.value = "blackResource"
              lastClickedResourceCardsArray.value = gameData.value.z05blackCards
              
          }

        console.log('Resource card clicked', resourceCardID.value.Ref )   
        
      }


// Testing scripts
function nextPlayer() {
  // Next player advances
  if(currentPlayer.value < gameData.value.maxnumberofplayers - 1 ) {
    dbConnectionGame.update({
      currentPlayer: currentPlayer.value + 1
    })
  } else {
    dbConnectionGame.update({
    currentPlayer: 0
  })
  }
  // Updated DOM variables to show which player is action in the DOM
   switch (currentPlayer.value) {
            case 0:
              // DOM ELEMENTS
              Player1DOM.value = true
              Player2DOM.value = false
              Player3DOM.value = false
              Player4DOM.value = false
              // BACKEND ELEMENTS
                /* Labels */
                LabelplayerBlackPerm.value = "z12Player1Scores.blackPerm"
                LabelplayerBlackTemp.value = "z12Player1Scores.blackTemp"
                LabelplayerGreenPerm.value = "z12Player1Scores.greenPerm"
                LabelplayerGreenTemp.value = "z12Player1Scores.greenTemp"
                LabelplayerYellowPerm.value = "z12Player1Scores.yellowPerm"
                LabelplayerYellowTemp.value = "z12Player1Scores.yellowTemp"
                LabelplayerPurplePerm.value = "z12Player1Scores.purplePerm"
                LabelplayerPurpleTemp.value = "z12Player1Scores.purpleTemp"
                LabelplayerRedPerm.value = "z12Player1Scores.redPerm"
                LabelplayerRedTemp.value = "z12Player1Scores.redTemp"
                LabelplayerCash.value = "z12Player1Scores.cash"
                LabelplayerCosts.value = "z12Player1Scores.costs"
                LabelplayerDebtors.value = "z12Player1Scores.debtors"
                LabelplayerProduction.value = "z12Player1Scores.production"
                LabelplayerValue.value = "z12Player1Scores.value"
                /* Values */
                ValueplayerBlackPerm.value = gameData.value.z12Player1Scores.blackPerm
                ValueplayerBlackTemp.value = gameData.value.z12Player1Scores.blackTemp
                ValueplayerGreenPerm.value = gameData.value.z12Player1Scores.greenPerm
                ValueplayerGreenTemp.value = gameData.value.z12Player1Scores.greenTemp
                ValueplayerYellowPerm.value = gameData.value.z12Player1Scores.yellowPerm
                ValueplayerYellowTemp.value = gameData.value.z12Player1Scores.yellowTemp
                ValueplayerPurplePerm.value = gameData.value.z12Player1Scores.purplePerm
                ValueplayerPurpleTemp.value = gameData.value.z12Player1Scores.purpleTemp
                ValueplayerRedPerm.value = gameData.value.z12Player1Scores.redPerm
                ValueplayerRedTemp.value = gameData.value.z12Player1Scores.redTemp
                ValueplayerCash.value = gameData.value.z12Player1Scores.cash
                ValueplayerCosts.value = gameData.value.z12Player1Scores.costs
                ValueplayerDebtors.value = gameData.value.z12Player1Scores.debtors
                ValueplayerProduction.value = gameData.value.z12Player1Scores.production
                ValueplayerValue.value = gameData.value.z12Player1Scores.value
              break
            case 1:
              Player1DOM.value = false
              Player2DOM.value = true
              Player3DOM.value = false
              Player4DOM.value = false
              // BACKEND ELEMENTS
                /* Labels */
                LabelplayerBlackPerm.value = "z13Player2Scores.blackPerm"
                LabelplayerBlackTemp.value = "z13Player2Scores.blackTemp"
                LabelplayerGreenPerm.value = "z13Player2Scores.greenPerm"
                LabelplayerGreenTemp.value = "z13Player2Scores.greenTemp"
                LabelplayerYellowPerm.value = "z13Player2Scores.yellowPerm"
                LabelplayerYellowTemp.value = "z13Player2Scores.yellowTemp"
                LabelplayerPurplePerm.value = "z13Player2Scores.purplePerm"
                LabelplayerPurpleTemp.value = "z13Player2Scores.purpleTemp"
                LabelplayerRedPerm.value = "z13Player2Scores.redPerm"
                LabelplayerRedTemp.value = "z13Player2Scores.redTemp"
                LabelplayerCash.value = "z13Player2Scores.cash"
                LabelplayerCosts.value = "z13Player2Scores.costs"
                LabelplayerDebtors.value = "z13Player2Scores.debtors"
                LabelplayerProduction.value = "z13Player2Scores.production"
                LabelplayerValue.value = "z13Player2Scores.value"
                /* Values */
                ValueplayerBlackPerm.value = gameData.value.z13Player2Scores.blackPerm
                ValueplayerBlackTemp.value = gameData.value.z13Player2Scores.blackTemp
                ValueplayerGreenPerm.value = gameData.value.z13Player2Scores.greenPerm
                ValueplayerGreenTemp.value = gameData.value.z13Player2Scores.greenTemp
                ValueplayerYellowPerm.value = gameData.value.z13Player2Scores.yellowPerm
                ValueplayerYellowTemp.value = gameData.value.z13Player2Scores.yellowTemp
                ValueplayerPurplePerm.value = gameData.value.z13Player2Scores.purplePerm
                ValueplayerPurpleTemp.value = gameData.value.z13Player2Scores.purpleTemp
                ValueplayerRedPerm.value = gameData.value.z13Player2Scores.redPerm
                ValueplayerRedTemp.value = gameData.value.z13Player2Scores.redTemp
                ValueplayerCash.value = gameData.value.z13Player2Scores.cash
                ValueplayerCosts.value = gameData.value.z13Player2Scores.costs
                ValueplayerDebtors.value = gameData.value.z13Player2Scores.debtors
                ValueplayerProduction.value = gameData.value.z13Player2Scores.production
                ValueplayerValue.value = gameData.value.z13Player2Scores.value
              break
            case 2:
              Player1DOM.value = false
              Player2DOM.value = false
              Player3DOM.value = true
              Player4DOM.value = false
              // BACKEND ELEMENTS
                /* Labels */
                LabelplayerBlackPerm.value = "z14Player3Scores.blackPerm"
                LabelplayerBlackTemp.value = "z14Player3Scores.blackTemp"
                LabelplayerGreenPerm.value = "z14Player3Scores.greenPerm"
                LabelplayerGreenTemp.value = "z14Player3Scores.greenTemp"
                LabelplayerYellowPerm.value = "z14Player3Scores.yellowPerm"
                LabelplayerYellowTemp.value = "z14Player3Scores.yellowTemp"
                LabelplayerPurplePerm.value = "z14Player3Scores.purplePerm"
                LabelplayerPurpleTemp.value = "z14Player3Scores.purpleTemp"
                LabelplayerRedPerm.value = "z14Player3Scores.redPerm"
                LabelplayerRedTemp.value = "z14Player3Scores.redTemp"
                LabelplayerCash.value = "z14Player3Scores.cash"
                LabelplayerCosts.value = "z14Player3Scores.costs"
                LabelplayerDebtors.value = "z14Player3Scores.debtors"
                LabelplayerProduction.value = "z14Player3Scores.production"
                LabelplayerValue.value = "z14Player3Scores.value"
                /* Values */
                ValueplayerBlackPerm.value = gameData.value.z14Player3Scores.blackPerm
                ValueplayerBlackTemp.value = gameData.value.z14Player3Scores.blackTemp
                ValueplayerGreenPerm.value = gameData.value.z14Player3Scores.greenPerm
                ValueplayerGreenTemp.value = gameData.value.z14Player3Scores.greenTemp
                ValueplayerYellowPerm.value = gameData.value.z14Player3Scores.yellowPerm
                ValueplayerYellowTemp.value = gameData.value.z14Player3Scores.yellowTemp
                ValueplayerPurplePerm.value = gameData.value.z14Player3Scores.purplePerm
                ValueplayerPurpleTemp.value = gameData.value.z14Player3Scores.purpleTemp
                ValueplayerRedPerm.value = gameData.value.z14Player3Scores.redPerm
                ValueplayerRedTemp.value = gameData.value.z14Player3Scores.redTemp
                ValueplayerCash.value = gameData.value.z14Player3Scores.cash
                ValueplayerCosts.value = gameData.value.z14Player3Scores.costs
                ValueplayerDebtors.value = gameData.value.z14Player3Scores.debtors
                ValueplayerProduction.value = gameData.value.z14Player3Scores.production
                ValueplayerValue.value = gameData.value.z14Player3Scores.value
              break
            case 3:
              Player1DOM.value = false
              Player2DOM.value = false
              Player3DOM.value = false
              Player4DOM.value = true
              // BACKEND ELEMENTS
                /* Labels */
                LabelplayerBlackPerm.value = "z15Player4Scores.blackPerm"
                LabelplayerBlackTemp.value = "z15Player4Scores.blackTemp"
                LabelplayerGreenPerm.value = "z15Player4Scores.greenPerm"
                LabelplayerGreenTemp.value = "z15Player4Scores.greenTemp"
                LabelplayerYellowPerm.value = "z15Player4Scores.yellowPerm"
                LabelplayerYellowTemp.value = "z15Player4Scores.yellowTemp"
                LabelplayerPurplePerm.value = "z15Player4Scores.purplePerm"
                LabelplayerPurpleTemp.value = "z15Player4Scores.purpleTemp"
                LabelplayerRedPerm.value = "z15Player4Scores.redPerm"
                LabelplayerRedTemp.value = "z15Player4Scores.redTemp"
                LabelplayerCash.value = "z15Player4Scores.cash"
                LabelplayerCosts.value = "z15Player4Scores.costs"
                LabelplayerDebtors.value = "z15Player4Scores.debtors"
                LabelplayerProduction.value = "z15Player4Scores.production"
                LabelplayerValue.value = "z15Player4Scores.value"
                /* Values */
                ValueplayerBlackPerm.value = gameData.value.z15Player4Scores.blackPerm
                ValueplayerBlackTemp.value = gameData.value.z15Player4Scores.blackTemp
                ValueplayerGreenPerm.value = gameData.value.z15Player4Scores.greenPerm
                ValueplayerGreenTemp.value = gameData.value.z15Player4Scores.greenTemp
                ValueplayerYellowPerm.value = gameData.value.z15Player4Scores.yellowPerm
                ValueplayerYellowTemp.value = gameData.value.z15Player4Scores.yellowTemp
                ValueplayerPurplePerm.value = gameData.value.z15Player4Scores.purplePerm
                ValueplayerPurpleTemp.value = gameData.value.z15Player4Scores.purpleTemp
                ValueplayerRedPerm.value = gameData.value.z15Player4Scores.redPerm
                ValueplayerRedTemp.value = gameData.value.z15Player4Scores.redTemp
                ValueplayerCash.value = gameData.value.z15Player4Scores.cash
                ValueplayerCosts.value = gameData.value.z15Player4Scores.costs
                ValueplayerDebtors.value = gameData.value.z15Player4Scores.debtors
                ValueplayerProduction.value = gameData.value.z15Player4Scores.production
                ValueplayerValue.value = gameData.value.z15Player4Scores.value
              
          }

  // Script end
  console.log('Next player script run')
}

const testFunction = () => {

  console.log('initial Array:')
  console.log(lastClickedContractCardsArray.value)

 AdjustedlastClickedContractCardsArray.value = lastClickedContractCardsArray.value
 

  console.log('Before splicing Array:')
  console.log(AdjustedlastClickedContractCardsArray.value) 

  console.log('splicing')
  AdjustedlastClickedContractCardsArray.value.splice(0,1)

  console.log('Spliced Array:')
  console.log(AdjustedlastClickedContractCardsArray.value) 

}


        return { user, gameData, contracts, handleContractCard, contractCardID,
                  contractAfford, resourceCardID, resourceAfford, handleResourceCard,
                  resourceCardBackground, nextPlayer, Player1DOM, Player2DOM, Player3DOM, Player4DOM,
                  getTwoTokens, getOneToken, BuyPermResource, BuyContract, testFunction
        }
  }
}

</script>
