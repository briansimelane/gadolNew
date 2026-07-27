<template>
  <div class="assumptions-panel card-panel grey lighten-4 z-depth-1">
    <div class="assumptions-header" @click="isOpen = !isOpen">
      <div class="header-title">
        <i class="material-icons tiny">settings</i>
        <span>Financial Model Assumptions (Facilitator Settings)</span>
      </div>
      <i class="material-icons tiny">{{ isOpen ? 'expand_less' : 'expand_more' }}</i>
    </div>

    <div v-if="isOpen" class="assumptions-body">
      <div class="row margin-bottom-0">
        <!-- Interest Rate -->
        <div class="col s12 m3">
          <label for="interest-rate">Interest Rate (%)</label>
          <input 
            id="interest-rate" 
            type="number" 
            step="1" 
            min="0" 
            max="100" 
            :value="Math.round((config.interestRate || 0.2) * 100)" 
            @change="updateField('interestRate', $event.target.value / 100)"
          />
        </div>

        <!-- Tax Rate -->
        <div class="col s12 m3">
          <label for="tax-rate">Tax Rate (%)</label>
          <input 
            id="tax-rate" 
            type="number" 
            step="1" 
            min="0" 
            max="100" 
            :value="Math.round((config.taxRate || 0.27) * 100)" 
            @change="updateField('taxRate', $event.target.value / 100)"
          />
        </div>

        <!-- Long-Term Debt -->
        <div class="col s12 m3">
          <label for="lt-debt">Long-Term Debt (G$)</label>
          <input 
            id="lt-debt" 
            type="number" 
            step="1" 
            min="0" 
            :value="config.longTermDebt !== undefined ? config.longTermDebt : 5" 
            @change="updateField('longTermDebt', parseFloat($event.target.value) || 0)"
          />
        </div>

        <!-- Tax Loss Policy -->
        <div class="col s12 m3">
          <label for="tax-policy">Tax Loss Policy</label>
          <select 
            id="tax-policy" 
            class="browser-default" 
            :value="config.taxLossPolicy || 'NO_CREDIT'" 
            @change="updateField('taxLossPolicy', $event.target.value)"
          >
            <option value="NO_CREDIT">No Credit (Tax ≥ 0)</option>
            <option value="CREDIT">Tax Credit Allowed</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'AssumptionsPanel',
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['updateConfig'],
  setup(props, { emit }) {
    const isOpen = ref(false)

    const updateField = (key, value) => {
      const updated = { ...props.config, [key]: value }
      emit('updateConfig', updated)
    }

    return {
      isOpen,
      updateField
    }
  }
}
</script>

<style scoped>
.assumptions-panel {
  padding: 10px 14px;
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.assumptions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  font-weight: 700;
  font-size: 0.85rem;
  color: #37474f;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 6px;
}

.assumptions-body {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e0e0e0;
}

.margin-bottom-0 {
  margin-bottom: 0;
}

label {
  font-weight: 700;
  font-size: 0.75rem;
  color: #455a64;
}

input, select {
  height: 32px;
  margin-top: 2px;
  font-size: 0.85rem;
  padding: 2px 6px;
  box-sizing: border-box;
}
</style>
