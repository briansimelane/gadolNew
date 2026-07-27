<template>
  <div class="container-fluid grey lighten-4" style="min-height: 100vh;">
    <NavbarLoggedIn />

    <div class="container" style="padding-top: 20px;">
      <h3 class="teal-text text-darken-4 center fontImpact" style="margin-bottom: 30px;">Facilitator & Admin Dashboard</h3>

      <div class="row">
        <!-- Create Game Panel -->
        <div class="col s12 m4">
          <div class="card white">
            <div class="card-content">
              <span class="card-title teal-text text-darken-4 bold" style="display: flex; align-items: center;">
                <i class="material-icons left">add_circle</i>Create Game
              </span>
              <p class="grey-text" style="font-size: 0.9rem; margin-bottom: 20px;">
                Initialize a new simulation room with unique access codes.
              </p>

              <form @submit.prevent="handleCreateGame">
                <div class="input-field col s12 no-padding">
                  <input id="roomName" type="text" v-model="roomName" required>
                  <label for="roomName">Game / Room Name</label>
                </div>

                <div class="input-field col s12 no-padding">
                  <select id="numberPlayers" v-model="numberPlayers" class="browser-default" required style="margin-top: 5px; margin-bottom: 15px;">
                    <option value="" disabled selected>Number of Players</option>
                    <option value="2">2 Players</option>
                    <option value="3">3 Players</option>
                    <option value="4">4 Players</option>
                  </select>
                </div>

                <div class="input-field col s12 no-padding">
                  <select id="gameWinCondition" v-model="gameWinCondition" class="browser-default" required style="margin-top: 5px; margin-bottom: 15px;">
                    <option value="" disabled selected>Win Condition / Rules</option>
                    <option value="points">First to 15 points (Production)</option>
                    <option value="contracts">Contracts Completion</option>
                  </select>
                </div>

                <div class="input-field col s12 no-padding">
                  <select id="gameTimed" v-model="gameTimed" class="browser-default" required style="margin-top: 5px; margin-bottom: 15px;">
                    <option value="" disabled selected>Timed Game</option>
                    <option value="no">No Timer</option>
                    <option value="yes">Timed Game</option>
                  </select>
                </div>

                <div v-if="gameTimed === 'yes'" class="input-field col s12 no-padding">
                  <select id="turnDurationSeconds" v-model="turnDurationSeconds" class="browser-default" required style="margin-top: 5px; margin-bottom: 15px;">
                    <option value="" disabled>Turn Duration</option>
                    <option value="30">30 seconds per turn</option>
                    <option value="60">60 seconds (1 min)</option>
                    <option value="90">90 seconds (1.5 min)</option>
                    <option value="120">120 seconds (2 min)</option>
                    <option value="180">180 seconds (3 min)</option>
                    <option value="300">300 seconds (5 min)</option>
                  </select>
                </div>

                <div class="input-field col s12 no-padding">
                  <select id="gameReserve" v-model="gameReserve" class="browser-default" required style="margin-top: 5px; margin-bottom: 20px;">
                    <option value="" disabled selected>Reserve Game</option>
                    <option value="no">No Reserve</option>
                    <option value="yes">Reserve</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  class="btn-large waves-effect waves-light teal darken-3 btn-block"
                  :disabled="creating"
                >
                  <i class="material-icons left">cloud_upload</i>Create Game
                </button>
              </form>
            </div>
          </div>
        </div>

        <!-- Games Dashboard & Lists -->
        <div class="col s12 m8">
          <!-- Newly Created Game Access Codes Alert -->
          <div v-if="newlyCreatedGame" class="card teal lighten-5 border-teal">
            <div class="card-content teal-text text-darken-4">
              <span class="card-title bold"><i class="material-icons left">check_circle</i>Game Created Successfully!</span>
              <p>Please copy and share the codes below with your students/players:</p>
              
              <div style="margin-top: 15px; background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #b2dfdb;">
                <div style="margin-bottom: 8px;">
                  <strong>Room Name:</strong> {{ newlyCreatedGame.name }}
                </div>
                <div style="margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                  <span><strong>Facilitator Code:</strong> <code class="code-badge">{{ newlyCreatedGame.facilitatorCode }}</code></span>
                  <button class="btn-flat btn-small" @click="copyText(newlyCreatedGame.facilitatorCode)">
                    <i class="material-icons teal-text">content_copy</i>
                  </button>
                </div>
                <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
                  <span><strong>Spectator Code:</strong> <code class="code-badge">{{ newlyCreatedGame.spectatorCode || 'SPEC-XXXX' }}</code></span>
                  <button class="btn-flat btn-small" @click="copyText(newlyCreatedGame.spectatorCode)">
                    <i class="material-icons teal-text">content_copy</i>
                  </button>
                </div>
                <hr style="border-top: 1px solid #e0e0e0;">
                <div v-for="seatNum in parseInt(newlyCreatedGame.numPlayers)" :key="seatNum" style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
                  <span><strong>Team {{ seatNum }} Code:</strong> <code class="code-badge">{{ newlyCreatedGame.seatCodes[seatNum] }}</code></span>
                  <button class="btn-flat btn-small" @click="copyText(newlyCreatedGame.seatCodes[seatNum])">
                    <i class="material-icons teal-text">content_copy</i>
                  </button>
                </div>
              </div>

              <div class="right-align" style="margin-top: 15px;">
                <button class="btn waves-effect waves-light teal darken-3" @click="newlyCreatedGame = null">Dismiss</button>
              </div>
            </div>
          </div>

          <!-- Games List Card -->
          <div class="card white">
            <div class="card-content">
              <span class="card-title teal-text text-darken-4 bold"><i class="material-icons left">list</i>Active Games</span>
              <p class="grey-text" style="font-size: 0.9rem; margin-bottom: 20px;">
                Active rooms created by you (Admins view all games).
              </p>

              <div v-if="loadingGames" class="center" style="padding: 20px 0;">
                <div class="preloader-wrapper small active">
                  <div class="spinner-layer spinner-teal-only">
                    <div class="circle-clipper left"><div class="circle"></div></div>
                    <div class="gap-patch"><div class="circle"></div></div>
                    <div class="circle-clipper right"><div class="circle"></div></div>
                  </div>
                </div>
              </div>

              <div v-else-if="games.length === 0" class="center grey-text text-darken-1" style="padding: 40px 0;">
                <i class="material-icons large">games</i>
                <p>No active games. Create one using the form on the left.</p>
              </div>

              <ul v-else class="collapsible popout">
                <li v-for="game in games" :key="game.id">
                  <div class="collapsible-header teal lighten-5 teal-text text-darken-4" style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <i class="material-icons">room</i>
                      <span class="bold">{{ game.name }}</span>
                      <span class="chip white">{{ game.numPlayers }} Players</span>
                      <span class="chip white">{{ game.rules }} rules</span>
                    </div>
                    <span class="grey-text text-darken-1" style="font-size: 0.8rem;">{{ formatDate(game.createdAt) }}</span>
                  </div>
                  <div class="collapsible-body white">
                    <!-- Facilitator & Spectator Codes -->
                    <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
                      <div style="flex: 1; min-width: 240px; display: flex; align-items: center; justify-content: space-between; background: #f5f5f5; padding: 10px; border-radius: 4px;">
                        <span><strong>Facilitator Code:</strong> <code class="code-badge">{{ game.facilitatorCode }}</code></span>
                        <button class="btn-small waves-effect waves-light teal darken-2" @click="copyText(game.facilitatorCode)">
                          <i class="material-icons left">content_copy</i>Copy
                        </button>
                      </div>
                      <div style="flex: 1; min-width: 240px; display: flex; align-items: center; justify-content: space-between; background: #e0f2f1; padding: 10px; border-radius: 4px;">
                        <span><strong>Spectator Code:</strong> <code class="code-badge">{{ game.spectatorCode || 'SPEC-' + game.id.substring(0,4).toUpperCase() }}</code></span>
                        <button class="btn-small waves-effect waves-light teal darken-2" @click="copyText(game.spectatorCode || 'SPEC-' + game.id.substring(0,4).toUpperCase())">
                          <i class="material-icons left">content_copy</i>Copy
                        </button>
                      </div>
                    </div>

                    <!-- Team Codes Table -->
                    <table class="striped responsive-table">
                      <thead>
                        <tr>
                          <th>Team</th>
                          <th>Access Code</th>
                          <th>Team Status</th>
                          <th class="center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="seatNum in parseInt(game.numPlayers)" :key="seatNum">
                          <td><strong>Team {{ seatNum }}</strong></td>
                          <td><code class="code-badge">{{ game.seatCodes[seatNum] }}</code></td>
                          <td>
                            <span v-if="game.players[seatNum - 1] && game.players[seatNum - 1].joined" class="green-text text-darken-2 bold">
                              Joined: {{ game.players[seatNum - 1].name }}
                            </span>
                            <span v-else class="grey-text">Waiting...</span>
                          </td>
                          <td class="center">
                            <button class="btn-flat" @click="copyText(game.seatCodes[seatNum])" title="Copy seat code">
                              <i class="material-icons teal-text">content_copy</i>
                            </button>
                            <button class="btn-flat" @click="handleRegenerateCode(game.id, seatNum)" title="Regenerate code">
                              <i class="material-icons orange-text">refresh</i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <!-- Timed Game Quick Time & Timer Controls -->
                    <div v-if="game.timed === 'yes' || game.timed === true" style="margin-top: 15px; padding: 12px; background: #fff3e0; border-left: 4px solid #ff9800; border-radius: 4px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                      <div>
                        <strong style="color: #e65100; display: flex; align-items: center; gap: 4px;">
                          <i class="material-icons tiny">timer</i> Timed Game ({{ game.turnDurationSeconds || 60 }}s / turn)
                        </strong>
                        <span style="font-size: 0.85rem; color: #ef6c00;">
                          Status: <strong>{{ getTimerStatusLabel(game) }}</strong>
                        </span>
                      </div>
                      <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                        <!-- Primary Timer Control -->
                        <button 
                          v-if="!game.gameStarted && (game.timerStatus === 'paused' || game.timerStatus === 'not_started' || !game.timerStatus)" 
                          class="btn-small waves-effect waves-light green darken-2 bold" 
                          @click="handleStartTimer(game)"
                        >
                          <i class="material-icons left">play_arrow</i>Start Game
                        </button>
                        <button 
                          v-else-if="game.timerStatus === 'running'" 
                          class="btn-small waves-effect waves-light amber darken-3" 
                          @click="handlePauseTimer(game)"
                        >
                          <i class="material-icons left">pause</i>Pause Timer
                        </button>
                        <button 
                          v-else-if="game.timerStatus === 'paused'" 
                          class="btn-small waves-effect waves-light green darken-3" 
                          @click="handleResumeTimer(game)"
                        >
                          <i class="material-icons left">play_arrow</i>Resume Timer
                        </button>

                        <!-- Adjust Time Buttons (+30s, +60s, -30s, -60s) -->
                        <div style="display: inline-flex; gap: 4px; border-left: 1px solid rgba(255,152,0,0.4); padding-left: 6px; margin-left: 4px;">
                          <button class="btn-small waves-effect waves-light orange darken-2" @click="handleAdjustTurnTime(game, 30)" title="Add 30 seconds">
                            +30s
                          </button>
                          <button class="btn-small waves-effect waves-light orange darken-4" @click="handleAdjustTurnTime(game, 60)" title="Add 60 seconds">
                            +60s
                          </button>
                          <button class="btn-small waves-effect waves-light blue-grey darken-2" @click="handleAdjustTurnTime(game, -30)" title="Remove 30 seconds">
                            -30s
                          </button>
                          <button class="btn-small waves-effect waves-light blue-grey darken-3" @click="handleAdjustTurnTime(game, -60)" title="Remove 60 seconds">
                            -60s
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Open and Delete Actions -->
                    <div class="right-align" style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
                      <button class="btn waves-effect waves-light red darken-3" @click="handleDeleteGame(game.id, game.name)">
                        <i class="material-icons left">delete</i>Delete Game
                      </button>
                      <button class="btn waves-effect waves-light teal darken-4" @click="handleOpenGame(game.id)">
                        <i class="material-icons left">launch</i>Open Game Room
                      </button>
                    </div>
                  </div>
                </li>
              </ul>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc, getDocs } from 'firebase/firestore'
import { projectFirestore, projectAuth } from '../firebase/config'
import NavbarLoggedIn from '../components/NavbarLoggedIn.vue'
import useSession from '../composables/useSession'
import useCreateGame from '../composables/useCreateGame'
import M from 'materialize-css'

export default {
  name: 'FacilitatorHub',
  components: { NavbarLoggedIn },
  setup() {
    const router = useRouter()
    const { userEmail, role, setRoomId } = useSession()
    const { createGame } = useCreateGame()

    const roomName = ref('')
    const numberPlayers = ref('')
    const gameTimed = ref('')
    const turnDurationSeconds = ref(60)
    const gameReserve = ref('')
    const gameWinCondition = ref('')

    const creating = ref(false)
    const loadingGames = ref(true)
    const games = ref([])
    const newlyCreatedGame = ref(null)

    let unsubGames = null

    const randAlpha4 = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      let result = ''
      for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }

    onMounted(() => {
      M.AutoInit()

      // Fetch games
      let q
      if (role.value === 'ADMIN') {
        q = query(collection(projectFirestore, 'rooms'), where('status', '==', 'OPEN'))
      } else {
        const currentUid = projectAuth.currentUser ? projectAuth.currentUser.uid : ''
        q = query(
          collection(projectFirestore, 'rooms'),
          where('status', '==', 'OPEN'),
          where('creator', '==', currentUid)
        )
      }

      unsubGames = onSnapshot(q, (snapshot) => {
        const docs = []
        snapshot.forEach((docSnap) => {
          docs.push({ id: docSnap.id, ...docSnap.data() })
        })
        // Sort by createdAt descending
        docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        games.value = docs
        loadingGames.value = false

        // Re-init collapsible when list changes
        setTimeout(() => {
          const elems = document.querySelectorAll('.collapsible')
          M.Collapsible.init(elems, {})
        }, 100)
      }, (err) => {
        console.error('Error fetching rooms snapshot:', err)
        loadingGames.value = false
      })
    })

    onUnmounted(() => {
      if (unsubGames) unsubGames()
    })

    const handleCreateGame = async () => {
      if (creating.value) return
      creating.value = true

      const currentUser = projectAuth.currentUser
      const currentUid = (currentUser && currentUser.uid) ? currentUser.uid : 'ADMIN-MASTER-UID'
      const currentEmail = userEmail.value || (currentUser && currentUser.email) || 'admin@master.com'
      const currentName = role.value === 'ADMIN' 
        ? 'Master Admin' 
        : (currentEmail && currentEmail.includes('@') ? currentEmail.split('@')[0] : 'Facilitator')

      const res = await createGame(
        roomName.value,
        parseInt(numberPlayers.value),
        gameTimed.value,
        gameReserve.value,
        gameWinCondition.value,
        currentUid,
        currentEmail,
        currentName,
        turnDurationSeconds.value
      )

      creating.value = false

      if (res.success) {
        newlyCreatedGame.value = res.data
        roomName.value = ''
        numberPlayers.value = ''
        gameTimed.value = ''
        turnDurationSeconds.value = 60
        gameReserve.value = ''
        gameWinCondition.value = ''
        M.toast({ html: 'Game room initialized!' })
      } else {
        M.toast({ html: `Creation failed: ${res.message}` })
      }
    }

    const getTimerStatusLabel = (game) => {
      if (!game.gameStarted && (game.timerStatus === 'paused' || game.timerStatus === 'not_started' || !game.timerStatus)) {
        return 'Not Started (Paused)'
      }
      if (game.timerStatus === 'paused') return 'Paused'
      if (game.timerStatus === 'running') return 'Running'
      return 'Completed'
    }

    const handleStartTimer = async (game) => {
      try {
        const roomRef = doc(projectFirestore, 'rooms', game.id)
        const durationSec = parseInt(game.turnDurationSeconds) || 60
        const deadline = Date.now() + (durationSec * 1000)

        await updateDoc(roomRef, {
          timerStatus: 'running',
          gameStarted: true,
          turnDeadline: deadline,
          turnRemainingMs: durationSec * 1000
        })
        M.toast({ html: `Game started for ${game.name}!` })
      } catch (err) {
        console.error('Error starting timer:', err)
        M.toast({ html: 'Failed to start game' })
      }
    }

    const handlePauseTimer = async (game) => {
      try {
        const roomRef = doc(projectFirestore, 'rooms', game.id)
        const currentDeadline = game.turnDeadline || Date.now()
        const remaining = Math.max(0, currentDeadline - Date.now())

        await updateDoc(roomRef, {
          timerStatus: 'paused',
          turnRemainingMs: remaining
        })
        M.toast({ html: `Timer paused for ${game.name}` })
      } catch (err) {
        console.error('Error pausing timer:', err)
        M.toast({ html: 'Failed to pause timer' })
      }
    }

    const handleResumeTimer = async (game) => {
      try {
        const roomRef = doc(projectFirestore, 'rooms', game.id)
        const durationSec = parseInt(game.turnDurationSeconds) || 60
        const remaining = (typeof game.turnRemainingMs === 'number' && game.turnRemainingMs > 0) 
          ? game.turnRemainingMs 
          : (durationSec * 1000)
        const newDeadline = Date.now() + remaining

        await updateDoc(roomRef, {
          timerStatus: 'running',
          turnDeadline: newDeadline
        })
        M.toast({ html: `Timer resumed for ${game.name}` })
      } catch (err) {
        console.error('Error resuming timer:', err)
        M.toast({ html: 'Failed to resume timer' })
      }
    }

    const handleAdjustTurnTime = async (game, secondsDelta) => {
      try {
        const roomRef = doc(projectFirestore, 'rooms', game.id)
        const isRunning = game.timerStatus === 'running'

        if (isRunning) {
          const currentDeadline = game.turnDeadline || Date.now()
          const baseTime = currentDeadline > Date.now() ? currentDeadline : Date.now()
          const newDeadline = Math.max(Date.now(), baseTime + (secondsDelta * 1000))

          await updateDoc(roomRef, {
            turnDeadline: newDeadline
          })
        } else {
          const currentRemaining = typeof game.turnRemainingMs === 'number' 
            ? game.turnRemainingMs 
            : ((parseInt(game.turnDurationSeconds) || 60) * 1000)
          const newRemaining = Math.max(0, currentRemaining + (secondsDelta * 1000))

          await updateDoc(roomRef, {
            turnRemainingMs: newRemaining
          })
        }

        const label = secondsDelta > 0 ? `+${secondsDelta}s` : `${secondsDelta}s`
        M.toast({ html: `Adjusted turn timer by ${label} for ${game.name}` })
      } catch (err) {
        console.error('Error adjusting time:', err)
        M.toast({ html: 'Failed to adjust turn timer' })
      }
    }

    const copyText = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        M.toast({ html: `Code copied to clipboard: ${text}` })
      }).catch(err => {
        console.error('Copy failed:', err)
      })
    }

    const handleRegenerateCode = async (gameId, seatNum) => {
      if (!confirm(`Are you sure you want to regenerate the code for Team ${seatNum}? This will invalidate the previous code.`)) {
        return
      }

      try {
        const roomsSnap = await getDocs(query(collection(projectFirestore, 'rooms'), where('status', '==', 'OPEN')))
        const existingCodes = new Set()
        roomsSnap.forEach(d => {
          const r = d.data()
          if (r.facilitatorCode) existingCodes.add(r.facilitatorCode)
          if (r.seatCodes) Object.values(r.seatCodes).forEach(c => existingCodes.add(c))
        })

        let newCode = ''
        do {
          newCode = `P${seatNum}-${randAlpha4()}`
        } while (existingCodes.has(newCode))

        const roomRef = doc(projectFirestore, 'rooms', gameId)
        await updateDoc(roomRef, {
          [`seatCodes.${seatNum}`]: newCode
        })
        M.toast({ html: `Team ${seatNum} code updated to: ${newCode}` })
      } catch (err) {
        console.error('Error updating code:', err)
        M.toast({ html: 'Regeneration failed.' })
      }
    }

    const handleDeleteGame = async (gameId, name) => {
      if (!confirm(`Are you sure you want to delete the game room "${name}"? This action cannot be undone.`)) {
        return
      }

      try {
        await deleteDoc(doc(projectFirestore, 'rooms', gameId))
        M.toast({ html: `Game room deleted: ${name}` })
      } catch (err) {
        console.error('Error deleting game:', err)
        M.toast({ html: 'Deletion failed.' })
      }
    }

    const handleOpenGame = (gameId) => {
      // Bind game room to facilitator session
      const { roomId } = useSession()
      roomId.value = gameId
      localStorage.setItem('gadol_room_id', gameId)

      router.push({ name: 'GameRoom', params: { id: gameId } })
    }

    const formatDate = (dateStr) => {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    return {
      roomName,
      numberPlayers,
      gameTimed,
      turnDurationSeconds,
      gameReserve,
      gameWinCondition,
      creating,
      loadingGames,
      games,
      newlyCreatedGame,
      handleCreateGame,
      getTimerStatusLabel,
      handleStartTimer,
      handlePauseTimer,
      handleResumeTimer,
      handleAdjustTurnTime,
      copyText,
      handleRegenerateCode,
      handleDeleteGame,
      handleOpenGame,
      formatDate
    }
  }
}
</script>

<style scoped>
.bold {
  font-weight: bold;
}
.btn-block {
  width: 100%;
}
.no-padding {
  padding: 0 !important;
}
.border-teal {
  border: 1px solid #b2dfdb;
}
.code-badge {
  background: #eeeeee;
  color: #c62828;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: bold;
}
</style>
