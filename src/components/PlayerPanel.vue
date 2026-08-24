<template>
  <div class="PlayerScoreArea" :data-seat="player ? player.seat : null" :data-is-active="isActive">
    <div class="scorePlayerHeader" :class="headerColor">
      <p>
        <i class="material-icons" v-if="isActive">send</i>
        <span v-if="!player.joined">
          <span class="playerName">Waiting for Team {{ player.seat }}</span>
        </span>
        <span v-else>
          <span class="playerName">{{ player.name }}</span>
          <i 
            class="material-icons right black-text" 
            style="padding-left: 5px; padding-right: 5px;"
          >
            account_circle
          </i>
        </span>
      </p>
    </div>

    <!-- Team Managers Supply Bar -->
    <div class="player-managers-bar" title="Team Managers Supply (Available / Total)">
      <span class="managers-title">Managers:</span>
      <div class="managers-meeples-list">
        <i 
          v-for="idx in 4" 
          :key="idx" 
          class="material-icons tiny meeple-supply-icon"
          :class="{ 'available': idx <= (player.scores ? (player.scores.managersAvailable ?? 4) : 4) }"
        >
          person
        </i>
      </div>
      <span class="managers-count-str">{{ player.scores ? (player.scores.managersAvailable ?? 4) : 4 }}/4</span>
    </div>

    <div class="scorePlayerTempResources">
      <table>
        <tbody>
          <tr>
            <td data-token-color="green"><img src="../assets/img/greenToken.png" class="playerIconsSizing"/> <p>{{ player.scores.greenTemp }}</p></td>
            <td data-token-color="red"><img src="../assets/img/redToken.png" class="playerIconsSizing"/> <p>{{ player.scores.redTemp }}</p></td>
            <td data-token-color="yellow"><img src="../assets/img/yellowToken.png" class="playerIconsSizing"/> <p>{{ player.scores.yellowTemp }}</p></td>
            <td data-token-color="purple"><img src="../assets/img/purpleToken.png" class="playerIconsSizing"/> <p>{{ player.scores.purpleTemp }}</p></td>
            <td data-token-color="black"><img src="../assets/img/blackToken.png" class="playerIconsSizing"/> <p>{{ player.scores.blackTemp }}</p></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="scorePlayerPermResources">
      <table>
        <tbody>
          <tr>
            <td data-card-color="green"><img src="../assets/img/greenCardicon.png" class="playerIconsSizing"/> <p>{{ player.scores.greenPerm }}</p></td>
            <td data-card-color="red"><img src="../assets/img/redCardicon.png" class="playerIconsSizing"/> <p>{{ player.scores.redPerm }}</p></td>
            <td data-card-color="yellow"><img src="../assets/img/yellowCardicon.png" class="playerIconsSizing"/> <p>{{ player.scores.yellowPerm }}</p></td>
            <td data-card-color="purple"><img src="../assets/img/purpleCardicon.png" class="playerIconsSizing"/> <p>{{ player.scores.purplePerm }}</p></td>
            <td data-card-color="black"><img src="../assets/img/blackCardicon.png" class="playerIconsSizing"/> <p>{{ player.scores.blackPerm }}</p></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="scoreFinancials row">
      <div class="col s6">
        <p>Cash: <span class="scoreFinancialsNumbers">{{ player.scores.cash }}</span></p>
        <p>Production: <span class="scoreFinancialsNumbers">{{ player.scores.production }}</span></p>
      </div>
      <div class="col s6">
        <p>Debtors: <span class="scoreFinancialsNumbers">{{ player.scores.debtors }}</span></p>
        <p>Value: <span class="scoreFinancialsNumbers">{{ player.scores.value }}</span></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayerPanel',
  props: {
    player: {
      type: Object,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    },
    joinable: {
      type: Boolean,
      default: false
    },
    headerColor: {
      type: String,
      default: 'yellow'
    }
  },
  emits: ['takeSeat']
}
</script>

<style scoped>
.player-managers-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px;
  background-color: #eceff1;
  border-bottom: 1px solid #cfd8dc;
  font-size: 0.8rem;
  font-weight: 600;
  color: #37474f;
}

.managers-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.managers-meeples-list {
  display: flex;
  align-items: center;
  gap: 2px;
}

.meeple-supply-icon {
  font-size: 1.1rem;
  color: #b0bec5;
  transition: color 0.2s, transform 0.2s;
}

.meeple-supply-icon.available {
  color: #00796b;
  transform: scale(1.1);
}

.managers-count-str {
  font-size: 0.8rem;
  font-weight: 700;
  color: #004d40;
}
</style>
