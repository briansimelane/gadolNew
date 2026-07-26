<template>
  <div 
    class="resource-card-holder"
    :style="holderStyle"
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

    return { colorClass, holderStyle, onClick }
  }
}
</script>

<style scoped>
.resource-card-holder {
  width: calc(140px * var(--card-scale, 1));
  height: calc(140px * var(--card-scale, 1));
  display: inline-block;
  vertical-align: top;
  margin-left: 10px;
}
.resource_card {
  margin-left: 0 !important;
  transform: scale(var(--card-scale, 1));
  transform-origin: top left;
}
</style>
