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
        <span v-if="isMyTurn" class="my-turn-tag">— You</span>
      </span>
      <span v-if="isFacilitator" class="role-badge facilitator">Facilitator</span>
      <span v-if="isSpectator" class="role-badge spectator">Spectator</span>
    </div>

    <button class="log-btn" @click="$emit('openLog')" title="View Game Log" aria-label="Game log">
      <i class="material-icons">history</i>
      <span class="log-btn-label">Game Log</span>
      <span v-if="unreadCount > 0" class="log-unread-badge">{{ unreadCount }}</span>
    </button>
  </div>
</template>

<script>
import { computed } from 'vue'

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
    }
  },
  emits: ['openLog'],
  setup(props) {
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

    return { barStyle }
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
</style>
