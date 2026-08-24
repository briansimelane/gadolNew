<template>
  <div class="in-play-pair-tile">
    <div class="tile-header">
      <span class="color-label">IN PLAY CARDS</span>
    </div>

    <div class="pair-cards-row">
      <!-- Space A Slot -->
      <div class="in-play-slot" data-inplay-space="A">
        <div class="slot-header">
          <span class="slot-title">Space A</span>
          <span class="count-pill" :class="{ 'has-cards': stackA.length > 0 }">
            {{ stackA.length }} {{ stackA.length === 1 ? 'card' : 'cards' }}
          </span>
        </div>

        <div class="card-wrapper" :data-card-ref="topCardA?.Ref" @click="topCardA && onSelectCard(topCardA, 'A')">
          <template v-if="topCardA">
            <ContractCard
              v-if="isContract(topCardA)"
              :card="topCardA"
              :interactive="true"
              :scale="0.85"
            />
            <ResourceCard
              v-else
              :card="topCardA"
              :color="getCardColor(topCardA)"
              :interactive="true"
              :scale="0.85"
            />
          </template>
          <div v-else class="empty-card-placeholder">
            <i class="material-icons tiny text-grey">crop_portrait</i>
            <span>Empty</span>
          </div>
        </div>
      </div>

      <div class="pair-divider"></div>

      <!-- Space B Slot -->
      <div class="in-play-slot" data-inplay-space="B">
        <div class="slot-header">
          <span class="slot-title">Space B</span>
          <span class="count-pill" :class="{ 'has-cards': stackB.length > 0 }">
            {{ stackB.length }} {{ stackB.length === 1 ? 'card' : 'cards' }}
          </span>
        </div>

        <div class="card-wrapper" :data-card-ref="topCardB?.Ref" @click="topCardB && onSelectCard(topCardB, 'B')">
          <template v-if="topCardB">
            <ContractCard
              v-if="isContract(topCardB)"
              :card="topCardB"
              :interactive="true"
              :scale="0.85"
            />
            <ResourceCard
              v-else
              :card="topCardB"
              :color="getCardColor(topCardB)"
              :interactive="true"
              :scale="0.85"
            />
          </template>
          <div v-else class="empty-card-placeholder">
            <i class="material-icons tiny text-grey">crop_portrait</i>
            <span>Empty</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import ResourceCard from './cards/ResourceCard.vue'
import ContractCard from './cards/ContractCard.vue'

export default {
  name: 'InPlaySpaces',
  components: { ResourceCard, ContractCard },
  props: {
    inPlayA: {
      type: Array,
      default: () => []
    },
    inPlayB: {
      type: Array,
      default: () => []
    },
    isMyTurn: {
      type: Boolean,
      default: false
    }
  },
  emits: ['selectCard'],
  setup(props, { emit }) {
    const stackA = computed(() => props.inPlayA || [])
    const stackB = computed(() => props.inPlayB || [])

    const topCardA = computed(() => stackA.value.length > 0 ? stackA.value[stackA.value.length - 1] : null)
    const topCardB = computed(() => stackB.value.length > 0 ? stackB.value[stackB.value.length - 1] : null)

    const isContract = (card) => {
      if (!card) return false
      return card.inPlayMeta?.kind === 'contract' || card.Value !== undefined || card.Colour === 'White'
    }

    const getCardColor = (card) => {
      if (!card) return 'green'
      const col = card.inPlayMeta?.colour || card.Colour || 'green'
      return col.toLowerCase()
    }

    const onSelectCard = (card, space) => {
      emit('selectCard', { 
        card, 
        type: 'inPlay', 
        color: getCardColor(card),
        space,
        stack: space === 'A' ? stackA.value : stackB.value
      })
    }

    return {
      stackA,
      stackB,
      topCardA,
      topCardB,
      isContract,
      getCardColor,
      onSelectCard
    }
  }
}
</script>

<style scoped>
.in-play-pair-tile {
  background-color: #e0f2f1;
  border: 2px solid #00796b;
  color: #004d40;
  border-radius: 10px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.tile-header {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
  padding-left: 2px;
  color: #004d40;
}

.pair-cards-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 4px;
  flex: 1;
}

.in-play-slot {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
}

.slot-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.72rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: #004d40;
}

.count-pill {
  background: rgba(0, 77, 64, 0.1);
  color: #004d40;
  font-size: 0.68rem;
  padding: 1px 6px;
  border-radius: 8px;
  font-weight: 600;
}

.count-pill.has-cards {
  background: #00796b;
  color: #ffffff;
}

.card-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 100%;
  min-height: 105px;
}

.pair-divider {
  width: 1px;
  align-self: stretch;
  background-color: rgba(0, 77, 64, 0.2);
  margin: 0 2px;
}

.empty-card-placeholder {
  width: 100px;
  height: 100px;
  border: 2px dashed rgba(0, 77, 64, 0.3);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(0, 77, 64, 0.6);
  background: rgba(255, 255, 255, 0.4);
  gap: 2px;
}
</style>
