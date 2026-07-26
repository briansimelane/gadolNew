<template>
  <div class="tempResources">
    <h6 class="center white-text">Temporary resources market</h6>
    <table>
      <tbody>
        <tr class="boldTempResources white-text">
          <td class="center">{{ gameData.z08marketGreenTokens }}</td>
          <td class="center">{{ gameData.z07marketRedTokens }}</td>
          <td class="center">{{ gameData.z09marketYellowTokens }}</td>
          <td class="center">{{ gameData.z10marketPurpleTokens }}</td>
          <td class="center">{{ gameData.z11marketBlackTokens }}</td>
        </tr>
        <tr>
          <td class="center"><img src="../assets/img/greenToken.png" class="tempResourceIcon"/> </td>
          <td class="center"><img src="../assets/img/redToken.png" class="tempResourceIcon" /></td>
          <td class="center"><img src="../assets/img/yellowToken.png" class="tempResourceIcon"/></td>
          <td class="center"><img src="../assets/img/purpleToken.png" class="tempResourceIcon" /></td>
          <td class="center"><img src="../assets/img/blackToken.png" class="tempResourceIcon" /></td>
        </tr>
      </tbody>
    </table>
    <div class="center space-allaround">
      <button 
        class="btn-small waves-effect waves-light cyan darken-3"
        @click="onClick"
      >
        Acquire resources
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TokenMarket',
  props: {
    gameData: {
      type: Object,
      required: true
    }
  },
  emits: ['acquireClick'],
  setup(props, { emit }) {
    const onClick = () => {
      emit('acquireClick')
    }
    return { onClick }
  }
}
</script>
