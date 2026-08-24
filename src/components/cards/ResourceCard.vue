<template>
  <div 
    class="resource-card-holder"
    :style="holderStyle"
    :data-card-ref="card ? card.Ref : null"
  >
    <div 
      class="resource_card"
      :class="[colorClass, { hoverable: interactive && !dimmed }]"
    >
      <div 
        class="card_details"
        :class="{ greyOut: dimmed }"
        @click="onClick"
      >
        <div class="productsValue" v-if="card.Production > 0">{{ card.Production }}</div>
        <div class="redCost" v-if="card.CostRed > 0">{{ card.CostRed }}</div>
        <div class="greenCost" v-if="card.CostGreen > 0">{{ card.CostGreen }}</div>
        <div class="yellowCost" v-if="card.CostYellow > 0">{{ card.CostYellow }}</div>
        <div class="purpleCost" v-if="card.CostPurple > 0">{{ card.CostPurple }}</div>
        <div class="blackCost" v-if="card.CostBlack > 0">{{ card.CostBlack }}</div>
      </div>
      <!-- Manager Reservation Badge Overlay -->
      <div 
        v-if="card && card.allocatedManagersCount > 0" 
        class="manager-badge-overlay"
        :style="{ backgroundColor: reservingTeamColor }"
        :title="`Reserved by Team ${card.reservedBySeat} (${card.allocatedManagersCount} Manager${card.allocatedManagersCount > 1 ? 's' : ''})`"
      >
        <i class="material-icons tiny meeple-icon">person</i>
        <span class="meeple-count">{{ card.allocatedManagersCount }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ResourceCard',
  props: {
    card: {
      type: Object,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    interactive: {
      type: Boolean,
      default: true
    },
    dimmed: {
      type: Boolean,
      default: false
    },
    scale: {
      type: Number,
      default: null
    }
  },
  emits: ['select'],
  setup(props, { emit }) {
    const colorClass = computed(() => {
      const col = props.color ? props.color.toLowerCase() : ''
      if (col === 'red') return 'redResource'
      if (col === 'green') return 'greenResource'
      if (col === 'yellow') return 'yellowResource'
      if (col === 'purple') return 'purpleResource'
      if (col === 'black') return 'blackResource'
      return ''
    })

    const reservingTeamColor = computed(() => {
      const seatVal = props.card?.reservedBySeat
      if (seatVal === 1) return '#fdb410'
      if (seatVal === 2) return '#007b46'
      if (seatVal === 3) return '#1565c0'
      if (seatVal === 4) return '#e21234'
      return '#007b46'
    })

    const holderStyle = computed(() => {
      if (props.scale !== null) {
        return {
          '--card-scale': props.scale,
          'width': `calc(140px * ${props.scale})`,
          'height': `calc(140px * ${props.scale})`
        }
      }
      return {}
    })

    const onClick = () => {
      if (props.interactive) {
        emit('select', props.card)
      }
    }

    return { colorClass, reservingTeamColor, holderStyle, onClick }
  }
}
</script>

<style scoped>
.resource-card-holder {
  width: calc(140px * var(--card-scale, 1));
  height: calc(140px * var(--card-scale, 1));
  display: inline-block;
  vertical-align: top;
  margin-left: 14px;
}
.resource_card {
  margin-left: 0 !important;
  transform: scale(var(--card-scale, 1));
  transform-origin: top left;
  position: relative;
}

.manager-badge-overlay {
  position: absolute;
  top: 50%;
  left: -14px;
  transform: translateY(-50%);
  min-width: 36px;
  height: 36px;
  padding: 4px 8px;
  border-radius: 18px;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.45), 0 0 0 2px rgba(255,255,255,0.9);
  z-index: 10;
  transition: transform 0.2s ease;
}

.manager-badge-overlay:hover {
  transform: translateY(-50%) scale(1.1);
}

.meeple-icon {
  font-size: 1.3rem;
}

.meeple-count {
  font-size: 1rem;
  font-weight: 800;
  line-height: 1;
}
</style>
