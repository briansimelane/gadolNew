<template>
  <div class="scoreboard-matrix-card">
    <!-- Header Bar -->
    <div class="matrix-header">
      <div class="matrix-title">
        <i class="material-icons tiny">grid_on</i>
        <span>Team Standings</span>
      </div>
      <div class="matrix-legend">
        <span class="legend-item" title="Permanent Cards"><i class="material-icons micro-icon">style</i> Cards</span>
        <span class="legend-item" title="Temporary Tokens"><i class="material-icons micro-icon">hexagon</i> Tokens</span>
      </div>
    </div>

    <!-- Rows Container -->
    <div class="matrix-rows-container">
      <div 
        v-for="p in formattedTeams" 
        :key="p.seat"
        class="team-matrix-row"
        :class="{ 'is-active-turn': (p.seat - 1) === currentTurnIndex }"
        :style="{ borderLeftColor: getSeatAccentColor(p.seat) }"
      >
        <!-- Line 1: Team Name, Turn Indicator, and Joining Status -->
        <div class="row-line-1">
          <div class="team-label">
            <span class="team-dot" :style="{ backgroundColor: getSeatAccentColor(p.seat) }"></span>
            <strong class="team-name">{{ p.joined ? p.name : ('Team ' + p.seat) }}</strong>
            <span v-if="(p.seat - 1) === currentTurnIndex" class="turn-pill">TURN</span>
          </div>

          <div class="team-status-tag">
            <span v-if="p.joined" class="status-badge joined">Joined</span>
            <span v-else class="status-badge waiting">Waiting...</span>
          </div>
        </div>

        <!-- Line 2: Financial Metrics (Value, Cash, Production, Debtors) -->
        <div class="row-line-2">
          <div class="team-financials-grid">
            <span class="fin-item value"><span class="fin-lbl">Value:</span> <strong>{{ p.scores.value }}</strong></span>
            <span class="fin-item cash"><span class="fin-lbl">Cash:</span> <strong>${{ p.scores.cash }}</strong></span>
            <span class="fin-item prod"><span class="fin-lbl">Production:</span> <strong>{{ p.scores.production }}</strong></span>
            <span class="fin-item debtors"><span class="fin-lbl">Debtors:</span> <strong>${{ p.scores.debtors || 0 }}</strong></span>
          </div>
        </div>

        <!-- Line 3: 5 Official Resource Colour Boxes with Hexagon Token Icons -->
        <div class="row-line-3">
          <div class="row-resource-matrix">
            <div v-for="c in resourceColors" :key="c.key" class="color-matrix-box" :class="c.key">
              <div class="color-box-values">
                <!-- Permanent Cards Icon + Number -->
                <div class="res-sub-val cards-val" title="Permanent Resource Cards">
                  <i class="material-icons micro-icon">style</i>
                  <strong class="sub-num">{{ p.scores[c.key + 'Perm'] || 0 }}</strong>
                </div>

                <!-- Temporary Tokens Icon (Hexagon) + Number -->
                <div class="res-sub-val tokens-val" title="Temporary Resource Tokens">
                  <i class="material-icons micro-icon">hexagon</i>
                  <strong class="sub-num">{{ p.scores[c.key + 'Temp'] || 0 }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ScoreboardColorMatrix',
  props: {
    teams: {
      type: Array,
      required: true
    },
    currentTurnIndex: {
      type: Number,
      default: 0
    },
    roomName: {
      type: String,
      default: ''
    },
    testMode: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const resourceColors = [
      { key: 'green', label: 'Green' },
      { key: 'red', label: 'Red' },
      { key: 'yellow', label: 'Yellow' },
      { key: 'purple', label: 'Purple' },
      { key: 'black', label: 'Black' }
    ]

    const formattedTeams = computed(() => {
      if (!props.teams) return []
      if (props.testMode) {
        return props.teams.map(p => ({
          ...p,
          scores: {
            value: 88, cash: 88, production: 88, debtors: 88,
            greenPerm: 88, greenTemp: 88, redPerm: 88, redTemp: 88,
            yellowPerm: 88, yellowTemp: 88, purplePerm: 88, purpleTemp: 88,
            blackPerm: 88, blackTemp: 88
          }
        }))
      }
      return props.teams
    })

    const getSeatAccentColor = (seatVal) => {
      if (seatVal === 1) return '#fdb410' // Gold / Yellow
      if (seatVal === 2) return '#007b46' // Green
      if (seatVal === 3) return '#1565c0' // Blue
      if (seatVal === 4) return '#e21234' // Red
      return '#007b46'
    }

    return {
      resourceColors,
      formattedTeams,
      getSeatAccentColor
    }
  }
}
</script>

<style scoped>
.scoreboard-matrix-card {
  background-color: #ffffff;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

.matrix-header {
  background-color: #004d40;
  color: #ffffff;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.matrix-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.92rem;
  font-weight: 700;
}

.matrix-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.72rem;
  color: #b2dfdb;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 2px;
}

.micro-icon {
  font-size: 13px !important;
  line-height: 1;
  opacity: 0.9;
  flex-shrink: 0;
}

.matrix-rows-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  box-sizing: border-box;
}

.team-matrix-row {
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-left: 5px solid #007b46;
  border-radius: 6px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.team-matrix-row.is-active-turn {
  background: #f0f4c3;
  border-color: #c0ca33;
  box-shadow: 0 0 0 1px #c0ca33;
}

/* Line 1: Team Name + Status */
.row-line-1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.team-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.92rem;
}

.team-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}

.team-name {
  color: #212121;
}

.turn-pill {
  font-size: 0.65rem;
  font-weight: 800;
  background: #ef6c00;
  color: #ffffff;
  padding: 1px 5px;
  border-radius: 3px;
}

.team-status-tag {
  font-size: 0.74rem;
}

.status-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
}

.status-badge.joined {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-badge.waiting {
  background-color: #f5f5f5;
  color: #757575;
}

/* Line 2: Financial Metrics */
.row-line-2 {
  padding: 2px 0;
}

.team-financials-grid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 0.85rem;
  flex-wrap: nowrap;
  width: 100%;
}

.fin-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.fin-lbl {
  color: #546e7a;
  font-weight: 600;
}

.fin-item.value strong { color: #fdb410; font-size: 0.88rem; text-shadow: 0 0 1px rgba(0,0,0,0.2); }
.fin-item.cash strong { color: #007b46; font-size: 0.88rem; }
.fin-item.prod strong { color: #1565c0; font-size: 0.88rem; }
.fin-item.debtors strong { color: #e21234; font-size: 0.88rem; }

/* Line 3: 5 Official Resource Colour Boxes Grid (No Cutoff) */
.row-line-3 {
  width: 100%;
  box-sizing: border-box;
}

.row-resource-matrix {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 5px;
  width: 100%;
  box-sizing: border-box;
}

.color-matrix-box {
  border-radius: 5px;
  padding: 5px 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  min-width: 0;
  overflow: hidden;
}

.color-box-values {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
}

.res-sub-val {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 1.2;
  white-space: nowrap;
  width: 100%;
}

.sub-num {
  font-weight: 800;
  font-size: 0.88rem;
  margin-left: 2px;
}

/* Official Gadol Game Color Hex Themes & High-Contrast Text */

/* Green (#007b46) */
.color-matrix-box.green {
  background: #007b46 !important;
  color: #ffffff !important;
  border: 1px solid #005a33;
}
.color-matrix-box.green .micro-icon,
.color-matrix-box.green .sub-num {
  color: #ffffff !important;
}

/* Red (#e21234) */
.color-matrix-box.red {
  background: #e21234 !important;
  color: #ffffff !important;
  border: 1px solid #b80c27;
}
.color-matrix-box.red .micro-icon,
.color-matrix-box.red .sub-num {
  color: #ffffff !important;
}

/* Yellow (#fdb410) */
.color-matrix-box.yellow {
  background: #fdb410 !important;
  color: #000000 !important;
  border: 1px solid #d4950b;
}
.color-matrix-box.yellow .micro-icon,
.color-matrix-box.yellow .sub-num {
  color: #000000 !important;
}

/* Purple (#692586) */
.color-matrix-box.purple {
  background: #692586 !important;
  color: #ffffff !important;
  border: 1px solid #4a1960;
}
.color-matrix-box.purple .micro-icon,
.color-matrix-box.purple .sub-num {
  color: #ffffff !important;
}

/* Black (#000000) */
.color-matrix-box.black {
  background: #000000 !important;
  color: #ffffff !important;
  border: 1px solid #333333;
}
.color-matrix-box.black .micro-icon,
.color-matrix-box.black .sub-num {
  color: #ffffff !important;
}
</style>
