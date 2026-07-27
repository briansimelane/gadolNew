<template>
  <div class="game-room-page gameRoomBg" v-if="gameData">
    <!-- Slim Navigation Bar -->
    <NavbarInRoom :roomId="id" />

    <!-- Sticky Turn Bar -->
    <TurnBar 
      :roomName="gameData.name"
      :activePlayerName="activePlayerName" 
      :isMyTurn="isMyTurn" 
      :isFacilitator="role === 'FACILITATOR' || role === 'ADMIN'" 
      :isSpectator="isSpectator" 
      :activeSeat="(gameData.currentPlayer || 0) + 1"
      :unreadCount="unreadLogCount"
      @openLog="openLogPanel"
    />

    <!-- Main Game Container: Mobile 1-col | Desktop 2-col -->
    <div class="game-layout-container" :class="{ 'desktop-layout': isDesktop }">
      <!-- Main Board Column -->
      <div class="board-column">
        
        <!-- Contracts Row (Horizontal Scroll Snap) -->
        <div class="contracts-section" v-if="gameData.rules === 'contracts'">
          <div class="section-label white-text">
            <i class="material-icons tiny">description</i>Contract Cards
          </div>
          <div class="contracts-scroll-row">
            <ContractCard 
              v-for="card in gameData.z00contractCards.slice(0, 4)" 
              :key="card.Ref" 
              :card="card" 
              :interactive="true" 
              @select="c => handleCardClick(c, 'contract')"
            />
          </div>
        </div>

        <!-- Token Market Bar (Placed ABOVE resource cards) -->
        <div class="market-section">
          <TokenMarket 
            :gameData="gameData" 
            @acquireClick="handleAcquireClick"
          />
        </div>

        <!-- Resource Cards Grid (Colour Pair Tiles) -->
        <div class="resource-pairs-grid">
          <ResourcePairTile 
            color="green" 
            :cards="gameData.z01greenCards.slice(0, 2)" 
            :interactive="true"
            @select="c => handleCardClick(c, 'resource', 'green')"
          />
          <ResourcePairTile 
            color="yellow" 
            :cards="gameData.z02yellowCards.slice(0, 2)" 
            :interactive="true"
            @select="c => handleCardClick(c, 'resource', 'yellow')"
          />
          <ResourcePairTile 
            color="red" 
            :cards="gameData.z03redCards.slice(0, 2)" 
            :interactive="true"
            @select="c => handleCardClick(c, 'resource', 'red')"
          />
          <ResourcePairTile 
            color="purple" 
            :cards="gameData.z04purpleCards.slice(0, 2)" 
            :interactive="true"
            @select="c => handleCardClick(c, 'resource', 'purple')"
          />
          <ResourcePairTile 
            color="black" 
            :cards="gameData.z05blackCards.slice(0, 2)" 
            :interactive="true"
            @select="c => handleCardClick(c, 'resource', 'black')"
          />
        </div>

        <!-- Upcoming Cards Collapsible -->
        <div class="upcoming-section">
          <button class="upcoming-toggle-btn" @click="upcomingOpen = !upcomingOpen">
            <span>Show Upcoming Cards</span>
            <i class="material-icons">{{ upcomingOpen ? 'expand_less' : 'expand_more' }}</i>
          </button>

          <div v-if="upcomingOpen" class="upcoming-cards-row">
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
        </div>

      </div> <!-- end board-column -->

      <!-- Right Column: Mobile Footer Stack | Desktop Static Rail -->
      <div class="teams-column">
        <!-- Own Team Sticky Bar (Mobile Only) -->
        <OwnTeamBar 
          v-if="!isDesktop && ownPlayer" 
          :player="ownPlayer" 
          :isActive="(ownPlayer.seat - 1) === gameData.currentPlayer"
        />

        <!-- Team Sheet: Mobile Bottom Sheet | Desktop Static Rail -->
        <TeamSheet 
          :players="otherPlayers" 
          :ownPlayer="ownPlayer"
          :currentPlayer="gameData.currentPlayer"
          :isDesktop="isDesktop"
          @takeSeat="JoinPlayer"
        />
      </div>
    </div>

    <!-- OVERLAYS (TELEPORTED TO #MODALS) -->

    <!-- Card Zoom Overlay -->
    <CardZoomOverlay 
      :isMyTurn="isMyTurn" 
      :afford="affordZoomedCard" 
      @action="handleZoomAction" 
    />

    <!-- Game Log Slide-Over Panel -->
    <GameLogPanel 
      v-if="logOpen" 
      :log="gameData.gameLog || []" 
      :players="gameData.players || []" 
      @close="closeLogPanel"
    />

    <!-- Acquire Resources Modal (Restyled Single Column Rows) -->
    <teleport to="#modals">
      <div v-if="ModalTempResources" class="custom-modal-overlay" @click.self="ModalTempResources = false">
        <div class="custom-modal-content card white acquire-modal-card">
          <div class="card-content">
            <span class="card-title teal-text text-darken-4 bold center">Acquire Temporary Tokens</span>
            <p class="center grey-text text-darken-1" style="font-size: 0.85rem; margin-bottom: 15px;">
              Get 2 of 1 colour OR up to 3 different singles ($1 each)
            </p>

            <div class="acquire-color-list">
              <!-- Green -->
              <div class="acquire-item-row">
                <div class="item-left">
                  <img src="../assets/img/greenToken.png" class="token-mini-img" alt="Green token" />
                  <span>Stock: <strong>{{ gameData.z08marketGreenTokens }}</strong></span>
                </div>
                <div class="item-actions">
                  <button class="btn-small waves-effect green darken-2" @click="getTwoTokens('green')" :disabled="tempTokensCount > 0 || gameData.z08marketGreenTokens < 4">Get 2</button>
                  <button class="btn-small waves-effect cyan darken-3" @click="getOneToken('green')" :disabled="tokenTakenGreen || gameData.z08marketGreenTokens < 1">Get 1</button>
                </div>
              </div>

              <!-- Yellow -->
              <div class="acquire-item-row">
                <div class="item-left">
                  <img src="../assets/img/yellowToken.png" class="token-mini-img" alt="Yellow token" />
                  <span>Stock: <strong>{{ gameData.z09marketYellowTokens }}</strong></span>
                </div>
                <div class="item-actions">
                  <button class="btn-small waves-effect yellow darken-3" @click="getTwoTokens('yellow')" :disabled="tempTokensCount > 0 || gameData.z09marketYellowTokens < 4">Get 2</button>
                  <button class="btn-small waves-effect cyan darken-3" @click="getOneToken('yellow')" :disabled="tokenTakenYellow || gameData.z09marketYellowTokens < 1">Get 1</button>
                </div>
              </div>

              <!-- Red -->
              <div class="acquire-item-row">
                <div class="item-left">
                  <img src="../assets/img/redToken.png" class="token-mini-img" alt="Red token" />
                  <span>Stock: <strong>{{ gameData.z07marketRedTokens }}</strong></span>
                </div>
                <div class="item-actions">
                  <button class="btn-small waves-effect red darken-2" @click="getTwoTokens('red')" :disabled="tempTokensCount > 0 || gameData.z07marketRedTokens < 4">Get 2</button>
                  <button class="btn-small waves-effect cyan darken-3" @click="getOneToken('red')" :disabled="tokenTakenRed || gameData.z07marketRedTokens < 1">Get 1</button>
                </div>
              </div>

              <!-- Purple -->
              <div class="acquire-item-row">
                <div class="item-left">
                  <img src="../assets/img/purpleToken.png" class="token-mini-img" alt="Purple token" />
                  <span>Stock: <strong>{{ gameData.z10marketPurpleTokens }}</strong></span>
                </div>
                <div class="item-actions">
                  <button class="btn-small waves-effect purple darken-2" @click="getTwoTokens('purple')" :disabled="tempTokensCount > 0 || gameData.z10marketPurpleTokens < 4">Get 2</button>
                  <button class="btn-small waves-effect cyan darken-3" @click="getOneToken('purple')" :disabled="tokenTakenPurple || gameData.z10marketPurpleTokens < 1">Get 1</button>
                </div>
              </div>

              <!-- Black -->
              <div class="acquire-item-row">
                <div class="item-left">
                  <img src="../assets/img/blackToken.png" class="token-mini-img" alt="Black token" />
                  <span>Stock: <strong>{{ gameData.z11marketBlackTokens }}</strong></span>
                </div>
                <div class="item-actions">
                  <button class="btn-small waves-effect grey darken-3" @click="getTwoTokens('black')" :disabled="tempTokensCount > 0 || gameData.z11marketBlackTokens < 4">Get 2</button>
                  <button class="btn-small waves-effect cyan darken-3" @click="getOneToken('black')" :disabled="tokenTakenBlack || gameData.z11marketBlackTokens < 1">Get 1</button>
                </div>
              </div>
            </div>

            <div class="center" style="margin-top: 15px;">
              <p class="teal-text text-darken-3 bold" v-if="tempTokensCount === 0">Make your selection</p>
              <p class="teal-text text-darken-3 bold" v-else>Taken {{ tempTokensCount }} token<span v-if="tempTokensCount > 1">s</span> (max 3 singles).</p>
            </div>

            <div class="center" style="margin-top: 15px;">
              <button class="btn grey lighten-1 black-text waves-effect" @click="ModalTempResources = false">Done / Close</button>
            </div>
          </div>
        </div>
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
                <button type="button" class="btn grey lighten-1 black-text waves-effect" @click="cancelClaimSeat">Cancel</button>
                <button type="submit" class="waves-effect waves-light btn teal darken-3" :disabled="!claimInputName.trim()">
                  <i class="material-icons left">check_circle</i>Join Game
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Modal: Game End POINTS -->
    <teleport to="#modals">
      <div v-if="ModalGameEndPoints" class="custom-modal-overlay">
        <div class="custom-modal-content card white">
          <div class="card-content center">
            <i class="material-icons large amber-text">emoji_events</i>
            <h4 class="teal-text text-darken-4 bold" style="margin: 10px 0;">Game Over!</h4>
            <h6 class="grey-text text-darken-3">Winner: <strong>{{ activePlayerName }}</strong></h6>

            <!-- Final Scores Summary Table -->
            <div class="end-game-scores" style="margin-top: 20px;">
              <h6 class="left-align bold">Final Standings:</h6>
              <table class="striped condensed">
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>Points</th>
                    <th>Cash</th>
                    <th>Prod</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in displayedPlayers" :key="p.seat">
                    <td>{{ p.joined ? p.name : 'Seat ' + p.seat }}</td>
                    <td><strong>{{ p.scores.value }}</strong></td>
                    <td>${{ p.scores.cash }}</td>
                    <td>{{ p.scores.production }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="center" style="margin-top: 25px;">
              <button class="btn red darken-3 waves-effect" @click="ModalGameEndPoints = false">Close</button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Modal: Game End CONTRACTS -->
    <teleport to="#modals">
      <div v-if="ModalGameEndContracts" class="custom-modal-overlay">
        <div class="card-content center custom-modal-content card white">
          <div class="card-content center">
            <i class="material-icons large amber-text">emoji_events</i>
            <h4 class="teal-text text-darken-4 bold" style="margin: 10px 0;">Game Over!</h4>
            <h6 class="grey-text text-darken-3">Winner: <strong>{{ activePlayerName }}</strong> (Contract Completed)</h6>

            <!-- Final Scores Summary Table -->
            <div class="end-game-scores" style="margin-top: 20px;">
              <h6 class="left-align bold">Final Standings:</h6>
              <table class="striped condensed">
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>Points</th>
                    <th>Cash</th>
                    <th>Prod</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in displayedPlayers" :key="p.seat">
                    <td>{{ p.joined ? p.name : 'Seat ' + p.seat }}</td>
                    <td><strong>{{ p.scores.value }}</strong></td>
                    <td>${{ p.scores.cash }}</td>
                    <td>{{ p.scores.production }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="center" style="margin-top: 25px;">
              <button class="btn red darken-3 waves-effect" @click="ModalGameEndContracts = false">Close</button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import useRoom from '../composables/useRoom'
import useCardZoom from '../composables/useCardZoom'
import useSession from '../composables/useSession'
import NavbarInRoom from '../components/NavbarInRoom.vue'
import TurnBar from '../components/TurnBar.vue'
import ResourcePairTile from '../components/ResourcePairTile.vue'
import TokenMarket from '../components/TokenMarket.vue'
import OwnTeamBar from '../components/OwnTeamBar.vue'
import TeamSheet from '../components/TeamSheet.vue'
import GameLogPanel from '../components/GameLogPanel.vue'
import ResourceCard from '../components/cards/ResourceCard.vue'
import ContractCard from '../components/cards/ContractCard.vue'
import CardZoomOverlay from '../components/cards/CardZoomOverlay.vue'
import { updateDoc } from 'firebase/firestore'
import M from 'materialize-css'

export default {
  name: 'GameRoom',
  components: {
    NavbarInRoom,
    TurnBar,
    ResourcePairTile,
    TokenMarket,
    OwnTeamBar,
    TeamSheet,
    GameLogPanel,
    ResourceCard,
    ContractCard,
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

    const upcomingOpen = ref(false)
    const logOpen = ref(false)
    const lastSeenLogCount = ref(0)

    const isDesktop = ref(window.innerWidth >= 900)

    const handleResize = () => {
      isDesktop.value = window.innerWidth >= 900
    }

    onMounted(() => {
      M.AutoInit()
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })

    // Log Entry Helper (§6.3)
    const logEntry = (type, text, detail = {}) => ({
      turn: gameData.value?.turnNumber || 1,
      seat: activePlayer.value ? activePlayer.value.seat : 1,
      name: activePlayer.value ? (activePlayer.value.joined ? activePlayer.value.name : `Seat ${activePlayer.value.seat}`) : 'Player',
      type,
      text,
      detail,
      ts: Date.now()
    })

    const getUpdatedLog = (newEntry) => {
      const currentLog = Array.isArray(gameData.value?.gameLog) ? gameData.value.gameLog : []
      const combined = [...currentLog, newEntry]
      return combined.slice(-300) // Cap at 300 entries
    }

    const unreadLogCount = computed(() => {
      const currentCount = (gameData.value?.gameLog || []).length
      if (logOpen.value) {
        return 0
      }
      return Math.max(0, currentCount - lastSeenLogCount.value)
    })

    const openLogPanel = () => {
      logOpen.value = true
      lastSeenLogCount.value = (gameData.value?.gameLog || []).length
    }

    const closeLogPanel = () => {
      logOpen.value = false
      lastSeenLogCount.value = (gameData.value?.gameLog || []).length
    }

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

      const joinEntry = {
        turn: gameData.value?.turnNumber || 1,
        seat: seatNum,
        name: name,
        type: 'SEAT_JOIN',
        text: 'joined the game',
        detail: {},
        ts: Date.now()
      }
      const updatedLog = getUpdatedLog(joinEntry)

      updateDoc(roomDocRef, {
        players: updatedPlayers,
        gameLog: updatedLog
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

    const ownPlayer = computed(() => {
      if (!gameData.value || !gameData.value.players) return null
      if (role.value === 'PLAYER' && seat.value) {
        return gameData.value.players[seat.value - 1] || null
      }
      return null
    })

    const otherPlayers = computed(() => {
      if (!gameData.value || !gameData.value.players) return []
      const max = parseInt(gameData.value.numPlayers) || 4
      const activeList = gameData.value.players.slice(0, max)
      if (ownPlayer.value) {
        return activeList.filter(p => p.seat !== ownPlayer.value.seat)
      }
      return activeList
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

    const tokenTakenGreen = computed(() => activePlayer.value?.scores.greenTokenTaken)
    const tokenTakenRed = computed(() => activePlayer.value?.scores.redTokenTaken)
    const tokenTakenYellow = computed(() => activePlayer.value?.scores.yellowTokenTaken)
    const tokenTakenPurple = computed(() => activePlayer.value?.scores.purpleTokenTaken)
    const tokenTakenBlack = computed(() => activePlayer.value?.scores.blackTokenTaken)

    const affordZoomedCard = computed(() => {
      if (!activePlayer.value || !zoomedCard.value) return false
      const scores = activePlayer.value.scores
      const card = zoomedCard.value

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

    const nextPlayer = () => {
      const numPlayers = parseInt(gameData.value.numPlayers) || 4
      const winScore = parseInt(gameData.value.reserve) || 15
      const currentPScore = activePlayer.value.scores

      let winPoints = false
      let winContracts = false

      if (gameData.value.rules === 'points') {
        if (currentPScore.value >= winScore) winPoints = true
      } else if (gameData.value.rules === 'contracts') {
        if (gameData.value.z00contractCards.length === 0) winContracts = true
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

      const turnEndEntry = logEntry('TURN_END', 'ended their turn')
      const updatedLog = getUpdatedLog(turnEndEntry)
      const currentTurn = gameData.value?.turnNumber || 1

      updateDoc(roomDocRef, {
        players: updatedPlayers,
        currentPlayer: nextSeat,
        turnNumber: currentTurn + 1,
        gameLog: updatedLog
      })
    }

    const BuyPermResource = (card) => {
      if (!activePlayer.value) return
      const scores = activePlayer.value.scores

      const greenTokensAdjust = Math.max(0, card.CostGreen - scores.greenPerm)
      const redTokensAdjust = Math.max(0, card.CostRed - scores.redPerm)
      const yellowTokensAdjust = Math.max(0, card.CostYellow - scores.yellowPerm)
      const purpleTokensAdjust = Math.max(0, card.CostPurple - scores.purplePerm)
      const blackTokensAdjust = Math.max(0, card.CostBlack - scores.blackPerm)
      const totalTempSpent = greenTokensAdjust + redTokensAdjust + yellowTokensAdjust + purpleTokensAdjust + blackTokensAdjust

      const updatedPlayers = JSON.parse(JSON.stringify(gameData.value.players))
      const pCopy = updatedPlayers[gameData.value.currentPlayer]

      pCopy.scores.production += card.Production

      if (card.Colour === 'green') pCopy.scores.greenPerm += 1
      else if (card.Colour === 'yellow') pCopy.scores.yellowPerm += 1
      else if (card.Colour === 'red') pCopy.scores.redPerm += 1
      else if (card.Colour === 'purple') pCopy.scores.purplePerm += 1
      else if (card.Colour === 'black') pCopy.scores.blackPerm += 1

      pCopy.scores.greenTemp -= greenTokensAdjust
      pCopy.scores.redTemp -= redTokensAdjust
      pCopy.scores.yellowTemp -= yellowTokensAdjust
      pCopy.scores.purpleTemp -= purpleTokensAdjust
      pCopy.scores.blackTemp -= blackTokensAdjust

      const color = card.Colour
      const categoryMap = {
        green: 'Property',
        yellow: 'Equipment',
        red: 'People',
        purple: 'Operations',
        black: 'Outsource'
      }
      const categoryName = categoryMap[color.toLowerCase()] || color.toUpperCase()

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

      let text = `bought a ${categoryName} card (+${card.Production} prod)`
      if (totalTempSpent > 0) {
        text += `, paying with ${totalTempSpent} temp token${totalTempSpent > 1 ? 's' : ''}`
      }
      const actionText = `${pCopy.name} ${text}`

      const entry = logEntry('BUY_PERM', text, { colour: categoryName, ref: card.Ref })
      const updatedLog = getUpdatedLog(entry)

      updateDoc(roomDocRef, {
        z08marketGreenTokens: gameData.value.z08marketGreenTokens + greenTokensAdjust,
        z07marketRedTokens: gameData.value.z07marketRedTokens + redTokensAdjust,
        z09marketYellowTokens: gameData.value.z09marketYellowTokens + yellowTokensAdjust,
        z10marketPurpleTokens: gameData.value.z10marketPurpleTokens + purpleTokensAdjust,
        z11marketBlackTokens: gameData.value.z11marketBlackTokens + blackTokensAdjust,
        players: updatedPlayers,
        [marketKey]: marketCards,
        lastAction: actionText,
        gameLog: updatedLog
      }).then(() => {
        M.toast({ html: `Bought a ${categoryName} card` })
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

      const text = `completed a contract worth ${card.Value} points`
      const actionText = `${pCopy.name} ${text}`
      const entry = logEntry('BUY_CONTRACT', text, { ref: card.Ref, value: card.Value })
      const updatedLog = getUpdatedLog(entry)

      updateDoc(roomDocRef, {
        players: updatedPlayers,
        z00contractCards: contractCards,
        lastAction: actionText,
        gameLog: updatedLog
      }).then(() => {
        M.toast({ html: `Completed a Contract!` })
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

          const text = `bought 2 ${colour.toUpperCase()} tokens`
          const actionText = `${pCopy.name} ${text}`
          const entry = logEntry('TOKENS_2', text, { colour })
          const updatedLog = getUpdatedLog(entry)

          updateDoc(roomDocRef, {
            [marketField]: marketCount - 2,
            players: updatedPlayers,
            lastAction: actionText,
            gameLog: updatedLog
          }).then(() => {
            M.toast({ html: `Bought 2 ${colour} tokens` })
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

          const counter = pCopy.scores.TempTokensTakenCounter
          const text = `bought 1 ${colour.toUpperCase()} token (${counter}/3)`
          const actionText = `${pCopy.name} ${text}`

          const entry = logEntry('TOKEN_1', text, { colour })
          const updatedLog = getUpdatedLog(entry)

          const finishedTurn = counter === 3

          updateDoc(roomDocRef, {
            [marketField]: marketCount - 1,
            players: updatedPlayers,
            lastAction: actionText,
            gameLog: updatedLog
          }).then(() => {
            M.toast({ html: `Bought 1 ${colour} token (${counter}/3)` })
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

    return {
      role,
      seat,
      gameData,
      error,
      ModalTempResources,
      ModalGameEndPoints,
      ModalGameEndContracts,
      displayedPlayers,
      ownPlayer,
      otherPlayers,
      activePlayerName,
      isMyTurn,
      hasJoinedAnySeat,
      isSpectator,
      isDesktop,
      upcomingOpen,
      logOpen,
      unreadLogCount,
      openLogPanel,
      closeLogPanel,
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
.game-room-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: #212121;
}

.game-layout-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 12px;
  gap: 16px;
  padding-bottom: 90px; /* space for sticky footer elements */
}

/* Desktop layout (>=900px) */
.game-layout-container.desktop-layout {
  flex-direction: row;
  padding-bottom: 24px;
  max-width: 1300px;
  margin: 0 auto;
  width: 100%;
}

.board-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.teams-column {
  width: 100%;
}

.desktop-layout .teams-column {
  width: 320px;
  flex-shrink: 0;
}

.section-label {
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

/* Contracts Row Horizontal Scroll */
.contracts-section {
  display: flex;
  flex-direction: column;
}

.contracts-scroll-row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.contracts-scroll-row::-webkit-scrollbar {
  display: none;
}

.contracts-scroll-row > * {
  scroll-snap-align: start;
  flex-shrink: 0;
}

/* Resource Pairs 2-col Grid */
.resource-pairs-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media only screen and (max-width: 500px) {
  .resource-pairs-grid {
    grid-template-columns: 1fr;
  }
}

/* Upcoming Cards Section */
.upcoming-section {
  margin-top: 4px;
}

.upcoming-toggle-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px dashed rgba(255, 255, 255, 0.4);
  color: #ffffff;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s;
}

.upcoming-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.upcoming-cards-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 8px;
}

/* Acquire Modal Single-Column List */
.acquire-modal-card {
  max-width: 480px;
}

.acquire-color-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 380px;
  overflow-y: auto;
}

.acquire-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 8px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.token-mini-img {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.item-actions {
  display: flex;
  gap: 6px;
}

.item-actions button {
  border-radius: 4px;
  font-weight: 600;
}
</style>
