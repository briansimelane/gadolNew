<template>
  <div class="container-fluid gameRoomBg" v-if="gameData">
    
    <NavbarInRoom />

    <div class="container-fluid">
      <div class="col s12 space-left margin-bottom-small center pageHeadingSmall">
        <h6 class="white-text"> Welcome to <span style="font-weight: bold;">{{ gameData.name }}</span> - - - Game Room ID: <span class="red-text grey lighten-3 hoverable">{{ id }}</span> <span style="font-style: italic;">(Share this ID with other players)</span></h6>
      </div>
    </div>

    <div class="gameArea">

      <div class="gameNotifications">
        <span class="left">ACTIVE PLAYER IS: {{ activePlayerName }}</span>  
        <span class="right white-text" v-if="isSpectator">You are in Spectator view</span>
        <span class="right white-text" v-if="role === 'FACILITATOR' || role === 'ADMIN'">You are in Facilitator view</span> 
        <span class="right white-text" v-if="role === 'PLAYER' && seat">You are playing in Seat {{ seat }}</span>
      </div>

      <div class="gameAreaLeft">
      
        <!-- Contracts Market -->
        <div class="onTableContracts" v-if="gameData.rules === 'contracts'">
          <h5 class="white-text hide-on-med-and-down"><i class="material-icons right">send</i>Contract Cards</h5>
          
          <ContractCard
            v-for="contract in gameData.z00contractCards.slice(0, 4)"
            :key="contract.Ref"
            :card="contract"
            @select="c => handleCardClick(c, 'contract')"
          />
        </div>

        <!-- Resource Cards Market -->
        <div class="onTableRow1">
          <ResourceCard
            v-for="card in gameData.z01greenCards.slice(0, 2)"
            :key="card.Ref"
            :card="card"
            color="green"
            @select="c => handleCardClick(c, 'resource', 'green')"
          />
          <ResourceCard
            v-for="card in gameData.z02yellowCards.slice(0, 2)"
            :key="card.Ref"
            :card="card"
            color="yellow"
            @select="c => handleCardClick(c, 'resource', 'yellow')"
          />
        </div>

        <div class="onTableRow2">
          <ResourceCard
            v-for="card in gameData.z03redCards.slice(0, 2)"
            :key="card.Ref"
            :card="card"
            color="red"
            @select="c => handleCardClick(c, 'resource', 'red')"
          />
          <ResourceCard
            v-for="card in gameData.z04purpleCards.slice(0, 2)"
            :key="card.Ref"
            :card="card"
            color="purple"
            @select="c => handleCardClick(c, 'resource', 'purple')"
          />
        </div>

        <div class="onTableRow3">
          <ResourceCard
            v-for="card in gameData.z05blackCards.slice(0, 2)"
            :key="card.Ref"
            :card="card"
            color="black"
            @select="c => handleCardClick(c, 'resource', 'black')"
          />
        </div>

        <!-- Upcoming Cards -->
        <div class="upComingCards">
          <h5 class="white-text hide-on-med-and-down"><i class="material-icons right">send</i>Upcoming cards</h5>
          
          <ResourceCard
            v-for="card in gameData.z01greenCards.slice(2, 3)"
            :key="card.Ref"
            :card="card"
            color="green"
            :interactive="false"
            :dimmed="true"
          />
          <ResourceCard
            v-for="card in gameData.z02yellowCards.slice(2, 3)"
            :key="card.Ref"
            :card="card"
            color="yellow"
            :interactive="false"
            :dimmed="true"
          />
          <ResourceCard
            v-for="card in gameData.z03redCards.slice(2, 3)"
            :key="card.Ref"
            :card="card"
            color="red"
            :interactive="false"
            :dimmed="true"
          />
          <ResourceCard
            v-for="card in gameData.z04purpleCards.slice(2, 3)"
            :key="card.Ref"
            :card="card"
            color="purple"
            :interactive="false"
            :dimmed="true"
          />
          <ResourceCard
            v-for="card in gameData.z05blackCards.slice(2, 3)"
            :key="card.Ref"
            :card="card"
            color="black"
            :interactive="false"
            :dimmed="true"
          />
        </div>

        <!-- Token Market component -->
        <TokenMarket
          :gameData="gameData"
          @acquireClick="handleAcquireClick"
        />

        <!-- Last Action -->
        <div class="tempLastActionsArea">
          <h6 class="white-text" style="display: inline-block;">Last Action:</h6>
          <p class="white multipadding-5 lastAction" v-if="gameData.lastAction">{{ gameData.lastAction }}</p>
        </div>

      </div>

      <!-- Player Panels Column -->
      <div class="gameAreaRight">
        <div class="gameScoring">
          <PlayerPanel
            v-for="player in displayedPlayers"
            :key="player.seat"
            :player="player"
            :isActive="gameData.currentPlayer === (player.seat - 1)"
            :joinable="!hasJoinedAnySeat"
            :headerColor="getPlayerHeaderColor(player.seat)"
            @takeSeat="JoinPlayer"
          />
        </div>
      </div>

    </div>

    <!-- Zoom Overlay (Teleported) -->
    <CardZoomOverlay
      :isMyTurn="isMyTurn"
      :afford="affordZoomedCard"
      @action="handleZoomAction"
    />

    <!-- Modal: TempResources -->
    <teleport to='#modals'>
      <div id="modalTempResources" v-if="ModalTempResources">
        <div class="modal-content">
          <h4 class="center">Acquire temporary resources</h4>

          <div class="row">
            <div class="col s12 m7">
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
                    <td class="center"><button class="btn-small waves-effect waves-light tempResourceActionBtn" @click="getTwoTokens('green')" :class="{ disabled: tempTokensCount > 0 }">Get 2</button></td>
                    <td class="center"><button class="btn-small waves-effect waves-light tempResourceActionBtn" @click="getTwoTokens('red')" :class="{ disabled: tempTokensCount > 0  }">Get 2</button></td>
                    <td class="center"><button class="btn-small waves-effect waves-light tempResourceActionBtn" @click="getTwoTokens('yellow')" :class="{ disabled: tempTokensCount > 0  }">Get 2</button></td>
                    <td class="center"><button class="btn-small waves-effect waves-light tempResourceActionBtn" @click="getTwoTokens('purple')" :class="{ disabled: tempTokensCount > 0  }">Get 2</button></td>
                    <td class="center"><button class="btn-small waves-effect waves-light tempResourceActionBtn" @click="getTwoTokens('black')" :class="{ disabled: tempTokensCount > 0  }">Get 2</button></td>
                  </tr>

                  <tr>
                    <td class="center"><button class="btn-small waves-effect waves-light cyan darken-2 tempResourceActionBtn" @click="getOneToken('green')" :class="{ disabled: tokenTakenGreen }">Get 1</button></td>
                    <td class="center"><button class="btn-small waves-effect waves-light cyan darken-2 tempResourceActionBtn" @click="getOneToken('red')" :class="{ disabled: tokenTakenRed }">Get 1</button></td>
                    <td class="center"><button class="btn-small waves-effect waves-light cyan darken-2 tempResourceActionBtn" @click="getOneToken('yellow')" :class="{ disabled: tokenTakenYellow }">Get 1</button></td>
                    <td class="center"><button class="btn-small waves-effect waves-light cyan darken-2 tempResourceActionBtn" @click="getOneToken('purple')" :class="{ disabled: tokenTakenPurple }">Get 1</button></td>
                    <td class="center"><button class="btn-small waves-effect waves-light cyan darken-2 tempResourceActionBtn" @click="getOneToken('black')" :class="{ disabled: tokenTakenBlack }">Get 1</button></td>
                  </tr>
                  
                  <tr>
                    <td colspan="5" v-if="tempTokensCount === 0 "><p class="green-text center">Make your selection</p></td>
                    <td colspan="5" v-if="tempTokensCount > 0"><p class="green-text center">You have taken {{ tempTokensCount }} token<span v-if="tempTokensCount > 1">/s</span>. Maximum is 3 tokens.</p></td>
                  </tr>
                </tbody>
              </table>

              <br>
              
              <div class="center">
                <button class="btn waves-effect waves-light red darken-3" @click="ModalTempResources = !ModalTempResources">Close</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Modal: Game End POINTS -->
    <teleport to='#modals'>
      <div id="ModalGameEndPoints" v-if="ModalGameEndPoints">
        <div class="modal-content">
          <div class="row">
            <div class="col s12 center">
              <br><br>
              <h4 class="center">Game Over! Highest points.</h4>
              <br><br>  
              <h6>{{ activePlayerName }} has won.</h6>
            </div>
          </div>
          <hr>
        </div>
        <div class="center">
          <button class="btn waves-effect waves-light red darken-3" @click="ModalGameEndPoints = !ModalGameEndPoints">Close</button>
        </div>
        <hr>
      </div>
    </teleport>

    <!-- Modal: Game End CONTRACTS -->
    <teleport to='#modals'>
      <div id="ModalGameEndContracts" v-if="ModalGameEndContracts">
        <div class="modal-content">
          <div class="row">
            <div class="col s12 center">
              <br><br>
              <h4 class="center">Game Over! Contract completed.</h4>
              <br><br>  
              <h6>{{ activePlayerName }} has won.</h6>
            </div>
          </div>
          <hr>
        </div>
        <div class="center">
          <button class="btn waves-effect waves-light red darken-3" @click="ModalGameEndContracts = !ModalGameEndContracts">Close</button>
        </div>
        <hr>
      </div>
    </teleport>

  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import useRoom from '../composables/useRoom'
import useCardZoom from '../composables/useCardZoom'
import useSession from '../composables/useSession'
import NavbarInRoom from '../components/NavbarInRoom.vue'
import ResourceCard from '../components/cards/ResourceCard.vue'
import ContractCard from '../components/cards/ContractCard.vue'
import PlayerPanel from '../components/PlayerPanel.vue'
import TokenMarket from '../components/TokenMarket.vue'
import CardZoomOverlay from '../components/cards/CardZoomOverlay.vue'
import { updateDoc } from 'firebase/firestore'
import M from 'materialize-css'

export default {
  name: 'GameRoom',
  components: {
    NavbarInRoom,
    ResourceCard,
    ContractCard,
    PlayerPanel,
    TokenMarket,
    CardZoomOverlay
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { role, roomId, seat } = useSession()
    const { gameData, error, roomDocRef } = useRoom(props.id)
    const { zoomedCard, zoomType, zoomColor, openZoom, closeZoom } = useCardZoom()

    const ModalTempResources = ref(false)
    const ModalGameEndPoints = ref(false)
    const ModalGameEndContracts = ref(false)

    onMounted(() => {
      M.AutoInit()
    })

    const JoinPlayer = (seatNumber) => {
      if (!gameData.value || !gameData.value.players) return
      const idx = (seatNumber || 1) - 1
      const targetSeat = gameData.value.players[idx]
      if (!targetSeat || targetSeat.joined) {
        M.toast({ html: 'Seat is already taken' })
        return
      }
      let name = prompt(`Enter your name to claim Seat ${seatNumber}:`)
      if (!name || !name.trim()) return

      const updatedPlayers = JSON.parse(JSON.stringify(gameData.value.players))
      const pCopy = updatedPlayers[idx]
      pCopy.joined = true
      pCopy.name = name.trim()
      pCopy.online = true
      pCopy.uid = 'player-' + seatNumber

      updateDoc(roomDocRef, {
        players: updatedPlayers
      }).then(() => {
        M.toast({ html: `Welcome, ${name.trim()}! You joined Seat ${seatNumber}.` })
      })
    }

    // Watch for room snapshot to prompt player name on first join
    watch(gameData, (newGameData) => {
      if (newGameData && role.value === 'PLAYER' && seat.value) {
        const mySeat = newGameData.players[seat.value - 1]
        if (mySeat && !mySeat.joined) {
          let name = ''
          while (!name || !name.trim()) {
            name = prompt('Welcome to Gadol! Please enter your name to claim Seat ' + seat.value + ':')
            if (name === null) {
              name = ''
            }
          }
          
          const updatedPlayers = JSON.parse(JSON.stringify(newGameData.players))
          const pCopy = updatedPlayers[seat.value - 1]
          pCopy.joined = true
          pCopy.name = name.trim()
          pCopy.online = true
          pCopy.uid = 'player-' + seat.value

          updateDoc(roomDocRef, {
            players: updatedPlayers
          }).then(() => {
            M.toast({ html: `Welcome, ${name.trim()}! You are bound to Seat ${seat.value}.` })
          })
        }
      }
    }, { immediate: true })

    // Watch for server game end states to trigger local modal flags
    watch(() => gameData.value?.modalPoints, (newVal) => {
      if (newVal !== undefined) ModalGameEndPoints.value = newVal
    })
    watch(() => gameData.value?.modalContracts, (newVal) => {
      if (newVal !== undefined) ModalGameEndContracts.value = newVal
    })

    const displayedPlayers = computed(() => {
      if (!gameData.value || !gameData.value.players) return []
      return gameData.value.players.slice(0, parseInt(gameData.value.numPlayers))
    })

    const activePlayer = computed(() => {
      if (!gameData.value || !gameData.value.players) return null
      return gameData.value.players[gameData.value.currentPlayer]
    })

    const isMyTurn = computed(() => {
      if (role.value === 'FACILITATOR' || role.value === 'ADMIN') return true
      if (role.value === 'PLAYER' && seat.value) {
        return (seat.value - 1) === gameData.value?.currentPlayer
      }
      return false
    })

    const activePlayerName = computed(() => {
      if (!activePlayer.value) return ''
      return activePlayer.value.joined ? activePlayer.value.name : `Seat ${activePlayer.value.seat}`
    })

    const hasJoinedAnySeat = computed(() => true)

    const isSpectator = computed(() => {
      if (role.value === 'FACILITATOR' || role.value === 'ADMIN') return false
      if (role.value === 'PLAYER' && seat.value) return false
      return true
    })

    const tempTokensCount = computed(() => {
      if (!activePlayer.value) return 0
      return activePlayer.value.scores.TempTokensTakenCounter
    })

    const tokenTakenGreen = computed(() => activePlayer.value ? activePlayer.value.scores.greenTokenTaken : false)
    const tokenTakenRed = computed(() => activePlayer.value ? activePlayer.value.scores.redTokenTaken : false)
    const tokenTakenYellow = computed(() => activePlayer.value ? activePlayer.value.scores.yellowTokenTaken : false)
    const tokenTakenPurple = computed(() => activePlayer.value ? activePlayer.value.scores.purpleTokenTaken : false)
    const tokenTakenBlack = computed(() => activePlayer.value ? activePlayer.value.scores.blackTokenTaken : false)

    const affordZoomedCard = computed(() => {
      if (!zoomedCard.value || !activePlayer.value) return false
      const card = zoomedCard.value
      const scores = activePlayer.value.scores

      if (zoomType.value === 'resource') {
        return (
          card.CostGreen <= scores.greenTemp + scores.greenPerm &&
          card.CostRed <= scores.redTemp + scores.redPerm &&  
          card.CostYellow <= scores.yellowTemp + scores.yellowPerm &&  
          card.CostPurple <= scores.purpleTemp + scores.purplePerm &&
          card.CostBlack <= scores.blackTemp + scores.blackPerm
        )
      } else if (zoomType.value === 'contract') {
        return (
          card.CostGreen <= scores.greenPerm &&
          card.CostRed <= scores.redPerm &&  
          card.CostYellow <= scores.yellowPerm &&  
          card.CostPurple <= scores.purplePerm &&
          card.CostBlack <= scores.blackPerm &&
          card.Production <= scores.production
        )
      }
      return false
    })

    const handleCardClick = (card, type, color = null) => {
      if (!isMyTurn.value) {
        NotActivePlayer()
        return
      }
      openZoom(card, type, color)
    }

    const handleAcquireClick = () => {
      if (!isMyTurn.value) {
        NotActivePlayer()
        return
      }
      ModalTempResources.value = true
    }

    const getPlayerHeaderColor = (seatVal) => {
      if (seatVal === 1) return 'yellow'
      if (seatVal === 2) return 'green'
      if (seatVal === 3) return 'blue'
      if (seatVal === 4) return 'orange'
      return 'yellow'
    }

    const NotActivePlayer = () => {
      M.toast({ html: 'You are not the active player' })
    }

    const BuyPermResource = (card) => {
      if (!activePlayer.value) return
      const scores = activePlayer.value.scores

      const greenTokensAdjust = Math.max(0, card.CostGreen - scores.greenPerm)
      const redTokensAdjust = Math.max(0, card.CostRed - scores.redPerm)
      const yellowTokensAdjust = Math.max(0, card.CostYellow - scores.yellowPerm)
      const purpleTokensAdjust = Math.max(0, card.CostPurple - scores.purplePerm)
      const blackTokensAdjust = Math.max(0, card.CostBlack - scores.blackPerm)

      const cashAdjustment = greenTokensAdjust + redTokensAdjust + yellowTokensAdjust + purpleTokensAdjust + blackTokensAdjust
      const permCardColour = card.Colour
      const color = card.Colour.toLowerCase()

      const updatedPlayers = JSON.parse(JSON.stringify(gameData.value.players))
      const pCopy = updatedPlayers[gameData.value.currentPlayer]

      pCopy.scores.greenTemp -= greenTokensAdjust
      pCopy.scores.redTemp -= redTokensAdjust
      pCopy.scores.yellowTemp -= yellowTokensAdjust
      pCopy.scores.purpleTemp -= purpleTokensAdjust
      pCopy.scores.blackTemp -= blackTokensAdjust
      
      pCopy.scores.cash += cashAdjustment

      if (color === 'green') pCopy.scores.greenPerm += 1
      else if (color === 'red') pCopy.scores.redPerm += 1
      else if (color === 'yellow') pCopy.scores.yellowPerm += 1
      else if (color === 'purple') pCopy.scores.purplePerm += 1
      else if (color === 'black') pCopy.scores.blackPerm += 1

      pCopy.scores.production += card.Production

      let marketKey = ''
      if (color === 'green') marketKey = 'z01greenCards'
      else if (color === 'yellow') marketKey = 'z02yellowCards'
      else if (color === 'red') marketKey = 'z03redCards'
      else if (color === 'purple') marketKey = 'z04purpleCards'
      else if (color === 'black') marketKey = 'z05blackCards'

      const marketCards = [...gameData.value[marketKey]]
      const index = marketCards.findIndex(c => c.Ref === card.Ref)
      if (index !== -1) {
        marketCards.splice(index, 1)
      }

      const actionText = `${pCopy.name} (P${pCopy.seat}) bought a ${permCardColour} permanent resource`

      updateDoc(roomDocRef, {
        z08marketGreenTokens: gameData.value.z08marketGreenTokens + greenTokensAdjust,
        z07marketRedTokens: gameData.value.z07marketRedTokens + redTokensAdjust,
        z09marketYellowTokens: gameData.value.z09marketYellowTokens + yellowTokensAdjust,
        z10marketPurpleTokens: gameData.value.z10marketPurpleTokens + purpleTokensAdjust,
        z11marketBlackTokens: gameData.value.z11marketBlackTokens + blackTokensAdjust,
        players: updatedPlayers,
        [marketKey]: marketCards,
        lastAction: actionText
      }).then(() => {
        M.toast({ html: `You have bought a ${permCardColour} permanent resource` })
        nextPlayer()
      })
    }

    const BuyContract = (card) => {
      if (!activePlayer.value) return
      const scores = activePlayer.value.scores

      const updatedPlayers = JSON.parse(JSON.stringify(gameData.value.players))
      const pCopy = updatedPlayers[gameData.value.currentPlayer]

      pCopy.scores.value += card.Value
      pCopy.scores.production -= card.Production
      pCopy.scores.cash += card.Cash
      pCopy.scores.debtors += card.Debtors

      pCopy.scores.greenPerm -= card.CostGreen
      pCopy.scores.redPerm -= card.CostRed
      pCopy.scores.yellowPerm -= card.CostYellow
      pCopy.scores.purplePerm -= card.CostPurple
      pCopy.scores.blackPerm -= card.CostBlack

      pCopy.scores.costs += (card.Production + card.CostGreen + card.CostRed + card.CostYellow + card.CostPurple + card.CostBlack)

      const contractCards = [...gameData.value.z00contractCards]
      const index = contractCards.findIndex(c => c.Ref === card.Ref)
      if (index !== -1) {
        contractCards.splice(index, 1)
      }

      const actionText = `${pCopy.name} (P${pCopy.seat}) completed a contract`

      updateDoc(roomDocRef, {
        players: updatedPlayers,
        z00contractCards: contractCards,
        lastAction: actionText
      }).then(() => {
        M.toast({ html: `You completed a Contract` })
        nextPlayer()
      })
    }

    const handleZoomAction = ({ card, type }) => {
      if (type === 'resource') {
        BuyPermResource(card)
      } else if (type === 'contract') {
        BuyContract(card)
      }
    }

    const getTwoTokens = (colour) => {
      if (!activePlayer.value) return
      const scores = activePlayer.value.scores

      let marketField = ''
      if (colour === 'green') marketField = 'z08marketGreenTokens'
      else if (colour === 'red') marketField = 'z07marketRedTokens'
      else if (colour === 'yellow') marketField = 'z09marketYellowTokens'
      else if (colour === 'purple') marketField = 'z10marketPurpleTokens'
      else if (colour === 'black') marketField = 'z11marketBlackTokens'

      const marketCount = gameData.value[marketField]
      if (marketCount >= 4) {
        if (scores.cash >= 2) {
          const updatedPlayers = JSON.parse(JSON.stringify(gameData.value.players))
          const pCopy = updatedPlayers[gameData.value.currentPlayer]

          pCopy.scores[colour + 'Temp'] += 2
          pCopy.scores.cash -= 2

          const actionText = `${pCopy.name} (P${pCopy.seat}) bought 2 ${colour.toUpperCase()} tokens`

          updateDoc(roomDocRef, {
            [marketField]: marketCount - 2,
            players: updatedPlayers,
            lastAction: actionText
          }).then(() => {
            M.toast({ html: `You bought 2 ${colour} tokens` })
            ModalTempResources.value = false
            nextPlayer()
          })
        } else {
          M.toast({ html: "You don't have enough cash" })
        }
      }
    }

    const getOneToken = (colour) => {
      if (!activePlayer.value) return
      const scores = activePlayer.value.scores

      let marketField = ''
      if (colour === 'green') marketField = 'z08marketGreenTokens'
      else if (colour === 'red') marketField = 'z07marketRedTokens'
      else if (colour === 'yellow') marketField = 'z09marketYellowTokens'
      else if (colour === 'purple') marketField = 'z10marketPurpleTokens'
      else if (colour === 'black') marketField = 'z11marketBlackTokens'

      const marketCount = gameData.value[marketField]
      if (marketCount >= 1) {
        if (scores.cash >= 1) {
          const updatedPlayers = JSON.parse(JSON.stringify(gameData.value.players))
          const pCopy = updatedPlayers[gameData.value.currentPlayer]

          pCopy.scores[colour + 'Temp'] += 1
          pCopy.scores.cash -= 1
          pCopy.scores.TempTokensTakenCounter += 1
          pCopy.scores[colour + 'TokenTaken'] = true

          const actionText = `${pCopy.name} (P${pCopy.seat}) bought 1 ${colour.toUpperCase()} token`
          const finishedTurn = pCopy.scores.TempTokensTakenCounter === 3

          updateDoc(roomDocRef, {
            [marketField]: marketCount - 1,
            players: updatedPlayers,
            lastAction: actionText
          }).then(() => {
            M.toast({ html: `You bought 1 ${colour} token` })
            if (finishedTurn) {
              ModalTempResources.value = false
              nextPlayer()
            }
          })
        } else {
          M.toast({ html: "You don't have enough cash" })
        }
      }
    }

    const nextPlayer = () => {
      const players = gameData.value.players
      const numPlayers = parseInt(gameData.value.numPlayers)

      let winPoints = false
      let winContracts = false

      for (let i = 0; i < numPlayers; i++) {
        const scores = players[i].scores
        if (gameData.value.rules === 'points' && scores.production >= 15) {
          winPoints = true
        }
        if (gameData.value.rules === 'contracts' && scores.value > 0) {
          winContracts = true
        }
      }

      if (winPoints) {
        updateDoc(roomDocRef, { modalPoints: true })
        return
      }
      if (winContracts) {
        updateDoc(roomDocRef, { modalContracts: true })
        return
      }

      const nextSeat = (gameData.value.currentPlayer + 1) % numPlayers

      const updatedPlayers = JSON.parse(JSON.stringify(gameData.value.players))
      const currentP = updatedPlayers[gameData.value.currentPlayer]
      currentP.scores.TempTokensTakenCounter = 0
      currentP.scores.greenTokenTaken = false
      currentP.scores.redTokenTaken = false
      currentP.scores.yellowTokenTaken = false
      currentP.scores.purpleTokenTaken = false
      currentP.scores.blackTokenTaken = false

      updateDoc(roomDocRef, {
        players: updatedPlayers,
        currentPlayer: nextSeat
      })
    }

    return {
      role,
      seat,
      gameData,
      error,
      ModalTempResources,
      ModalGameEndPoints,
      ModalGameEndContracts,
      displayedPlayers,
      activePlayerName,
      isMyTurn,
      hasJoinedAnySeat,
      isSpectator,
      tempTokensCount,
      tokenTakenGreen,
      tokenTakenRed,
      tokenTakenYellow,
      tokenTakenPurple,
      tokenTakenBlack,
      affordZoomedCard,
      handleCardClick,
      handleAcquireClick,
      getPlayerHeaderColor,
      getTwoTokens,
      getOneToken,
      handleZoomAction,
      JoinPlayer
    }
  }
}
</script>
