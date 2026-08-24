<template>
  <div class="turn-bar" :style="barStyle">
    <div class="turn-info">
      <span class="room-tag" v-if="roomName" :title="roomName">
        <i class="material-icons tiny">meeting_room</i>
        <span class="room-name-text">{{ roomName }}</span>
      </span>
      <i class="material-icons turn-icon">play_circle_filled</i>
      <span class="turn-text">
        <strong>{{ activePlayerName }}</strong>'s turn
        <span v-if="isMyTurn && !isFacilitator && !isSpectator" class="my-turn-tag">— You</span>
      </span>

      <!-- Timed Game Status & Facilitator Quick Controls -->
      <div v-if="isTimed" class="timer-section">
        <div 
          class="turn-timer-chip"
          :class="{ 
            'timer-low': timerStatus === 'running' && remainingSeconds <= 10, 
            'timer-paused': timerStatus === 'paused',
            'timer-not-started': timerStatus === 'not_started'
          }"
          :title="'Timer status: ' + timerStatus"
        >
          <i class="material-icons tiny" v-if="timerStatus === 'paused'">pause_circle_filled</i>
          <i class="material-icons tiny" v-else-if="timerStatus === 'not_started'">timer_off</i>
          <i class="material-icons tiny" v-else>timer</i>
          
          <span class="timer-text" v-if="timerStatus === 'not_started'">Not Started</span>
          <span class="timer-text" v-else-if="timerStatus === 'paused'">Paused ({{ formattedTimer }})</span>
          <span class="timer-text" v-else>{{ formattedTimer }}</span>
        </div>

        <!-- Quick Facilitator Controls inside TurnBar -->
        <div v-if="isFacilitator" class="facilitator-timer-controls">
          <button 
            v-if="!gameStarted" 
            class="timer-ctrl-btn start" 
            @click="$emit('startTimer')"
            title="Start game turn timer"
          >
            <i class="material-icons tiny">play_arrow</i>Start Game
          </button>
          <button 
            v-else-if="timerStatus === 'running'" 
            class="timer-ctrl-btn pause" 
            @click="$emit('pauseTimer')"
            title="Pause game turn timer"
          >
            <i class="material-icons tiny">pause</i>Pause
          </button>
          <button 
            v-else-if="timerStatus === 'paused'" 
            class="timer-ctrl-btn resume" 
            @click="$emit('resumeTimer')"
            title="Resume game turn timer"
          >
            <i class="material-icons tiny">play_arrow</i>Resume
          </button>

          <!-- In-game time adjustment pills for Facilitator -->
          <div class="timer-adjust-group">
            <button class="timer-adjust-btn add" @click="$emit('adjustTime', 30)" title="Add 30 seconds">+30s</button>
            <button class="timer-adjust-btn add" @click="$emit('adjustTime', 60)" title="Add 60 seconds">+60s</button>
            <button class="timer-adjust-btn sub" @click="$emit('adjustTime', -30)" title="Remove 30 seconds">-30s</button>
            <button class="timer-adjust-btn sub" @click="$emit('adjustTime', -60)" title="Remove 60 seconds">-60s</button>
          </div>

          <!-- Remove Timer Button -->
          <button 
            class="timer-ctrl-btn remove-timer" 
            @click="$emit('toggleTimer')"
            title="Remove turn timer from this game"
          >
            <i class="material-icons tiny">timer_off</i>Remove Timer
          </button>
        </div>
      </div>

      <!-- Add Timer Option for Untimed Games -->
      <div v-else-if="!isTimed && isFacilitator" class="add-timer-section">
        <button 
          class="timer-ctrl-btn add-timer" 
          @click="$emit('toggleTimer')"
          title="Enable turn timer for this game"
        >
          <i class="material-icons tiny">timer</i>Add Timer
        </button>
      </div>

      <span v-if="isFacilitator" class="role-badge facilitator">Facilitator</span>
      <span v-if="isSpectator" class="role-badge spectator">Spectator</span>

      <button 
        v-if="isFacilitator" 
        class="timer-ctrl-btn grant-card-btn" 
        @click="$emit('openFacilitatorGrant')"
        title="Facilitator: Allocate Free Resource Card to Team"
      >
        <i class="material-icons tiny">add_card</i>Allocate Card
      </button>
    </div>

    <div class="turn-bar-actions">
      <button class="financials-btn" @click="$emit('openFinancials')" title="View Financial Statements" aria-label="Financial statements">
        <i class="material-icons">assessment</i>
        <span class="btn-label hide-on-small-only">Financials</span>
      </button>

      <button class="log-btn" @click="$emit('openLog')" title="View Game Log" aria-label="Game log">
        <i class="material-icons">history</i>
        <span class="log-btn-label">Game Log</span>
        <span v-if="unreadCount > 0" class="log-unread-badge">{{ unreadCount }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

export default {
  name: 'TurnBar',
  props: {
    roomName: {
      type: String,
      default: ''
    },
    activePlayerName: {
      type: String,
      default: 'Player'
    },
    isMyTurn: {
      type: Boolean,
      default: false
    },
    isFacilitator: {
      type: Boolean,
      default: false
    },
    isSpectator: {
      type: Boolean,
      default: false
    },
    activeSeat: {
      type: Number,
      default: 1
    },
    unreadCount: {
      type: Number,
      default: 0
    },
    isTimed: {
      type: Boolean,
      default: false
    },
    gameStarted: {
      type: Boolean,
      default: false
    },
    timerStatus: {
      type: String,
      default: 'not_started'
    },
    turnDeadline: {
      type: Number,
      default: 0
    },
    turnRemainingMs: {
      type: Number,
      default: 0
    },
    turnDurationSeconds: {
      type: Number,
      default: 60
    }
  },
  emits: ['openLog', 'openFinancials', 'openFacilitatorGrant', 'startTimer', 'pauseTimer', 'resumeTimer', 'adjustTime', 'toggleTimer'],
  setup(props) {
    const nowMs = ref(Date.now())
    let timerInterval = null

    onMounted(() => {
      timerInterval = setInterval(() => {
        nowMs.value = Date.now()
      }, 500)
    })

    onUnmounted(() => {
      if (timerInterval) clearInterval(timerInterval)
    })

    const remainingSeconds = computed(() => {
      if (!props.isTimed) return 0
      if (props.timerStatus === 'paused') {
        return Math.max(0, Math.ceil((props.turnRemainingMs || 0) / 1000))
      }
      if (props.timerStatus === 'not_started') {
        return props.turnDurationSeconds || 60
      }
      if (!props.turnDeadline) return 0
      return Math.max(0, Math.ceil((props.turnDeadline - nowMs.value) / 1000))
    })

    const formattedTimer = computed(() => {
      const s = remainingSeconds.value
      const mins = Math.floor(s / 60)
      const secs = s % 60
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    })

    const barStyle = computed(() => {
      const seatNum = props.activeSeat || 1
      const tints = {
        1: { bg: '#FAEEDA', border: '#BA7517', text: '#633806' },
        2: { bg: '#EAF3DE', border: '#639922', text: '#27500A' },
        3: { bg: '#E3F2FD', border: '#185FA5', text: '#0D47A1' },
        4: { bg: '#FBE9E7', border: '#D85A30', text: '#BF360C' }
      }
      const t = tints[seatNum] || tints[1]
      return {
        backgroundColor: t.bg,
        borderBottom: `2px solid ${t.border}`,
        color: t.text
      }
    })

    return { 
      barStyle,
      remainingSeconds,
      formattedTimer
    }
  }
}
</script>

<style scoped>
.turn-bar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 16px;
  min-height: 48px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-family: inherit;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
}

@media only screen and (max-width: 650px) {
  .turn-bar {
    flex-wrap: wrap;
    gap: 6px;
    padding: 6px 10px;
    height: auto;
    min-height: auto;
  }

  .turn-info {
    flex-wrap: wrap;
    gap: 4px;
    max-width: 100%;
    flex: 1 1 auto;
  }

  .room-tag {
    max-width: 110px;
    font-size: 0.78rem;
    padding: 2px 6px;
    margin-right: 2px;
  }

  .room-name-text {
    max-width: 70px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    vertical-align: bottom;
  }

  .turn-text {
    font-size: 0.78rem;
    white-space: nowrap;
  }

  .timer-section,
  .facilitator-timer-controls {
    flex-wrap: wrap;
    gap: 4px;
  }

  .timer-adjust-group {
    display: none;
  }

  .turn-bar-actions {
    margin-left: auto;
    gap: 4px;
    flex-shrink: 0;
  }
}

@media only screen and (max-width: 420px) {
  .turn-bar {
    padding: 4px 6px;
  }

  .log-btn-label {
    display: none;
  }

  .financials-btn {
    padding: 4px 8px;
    height: 28px;
    font-size: 0.75rem;
  }

  .log-btn {
    padding: 4px 8px;
    height: 28px;
    font-size: 0.75rem;
  }

  .timer-ctrl-btn {
    padding: 2px 6px;
    font-size: 0.7rem;
  }
}

.turn-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.turn-icon {
  font-size: 1.3rem;
}

.room-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.12);
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  margin-right: 6px;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.my-turn-tag {
  font-weight: 700;
  margin-left: 4px;
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.timer-section {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.turn-timer-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.15);
  color: inherit;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.85rem;
  margin-left: 6px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.turn-timer-chip.timer-paused {
  background-color: #ff9800;
  color: #000000;
  border-color: #e65100;
}

.turn-timer-chip.timer-not-started {
  background-color: #757575;
  color: #ffffff;
  border-color: #424242;
}

.turn-timer-chip.timer-low {
  background-color: #d32f2f;
  color: #ffffff;
  border-color: #b71c1c;
  animation: pulse-timer 0.8s infinite alternate;
}

.facilitator-timer-controls {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.timer-ctrl-btn {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  border: none;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  color: #ffffff;
  transition: background 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.timer-ctrl-btn.start, .timer-ctrl-btn.resume {
  background-color: #2e7d32;
}
.timer-ctrl-btn.start:hover, .timer-ctrl-btn.resume:hover {
  background-color: #1b5e20;
}

.timer-ctrl-btn.pause {
  background-color: #ef6c00;
}
.timer-ctrl-btn.pause:hover {
  background-color: #e65100;
}

.timer-adjust-group {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-left: 4px;
  border-left: 1px solid rgba(0, 0, 0, 0.18);
  padding-left: 5px;
}

.timer-adjust-btn {
  border: none;
  border-radius: 10px;
  padding: 1px 6px;
  font-size: 0.72rem;
  font-weight: 800;
  cursor: pointer;
  color: #ffffff;
  transition: all 0.2s ease;
  line-height: 1.4;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.timer-adjust-btn.add {
  background-color: #ef6c00;
}
.timer-adjust-btn.add:hover {
  background-color: #e65100;
}

.timer-adjust-btn.sub {
  background-color: #455a64;
}
.timer-adjust-btn.sub:hover {
  background-color: #37474f;
}

.timer-ctrl-btn.grant-card-btn {
  background: #ff9800;
  color: #fff;
  font-weight: 700;
  margin-left: 6px;
}

.timer-ctrl-btn.grant-card-btn:hover {
  background: #f57c00;
}

.timer-ctrl-btn.remove-timer {
  background-color: #c62828;
  margin-left: 6px;
}
.timer-ctrl-btn.remove-timer:hover {
  background-color: #b71c1c;
}

.add-timer-section {
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
}

.timer-ctrl-btn.add-timer {
  background-color: #00796b;
}
.timer-ctrl-btn.add-timer:hover {
  background-color: #004d40;
}

@keyframes pulse-timer {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}

.role-badge {
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 12px;
  color: #fff;
  margin-left: 6px;
}

.role-badge.facilitator {
  background-color: #00796b;
}

.role-badge.spectator {
  background-color: #5c6bc0;
}

.turn-bar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.financials-btn {
  background: #607d8b;
  border: 1px solid #455a64;
  color: #ffffff;
  cursor: pointer;
  padding: 4px 12px;
  height: 32px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 700;
  font-size: 0.82rem;
  transition: background-color 0.2s, transform 0.1s;
}

.financials-btn:hover {
  background-color: #455a64;
}

.log-btn {
  position: relative;
  background: rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.18);
  color: inherit;
  cursor: pointer;
  padding: 4px 10px;
  height: 32px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  font-size: 0.82rem;
  transition: background-color 0.2s;
}

.log-btn:hover {
  background-color: rgba(0, 0, 0, 0.15);
}

.log-btn-label {
  font-weight: 700;
  font-size: 0.85rem;
}

.log-unread-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #e53935;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: bold;
  height: 18px;
  min-width: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

@media only screen and (max-width: 600px) {
  .room-name-text {
    max-width: 75px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    vertical-align: bottom;
  }

  .turn-text {
    font-size: 0.78rem;
  }

  .timer-adjust-group {
    display: none;
  }
}

@media only screen and (max-width: 420px) {
  .log-btn-label {
    display: none;
  }

  .financials-btn {
    padding: 4px 8px;
  }

  .log-btn {
    padding: 4px 8px;
  }
}
</style>
