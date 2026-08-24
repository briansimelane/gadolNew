<template>
  <div class="token-market-bar">
    <div class="market-left">
      <span class="market-title">Tokens Market</span>
      
      <div class="token-items-row">
        <!-- Green -->
        <div class="token-pill green-pill">
          <img src="../assets/img/greenToken.png" class="token-icon" alt="Green token" />
          <span class="token-count">{{ gameData.z08marketGreenTokens }}</span>
        </div>

        <!-- Yellow -->
        <div class="token-pill yellow-pill">
          <img src="../assets/img/yellowToken.png" class="token-icon" alt="Yellow token" />
          <span class="token-count">{{ gameData.z09marketYellowTokens }}</span>
        </div>

        <!-- Red -->
        <div class="token-pill red-pill">
          <img src="../assets/img/redToken.png" class="token-icon" alt="Red token" />
          <span class="token-count">{{ gameData.z07marketRedTokens }}</span>
        </div>

        <!-- Purple -->
        <div class="token-pill purple-pill">
          <img src="../assets/img/purpleToken.png" class="token-icon" alt="Purple token" />
          <span class="token-count">{{ gameData.z10marketPurpleTokens }}</span>
        </div>

        <!-- Black -->
        <div class="token-pill black-pill">
          <img src="../assets/img/blackToken.png" class="token-icon" alt="Black token" />
          <span class="token-count">{{ gameData.z11marketBlackTokens }}</span>
        </div>
      </div>
    </div>

    <div class="market-right">
      <button 
        class="btn-small waves-effect waves-light cyan darken-4 acquire-btn"
        @click="onClick"
      >
        <i class="material-icons left">add_circle</i>Acquire
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

<style scoped>
.token-market-bar {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  flex-wrap: wrap;
  gap: 10px;
}

.market-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.market-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #37474f;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.token-items-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.token-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 14px;
  font-size: 1.15rem;
  font-weight: 800;
}

.token-icon {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.green-pill { background-color: var(--g-green-bg); color: var(--g-green-text); }
.yellow-pill { background-color: var(--g-yellow-bg); color: var(--g-yellow-text); }
.red-pill { background-color: var(--g-red-bg); color: var(--g-red-text); }
.purple-pill { background-color: var(--g-purple-bg); color: var(--g-purple-text); }
.black-pill { background-color: var(--g-black-bg); color: var(--g-black-text); }

.acquire-btn {
  border-radius: 6px;
  font-weight: 600;
  text-transform: none;
}

@media only screen and (max-width: 500px) {
  .token-market-bar {
    padding: 8px 10px;
  }
  .token-items-row {
    gap: 4px;
    flex-wrap: wrap;
  }
  .token-pill {
    padding: 3px 8px;
    font-size: 0.95rem;
  }
  .token-icon {
    width: 20px;
    height: 20px;
  }
}
</style>
