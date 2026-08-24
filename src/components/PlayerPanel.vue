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
