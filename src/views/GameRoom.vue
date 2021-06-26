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
              <button class="btn waves-effect waves-light green darken-3">Complete the contract
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


<!-- Modal: Resources -->
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
              <button class="btn waves-effect waves-light green darken-3">Buy the card
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
                  <td class="center"><button class="btn-small waves-effect waves-light tempResourceActionBtn" @click="get2Green()">Get 2</button></td>
                  <td class="center"><button class="btn-small waves-effect waves-light tempResourceActionBtn" @click="get2Red()">Get 2</button></td>
                  <td class="center"><button class="btn-small waves-effect waves-light tempResourceActionBtn" @click="get2Yellow()">Get 2</button></td>
                  <td class="center"><button class="btn-small waves-effect waves-light tempResourceActionBtn" @click="get2Purple()">Get 2</button></td>
                  <td class="center"><button class="btn-small waves-effect waves-light tempResourceActionBtn" @click="get2Black()">Get 2</button></td>
                </tr>

                <tr>
                  <td class="center"><button class="btn-small waves-effect waves-light cyan darken-2 tempResourceActionBtn" @click="get1Green()">Get 1</button></td>
                  <td class="center"><button class="btn-small waves-effect waves-light cyan darken-2 tempResourceActionBtn" @click="get1Red()">Get 1</button></td>
                  <td class="center"><button class="btn-small waves-effect waves-light cyan darken-2 tempResourceActionBtn" @click="get1Yellow()">Get 1</button></td>
                  <td class="center"><button class="btn-small waves-effect waves-light cyan darken-2 tempResourceActionBtn" @click="get1Purple()">Get 1</button></td>
                  <td class="center"><button class="btn-small waves-effect waves-light cyan darken-2 tempResourceActionBtn" @click="get1Black()">Get 1</button></td>
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


export default {
  components: { NavbarInRoom },
  props: ['id'],
  setup(props) {

    onMounted(() => {
      M.AutoInit()
       
    })



    const { user } = getUser() 
    let gameData = ref(null)
    
    // variable to hold the contracts value to check
    const contracts = "contracts"

    
  
      
      
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
          
 
        switch (gameData.value.currentPlayer) {
            case 0:
              Player1DOM.value = true
              Player2DOM.value = false
              Player3DOM.value = false
              Player4DOM.value = false
              break
            case 1:
              Player1DOM.value = false
              Player2DOM.value = true
              Player3DOM.value = false
              Player4DOM.value = false
              break
            case 2:
              Player1DOM.value = false
              Player2DOM.value = false
              Player3DOM.value = true
              Player4DOM.value = false
              break
            case 3:
              Player1DOM.value = false
              Player2DOM.value = false
              Player3DOM.value = false
              Player4DOM.value = true
              
              
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
const resourceCardBackground = ref()
const Player1DOM = ref(false)
const Player2DOM = ref(false)
const Player3DOM = ref(false)
const Player4DOM = ref(false)


// behind the scenes script for game state
//const currentPlayer = gameData.value.currentPlayer

const nextPlayer = () => {
  
  if(gameData.value.currentPlayer < gameData.value.maxnumberofplayers - 1 ) {
    dbConnectionGame.update({
      currentPlayer: gameData.value.currentPlayer + 1

    })
  } else {
    dbConnectionGame.update({
    currentPlayer: 0
  })
  }
  
  switch (gameData.value.currentPlayer) {
            case 0:
              Player1DOM.value = true
              Player2DOM.value = false
              Player3DOM.value = false
              Player4DOM.value = false
              break
            case 1:
              Player1DOM.value = false
              Player2DOM.value = true
              Player3DOM.value = false
              Player4DOM.value = false
              break
            case 2:
              Player1DOM.value = false
              Player2DOM.value = false
              Player3DOM.value = true
              Player4DOM.value = false
              break
            case 3:
              Player1DOM.value = false
              Player2DOM.value = false
              Player3DOM.value = false
              Player4DOM.value = true
              
              
          }



console.log('Current player: ', gameData.value.currentPlayer)

}
/// PLAYER ACTIONS SCRIPTS

/*--- Rules constants used in calculations --*/


/* ---- Get TWO tokens ---- */
const get2Green = () => {
  //If Player 1
    if(gameData.value.currentPlayer === 0 && gameData.value.z08marketGreenTokens >= 4 && gameData.value.z12Player1Scores.cash >= 2) {
      dbConnectionGame.update({
        z08marketGreenTokens:  gameData.value.z08marketGreenTokens - 2,
        "z12Player1Scores.greenTemp": gameData.value.z12Player1Scores.greenTemp + 2,
        "z12Player1Scores.cash": gameData.value.z12Player1Scores.cash - 2 
      })
      
      M.toast({html: '2 Green tokens bought by Player 1'})
    }
    //If Player 2
    else if(gameData.value.currentPlayer === 1 && gameData.value.z08marketGreenTokens >= 4 && gameData.value.z13Player2Scores.cash >= 2) {
      dbConnectionGame.update({
        z08marketGreenTokens:  gameData.value.z08marketGreenTokens - 2,
        "z13Player2Scores.greenTemp": gameData.value.z13Player2Scores.greenTemp + 2,
        "z13Player2Scores.cash": gameData.value.z13Player2Scores.cash - 2      
      })
      
      
      M.toast({html: '2 Green tokens bought by Player 2'})
    }
    //If Player 3
    else if(gameData.value.currentPlayer === 2 && gameData.value.z08marketGreenTokens >= 4 && gameData.value.z14Player3Scores.cash >= 2) {
       M.toast({html: '2 Green tokens bought by Player 3'})
       

      dbConnectionGame.update({
        z08marketGreenTokens:  gameData.value.z08marketGreenTokens - 2,
        "z14Player3Scores.greenTemp": gameData.value.z14Player3Scores.greenTemp + 2,
        "z14Player3Scores.cash": gameData.value.z14Player3Scores.cash - 2      
      })

      
    }
    //If Player 4
    else if(gameData.value.currentPlayer === 3 && gameData.value.z08marketGreenTokens >= 4 && gameData.value.z15Player4Scores.cash >= 2) {
      dbConnectionGame.update({
        z08marketGreenTokens:  gameData.value.z08marketGreenTokens - 2,
        "z15Player4Scores.greenTemp": gameData.value.z15Player4Scores.greenTemp + 2,
        "z15Player4Scores.cash": gameData.value.z15Player4Scores.cash - 2      
      })
      
      M.toast({html: '2 Green tokens bought by Player 4'})
    }

    else {
      M.toast({html: 'Not enough tokens for this action'})
     }
  
  console.log('Get 2 green triggered - for player ', gameData.value.currentPlayer)
}

const get2Red = () => {
  console.log('Get 2 red triggered - for player ', gameData.value.currentPlayer)
}

const get2Yellow = () => {
  console.log('Get 2 yellow triggered - for player ', gameData.value.currentPlayer)
}

const get2Purple = () => {
  console.log('Get 2 purple triggered - for player ', gameData.value.currentPlayer)
}

const get2Black = () => {
  console.log('Get 2 black triggered - for player ', gameData.value.currentPlayer)
}

/* ---- Get ONE tokens ---- */
const get1Green = () => {
  console.log('Get 1 green triggered - for player ', gameData.value.currentPlayer)
}

const get1Red = () => {
  console.log('Get 1 red triggered - for player ', gameData.value.currentPlayer)
}

const get1Yellow = () => {
  console.log('Get 1 yellow triggered - for player ', gameData.value.currentPlayer)
}

const get1Purple = () => {
  console.log('Get 1 purple triggered - for player ', gameData.value.currentPlayer)
}

const get1Black = () => {
  console.log('Get 1 black triggered - for player ', gameData.value.currentPlayer)
}



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
                  resourceCardBackground, nextPlayer, Player1DOM, Player2DOM, Player3DOM, Player4DOM,
                  get2Green, get2Red, get2Yellow, get2Purple, get2Black,
                  get1Green, get1Red, get1Yellow, get1Purple, get1Black  
        }
  }
}

</script>
