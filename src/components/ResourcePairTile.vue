<template>
  <div class="resource-pair-tile" :style="tileContainerStyle">
    <div class="tile-header">
      <span class="color-label">{{ colorName }} Cards</span>
    </div>

    <div class="pair-cards-row">
      <!-- Card Slot 1 -->
      <div class="card-slot" @click="onCardClick(firstCard)">
        <ResourceCard 
          v-if="firstCard" 
          :card="firstCard" 
          :color="color" 
          :interactive="interactive" 
          :scale="cardScale" 
        />
        <div v-else class="empty-card-placeholder">
          <span>Empty</span>
        </div>
      </div>

      <div class="pair-divider"></div>

      <!-- Card Slot 2 -->
      <div class="card-slot" @click="onCardClick(secondCard)">
        <ResourceCard 
          v-if="secondCard" 
          :card="secondCard" 
          :color="color" 
          :interactive="interactive" 
          :scale="cardScale" 
        />
        <div v-else class="empty-card-placeholder">
          <span>Empty</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import ResourceCard from './cards/ResourceCard.vue'

export default {
  name: 'ResourcePairTile',
  components: { ResourceCard },
  props: {
    cards: {
      type: Array,
      default: () => []
    },
    color: {
      type: String,
      required: true
    },
    interactive: {
      type: Boolean,
      default: true
    },
    cardScale: {
      type: Number,
      default: 0.85
    }
  },
  emits: ['select'],
  setup(props, { emit }) {
    const firstCard = computed(() => props.cards[0] || null)
    const secondCard = computed(() => props.cards[1] || null)

    const colorName = computed(() => {
      const col = (props.color || '').toLowerCase()
      if (col === 'green') return 'Property'
      if (col === 'yellow') return 'Equipment'
      if (col === 'red') return 'People'
      if (col === 'purple') return 'Operations'
      if (col === 'black') return 'Outsource'
      return col.charAt(0).toUpperCase() + col.slice(1)
    })

    const colorTheme = computed(() => {
      const col = (props.color || '').toLowerCase()
      const themes = {
        green: { bg: 'var(--g-green-bg)', border: 'var(--g-green)', text: 'var(--g-green-text)' },
        yellow: { bg: 'var(--g-yellow-bg)', border: 'var(--g-yellow)', text: 'var(--g-yellow-text)' },
        red: { bg: 'var(--g-red-bg)', border: 'var(--g-red)', text: 'var(--g-red-text)' },
        purple: { bg: 'var(--g-purple-bg)', border: 'var(--g-purple)', text: 'var(--g-purple-text)' },
        black: { bg: 'var(--g-black-bg)', border: 'var(--g-black)', text: 'var(--g-black-text)' }
      }
      return themes[col] || themes.green
    })

    const tileContainerStyle = computed(() => ({
      backgroundColor: colorTheme.value.bg,
      borderColor: colorTheme.value.border,
      color: colorTheme.value.text
    }))

    const onCardClick = (card) => {
      if (card && props.interactive) {
        emit('select', card)
      }
    }

    return {
      firstCard,
      secondCard,
      colorName,
      tileContainerStyle,
      onCardClick
    }
  }
}
</script>

<style scoped>
.resource-pair-tile {
  border: 2px solid;
  border-radius: 10px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.tile-header {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
  padding-left: 2px;
}

.pair-cards-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 4px;
}

.card-slot {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.pair-divider {
  width: 1px;
  align-self: stretch;
  background-color: rgba(0, 0, 0, 0.15);
  margin: 0 2px;
}

.empty-card-placeholder {
  width: 100px;
  height: 100px;
  border: 2px dashed rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.4);
}
</style>
