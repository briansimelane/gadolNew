<template>
  <div class="container-fluid gameRoomBg" v-if="gameData">
    
    <NavbarInRoom />

    <div class="container-fluid">
      <div class="col s12 space-left margin-bottom-small center pageHeadingSmall">
        <h6 class="white-text"> Welcome to <span style="font-weight: bold;">{{ gameData.name }}</span></h6>
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
            :interactive="true"
            :dimmed="true"
            @select="c => handleCardClick(c, 'upcoming', 'green')"
          />
          <ResourceCard
            v-for="card in gameData.z02yellowCards.slice(2, 3)"
            :key="card.Ref"
            :card="card"
            color="yellow"
            :interactive="true"
            :dimmed="true"
            @select="c => handleCardClick(c, 'upcoming', 'yellow')"
          />
          <ResourceCard
            v-for="card in gameData.z03redCards.slice(2, 3)"
            :key="card.Ref"
            :card="card"
            color="red"
            :interactive="true"
            :dimmed="true"
            @select="c => handleCardClick(c, 'upcoming', 'red')"
          />
          <ResourceCard
            v-for="card in gameData.z04purpleCards.slice(2, 3)"
            :key="card.Ref"
            :card="card"
            color="purple"
            :interactive="true"
            :dimmed="true"
            @select="c => handleCardClick(c, 'upcoming', 'purple')"
          />
          <ResourceCard
            v-for="card in gameData.z05blackCards.slice(2, 3)"
            :key="card.Ref"
            :card="card"
            color="black"
            :interactive="true"
            :dimmed="true"
            @select="c => handleCardClick(c, 'upcoming', 'black')"
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

    <!-- Modal: Claim Seat Dialog -->
    <teleport to="#modals">
      <div v-if="showClaimModal" class="custom-modal-overlay">
        <div class="custom-modal-content card white">
          <div class="card-content">
            <span class="card-title teal-text text-darken-4 bold center" style="display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 15px;">
              <i class="material-icons large teal-text text-darken-3">account_box</i>
              Claim Seat {{ claimSeatNumber }}
            </span>
            <p class="grey-text text-darken-2 center" style="margin-bottom: 25px; font-size: 0.95rem;">
              Enter your display name to claim your seat and enter the simulation.
            </p>

            <form @submit.prevent="confirmClaimSeat">
              <div class="input-field col s12 no-padding">
                <input 
                  id="claim_player_name" 
                  type="text" 
                  v-model="claimInputName" 
                  placeholder="e.g. Alex"
                  required
                  autofocus
                  style="font-size: 1.2rem; font-weight: bold; text-align: center;"
                />
                <label for="claim_player_name" class="active center-align">Display Name</label>
              </div>

              <div class="center" style="margin-top: 25px; display: flex; gap: 12px; justify-content: center;">
                <button type="button" class="btn grey lighten-1 black-text waves-effect" @click="cancelClaimSeat">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="waves-effect waves-light btn teal darken-3" 
                  :disabled="!claimInputName.trim()"
                >
                  <i class="material-icons left">check_circle</i>Join Game
                </button>
              </div>
            </form>
          </div>
        </div>
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

    const showClaimModal = ref(false)
    const claimSeatNumber = ref(1)
    const claimInputName = ref('')

    onMounted(() => {
      M.AutoInit()
    })

    const openClaimModal = (seatNum) => {
      claimSeatNumber.value = seatNum || 1
      claimInputName.value = ''
      showClaimModal.value = true
    }

    const cancelClaimSeat = () => {
      showClaimModal.value = false
    }

    const confirmClaimSeat = () => {
      if (!claimInputName.value.trim()) return
      const seatNum = claimSeatNumber.value
      const name = claimInputName.value.trim()
      showClaimModal.value = false

      const updatedPlayers = JSON.parse(JSON.stringify(gameData.value.players))
      const pCopy = updatedPlayers[seatNum - 1]
      pCopy.joined = true
      pCopy.name = name
      pCopy.online = true
      pCopy.uid = 'player-' + seatNum

      updateDoc(roomDocRef, {
        players: updatedPlayers
      }).then(() => {
        M.toast({ html: `Welcome, ${name}! You claimed Seat ${seatNum}.` })
      })
    }

    const JoinPlayer = (seatNumber) => {
      if (!gameData.value || !gameData.value.players) return
      const idx = (seatNumber || 1) - 1
      const targetSeat = gameData.value.players[idx]
      if (!targetSeat || targetSeat.joined) {
        M.toast({ html: 'Seat is already taken' })
        return
      }
      openClaimModal(seatNumber)
    }

    // Watch for room snapshot to prompt player name on first join
    watch(gameData, (newGameData) => {
      if (newGameData && role.value === 'PLAYER' && seat.value) {
        const mySeat = newGameData.players[seat.value - 1]
        if (mySeat && !mySeat.joined) {
          openClaimModal(seat.value)
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

      const actionText = `${pCopy.name} bought a ${permCardColour} permanent resource`

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

      const actionText = `${pCopy.name} completed a contract`

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

          const actionText = `${pCopy.name} bought 2 ${colour.toUpperCase()} tokens`

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

          const actionText = `${pCopy.name} bought 1 ${colour.toUpperCase()} token`
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
      JoinPlayer,
      showClaimModal,
      claimSeatNumber,
      claimInputName,
      cancelClaimSeat,
      confirmClaimSeat
    }
  }
}
</script>

<style scoped>
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(5px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.custom-modal-content {
  width: 90%;
  max-width: 440px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.35);
  animation: modalFadeIn 0.25s ease-out;
}
@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(-20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
