<template>
  <!-- Mobile / Tablet Bottom Sheet -->
  <div v-if="!isDesktop" class="team-sheet-wrapper">
    <!-- Scrim Overlay -->
    <div 
      v-if="isOpen" 
      class="sheet-scrim" 
      @click="isOpen = false"
    ></div>

    <!-- Bottom Sheet Container -->
    <div 
      class="sheet-container" 
      :class="{ 'is-open': isOpen }"
    >
      <!-- Drag / Toggle Handle Bar -->
      <div class="sheet-handle-bar" @click="isOpen = !isOpen">
        <div class="drag-pill"></div>
        <div class="handle-title">
          <i class="material-icons tiny">groups</i>
          <span>Other Teams ({{ players.length }})</span>
        </div>
        <i class="material-icons handle-chevron">{{ isOpen ? 'expand_more' : 'expand_less' }}</i>
      </div>

      <!-- Sheet Body Content -->
      <div class="sheet-content">
        <!-- Team Status & Colour Matrix Overview -->
        <ScoreboardColorMatrix :teams="allTeams" :currentTurnIndex="currentPlayer" :roomName="roomName" :isFacilitator="isFacilitator" @openFacilitatorGrant="$emit('openFacilitatorGrant')" />
      </div>
    </div>
  </div>

  <!-- Desktop Static Rail -->
  <div v-else class="desktop-teams-rail">
    <!-- Team Status & Colour Matrix Overview -->
    <ScoreboardColorMatrix :teams="allTeams" :currentTurnIndex="currentPlayer" :roomName="roomName" :isFacilitator="isFacilitator" @openFacilitatorGrant="$emit('openFacilitatorGrant')" />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import PlayerPanel from './PlayerPanel.vue'
import ScoreboardColorMatrix from './ScoreboardColorMatrix.vue'

export default {
  name: 'TeamSheet',
  components: { PlayerPanel, ScoreboardColorMatrix },
  props: {
    players: {
      type: Array,
      default: () => []
    },
    ownPlayer: {
      type: Object,
      default: null
    },
    currentPlayer: {
      type: Number,
      default: 0
    },
    isDesktop: {
      type: Boolean,
      default: false
    },
    roomName: {
      type: String,
      default: ''
    },
    isFacilitator: {
      type: Boolean,
      default: false
    }
  },
  emits: ['takeSeat', 'openFacilitatorGrant'],
  setup(props) {
    const isOpen = ref(false)

    const allTeams = computed(() => {
      const list = []
      if (props.ownPlayer) list.push(props.ownPlayer)
      if (props.players && props.players.length > 0) {
        props.players.forEach(p => {
          if (!props.ownPlayer || p.seat !== props.ownPlayer.seat) {
            list.push(p)
          }
        })
      }
      return list.sort((a, b) => a.seat - b.seat)
    })

    const getSeatColor = (seatVal) => {
      if (seatVal === 1) return 'yellow'
      if (seatVal === 2) return 'green'
      if (seatVal === 3) return 'blue'
      if (seatVal === 4) return 'orange'
      return 'yellow'
    }

    return {
      isOpen,
      allTeams,
      getSeatColor
    }
  }
}
</script>

<style scoped>
/* Mobile Bottom Sheet */
.team-sheet-wrapper {
  position: relative;
  z-index: 30;
}

.sheet-scrim {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 31;
}

.sheet-container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 32;
  background-color: #ffffff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.25);
  transform: translateY(calc(100% - 42px));
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.sheet-container.is-open {
  transform: translateY(0);
}

.sheet-handle-bar {
  height: 42px;
  background-color: #263238;
  color: #ffffff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  cursor: pointer;
  user-select: none;
  position: relative;
}

.drag-pill {
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 36px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 2px;
}

.handle-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 4px;
}

.handle-chevron {
  font-size: 1.4rem;
  margin-top: 4px;
}

.sheet-content {
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.team-card-item {
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

.team-card-item.active-highlight {
  box-shadow: 0 0 0 3px #4caf50;
}

/* Desktop Rail */
.desktop-teams-rail {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.rail-title {
  font-size: 1.2rem;
  color: #ffffff;
  font-weight: 600;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
}

.own-rail-item {
  border: 2px solid #ffb300;
}
</style>
