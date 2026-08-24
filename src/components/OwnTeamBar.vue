<template>
  <div v-if="player" class="own-team-bar" :style="barStyle">
    <div class="own-team-header" @click="expanded = !expanded">
      <div class="header-main">
        <div class="title-line">
          <i class="material-icons tiny">account_circle</i>
          <span class="team-name">Your Team (Seat {{ player.seat }})</span>
          <span v-if="isActive" class="turn-indicator">Your Turn</span>
        </div>
        <div class="headline-stats">
          <span><strong>Cash:</strong> ${{ player.scores.cash }}</span>
          <span class="stat-sep">•</span>
          <span><strong>Value:</strong> {{ player.scores.value }} pts</span>
        </div>
      </div>
      <div class="toggle-icon">
        <i class="material-icons">{{ expanded ? 'expand_more' : 'expand_less' }}</i>
      </div>
    </div>

    <!-- Summary strip (collapsed) -->
    <div v-if="!expanded" class="own-team-summary" @click="expanded = true">
      <span><strong>Prod:</strong> {{ player.scores.production }}</span>
      <span class="stat-sep">|</span>
      <span>
        <strong>Perms:</strong> 
        <span class="token-val green-txt">{{ player.scores.greenPerm }}</span>
        <span class="token-val yellow-txt">{{ player.scores.yellowPerm }}</span>
        <span class="token-val red-txt">{{ player.scores.redPerm }}</span>
        <span class="token-val purple-txt">{{ player.scores.purplePerm }}</span>
        <span class="token-val black-txt">{{ player.scores.blackPerm }}</span>
      </span>
      <span class="stat-sep">|</span>
      <span>
        <strong>Tokens:</strong> 
        <span class="token-val green-txt">{{ player.scores.greenTemp }}</span>
        <span class="token-val yellow-txt">{{ player.scores.yellowTemp }}</span>
        <span class="token-val red-txt">{{ player.scores.redTemp }}</span>
        <span class="token-val purple-txt">{{ player.scores.purpleTemp }}</span>
        <span class="token-val black-txt">{{ player.scores.blackTemp }}</span>
      </span>
    </div>

    <!-- Expanded Player Panel Detail -->
    <div v-if="expanded" class="own-team-expanded">
      <PlayerPanel 
        :player="player" 
        :isActive="isActive" 
        :joinable="false" 
        :headerColor="seatHeaderColor" 
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import PlayerPanel from './PlayerPanel.vue'

export default {
  name: 'OwnTeamBar',
  components: { PlayerPanel },
  props: {
    player: {
      type: Object,
      default: null
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const expanded = ref(false)

    const barStyle = computed(() => {
      const seatNum = props.player?.seat || 1
      const seatColors = {
        1: { bg: '#FFF8E1', border: '#FFB300', text: '#5D4037' },
        2: { bg: '#E8F5E9', border: '#4CAF50', text: '#1B5E20' },
        3: { bg: '#E3F2FD', border: '#2196F3', text: '#0D47A1' },
        4: { bg: '#FBE9E7', border: '#FF5722', text: '#BF360C' }
      }
      const c = seatColors[seatNum] || seatColors[1]
      return {
        backgroundColor: c.bg,
        borderTop: `2px solid ${c.border}`,
        color: c.text
      }
    })

    const seatHeaderColor = computed(() => {
      const s = props.player?.seat || 1
      if (s === 1) return 'yellow'
      if (s === 2) return 'green'
      if (s === 3) return 'blue'
      if (s === 4) return 'orange'
      return 'yellow'
    })

    return {
      expanded,
      barStyle,
      seatHeaderColor
    }
  }
}
</script>

<style scoped>
.own-team-bar {
  position: sticky;
  bottom: 42px; /* sits directly above TeamSheet handle */
  z-index: 25;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.15);
  transition: all 0.2s ease;
  font-family: inherit;
}

.own-team-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  cursor: pointer;
  user-select: none;
}

.header-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.title-line {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 700;
}

.turn-indicator {
  font-size: 0.7rem;
  background: #4caf50;
  color: white;
  padding: 1px 6px;
  border-radius: 8px;
  text-transform: uppercase;
}

.headline-stats {
  font-size: 0.85rem;
}

.stat-sep {
  margin: 0 6px;
  opacity: 0.5;
}

.own-team-summary {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px 14px 8px;
  font-size: 0.8rem;
  cursor: pointer;
  border-top: 1px solid rgba(0,0,0,0.06);
}

.token-val {
  font-weight: bold;
  margin: 0 1px;
}

.green-txt { color: #2e7d32; }
.yellow-txt { color: #f57f17; }
.red-txt { color: #c62828; }
.purple-txt { color: #4a148c; }
.black-txt { color: #212121; }

.own-team-expanded {
  padding: 8px;
  background: #ffffff;
  max-height: 340px;
  overflow-y: auto;
}
</style>
