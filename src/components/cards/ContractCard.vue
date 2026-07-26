<template>
  <div 
    class="contract-card-holder"
    :style="holderStyle"
  >
    <div 
      class="contract_card"
      :class="{ hoverable: interactive }"
    >
      <div 
        class="contract_details"
        @click="onClick"
      >
        <div class="contractValue" v-if="card.Value > 0">{{ card.Value }}</div>
        <div class="contractCash" v-if="card.Cash > 0">{{ card.Cash }}</div>
        <div class="contractDebtors" v-if="card.Debtors > 0">{{ card.Debtors }}</div>
        <div class="redValue" v-if="card.CostRed > 0">{{ card.CostRed }}</div>
        <div class="greenValue" v-if="card.CostGreen > 0">{{ card.CostGreen }}</div>
        <div class="yellowValue" v-if="card.CostYellow > 0">{{ card.CostYellow }}</div>
        <div class="purpleValue" v-if="card.CostPurple > 0">{{ card.CostPurple }}</div>
        <div class="blackValue" v-if="card.CostBlack > 0">{{ card.CostBlack }}</div>
        <div class="productValue" v-if="card.Production > 0">{{ card.Production }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ContractCard',
  props: {
    card: {
      type: Object,
      required: true
    },
    interactive: {
      type: Boolean,
      default: true
    },
    scale: {
      type: Number,
      default: null
    }
  },
  emits: ['select'],
  setup(props, { emit }) {
    const holderStyle = computed(() => {
      if (props.scale !== null) {
        return {
          '--card-scale': props.scale,
          'width': `calc(140px * ${props.scale})`,
          'height': `calc(170px * ${props.scale})`
        }
      }
      return {}
    })

    const onClick = () => {
      if (props.interactive) {
        emit('select', props.card)
      }
    }

    return { holderStyle, onClick }
  }
}
</script>

<style scoped>
.contract-card-holder {
  width: calc(140px * var(--card-scale, 1));
  height: calc(170px * var(--card-scale, 1));
  display: inline-block;
  vertical-align: top;
  margin-left: 5px;
}
.contract_card {
  margin-left: 0 !important;
  transform: scale(var(--card-scale, 1));
  transform-origin: top left;
}
</style>
