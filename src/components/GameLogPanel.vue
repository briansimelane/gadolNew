<template>
  <teleport to="#modals">
    <div class="log-overlay" @click.self="$emit('close')">
      <div class="log-panel">
        <div class="log-header">
          <div class="log-title">
            <i class="material-icons">history</i>
            <span>Game Log</span>
          </div>
          <button class="universal-close-btn" @click="$emit('close')" aria-label="Close log" title="Close panel">
            <i class="material-icons">close</i>
          </button>
        </div>

        <div class="log-body">
          <div v-if="groupedTurns.length === 0" class="empty-log">
            <i class="material-icons large grey-text">assignment</i>
            <p class="grey-text">No actions yet — Team 1 to play.</p>
          </div>

          <div 
            v-else 
            v-for="group in groupedTurns" 
            :key="group.turn" 
            class="turn-group"
          >
            <!-- Turn Header -->
            <div class="turn-header" :style="getSeatHeaderStyle(group.seat)">
              <span>Turn {{ group.turn }} — {{ group.actorName }}</span>
            </div>

            <!-- Turn Entries -->
            <div class="turn-entries">
              <div 
                v-for="(entry, idx) in group.entries" 
                :key="idx" 
                class="log-entry-row"
                :class="entry.type"
              >
                <span class="entry-dot" :style="{ backgroundColor: getSeatDotColor(entry.seat) }"></span>
                <span class="entry-text">{{ entry.text }}</span>
                <span class="entry-time">{{ formatTime(entry.ts) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'GameLogPanel',
  props: {
    log: {
      type: Array,
      default: () => []
    },
    players: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close'],
  setup(props) {
    const seatPalette = {
      1: { dot: '#BA7517', bg: '#FAEEDA', border: '#BA7517', text: '#633806' },
      2: { dot: '#639922', bg: '#EAF3DE', border: '#639922', text: '#27500A' },
      3: { dot: '#185FA5', bg: '#E3F2FD', border: '#185FA5', text: '#0D47A1' },
      4: { dot: '#D85A30', bg: '#FBE9E7', border: '#D85A30', text: '#BF360C' }
    }

    const getSeatDotColor = (seatNum) => {
      const s = seatPalette[seatNum] || seatPalette[1]
      return s.dot
    }

    const getSeatHeaderStyle = (seatNum) => {
      const s = seatPalette[seatNum] || seatPalette[1]
      return {
        backgroundColor: s.bg,
        borderLeft: `4px solid ${s.border}`,
        color: s.text
      }
    }

    const formatTime = (ts) => {
      if (!ts) return ''
      const d = new Date(ts)
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }

    // Group log entries by turn, newest turn first
    const groupedTurns = computed(() => {
      if (!props.log || props.log.length === 0) return []

      const turnMap = new Map()

      props.log.forEach(entry => {
        const turnNum = entry.turn || 1
        if (!turnMap.has(turnNum)) {
          turnMap.set(turnNum, {
            turn: turnNum,
            seat: entry.seat || 1,
            actorName: entry.name || `Team ${entry.seat || 1}`,
            entries: []
          })
        }
        if (entry.type !== 'TURN_END') {
          turnMap.get(turnNum).entries.push(entry)
        }
      })

      // Convert map to array, reverse entries in each group so newest is top, and sort descending by turn
      return Array.from(turnMap.values())
        .map(group => ({
          ...group,
          entries: [...group.entries].reverse()
        }))
        .sort((a, b) => b.turn - a.turn)
    })

    return {
      groupedTurns,
      getSeatDotColor,
      getSeatHeaderStyle,
      formatTime
    }
  }
}
</script>

<style scoped>
.log-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 9999;
  display: flex;
  justify-content: flex-end;
}

.log-panel {
  width: 100%;
  max-width: 420px;
  height: 100vh;
  max-height: 100vh;
  background-color: #ffffff;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideInRight 0.25s ease-out;
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.log-header {
  height: 54px;
  min-height: 54px;
  flex-shrink: 0;
  background-color: #004d40;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.log-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 600;
}

.log-close-btn {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 28px;
  cursor: pointer;
  line-height: 1;
}

.log-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto !important;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scrollbar-width: thin;
  scrollbar-color: #004d40 #e0f2f1;
}

.log-body::-webkit-scrollbar {
  width: 6px;
}

.log-body::-webkit-scrollbar-track {
  background: #e0f2f1;
}

.log-body::-webkit-scrollbar-thumb {
  background-color: #004d40;
  border-radius: 3px;
}

.empty-log {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
}

.turn-group {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  flex-shrink: 0;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

.turn-header {
  padding: 8px 12px;
  font-weight: 700;
  font-size: 0.88rem;
}

.turn-entries {
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
}

.log-entry-row {
  display: flex;
  align-items: flex-start;
  padding: 8px 12px;
  border-bottom: 1px solid #eeeeee;
  font-size: 0.88rem;
  gap: 8px;
  word-break: break-word;
}

.log-entry-row.TIMEOUT {
  background-color: #ffebee;
  color: #c62828;
  font-weight: 700;
}

.log-entry-row.MOVE_CARD {
  background-color: #e0f2f1;
  border-left: 3px solid #00796b;
}

.log-entry-row.DISCARD_CARD {
  background-color: #fbe9e7;
  border-left: 3px solid #d84315;
}

.log-entry-row:last-child {
  border-bottom: none;
}

.entry-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}

.entry-text {
  flex: 1;
  color: #212121;
  word-break: break-word;
  line-height: 1.4;
}

.entry-time {
  font-size: 0.72rem;
  color: #757575;
  white-space: nowrap;
  margin-left: 4px;
}

.log-entry-row:last-child {
  border-bottom: none;
}

.entry-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.entry-text {
  flex: 1;
  color: #212121;
}

.entry-time {
  font-size: 0.72rem;
  color: #757575;
}
</style>
