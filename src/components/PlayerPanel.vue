<template>
  <div class="PlayerScoreArea">
    <div class="scorePlayerHeader" :class="headerColor">
      <p>
        <i class="material-icons" v-if="isActive">send</i>
        <span v-if="!player.joined">
          <span class="playerName">Waiting for Player {{ player.seat }}</span>
          <span 
            class="right takeAseat" 
            v-if="joinable" 
            @click="$emit('takeSeat', player.seat)"
          >
            Take this seat
          </span>
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
        <tr>
          <td><img src="../assets/img/greenToken.png" class="playerIconsSizing"/> <p>{{ player.scores.greenTemp }}</p></td>
          <td><img src="../assets/img/redToken.png" class="playerIconsSizing"/> <p>{{ player.scores.redTemp }}</p></td>
          <td><img src="../assets/img/yellowToken.png" class="playerIconsSizing"/> <p>{{ player.scores.yellowTemp }}</p></td>
          <td><img src="../assets/img/purpleToken.png" class="playerIconsSizing"/> <p>{{ player.scores.purpleTemp }}</p></td>
          <td><img src="../assets/img/blackToken.png" class="playerIconsSizing"/> <p>{{ player.scores.blackTemp }}</p></td>
        </tr>
      </table>
    </div>

    <div class="scorePlayerPermResources">
      <table>
        <tr>
          <td><img src="../assets/img/greenCardicon.png" class="playerIconsSizing"/> <p>{{ player.scores.greenPerm }}</p></td>
          <td><img src="../assets/img/redCardicon.png" class="playerIconsSizing"/> <p>{{ player.scores.redPerm }}</p></td>
          <td><img src="../assets/img/yellowCardicon.png" class="playerIconsSizing"/> <p>{{ player.scores.yellowPerm }}</p></td>
          <td><img src="../assets/img/purpleCardicon.png" class="playerIconsSizing"/> <p>{{ player.scores.purplePerm }}</p></td>
          <td><img src="../assets/img/blackCardicon.png" class="playerIconsSizing"/> <p>{{ player.scores.blackPerm }}</p></td>
        </tr>
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
