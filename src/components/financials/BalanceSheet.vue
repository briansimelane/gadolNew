<template>
  <div class="financial-statement-card card-panel white z-depth-1">
    <div class="statement-header">
      <h6 class="statement-title">
        <i class="material-icons tiny teal-text">account_balance</i>
        Balance Sheet (Statement of Financial Position)
      </h6>
    </div>

    <table class="striped responsive-table statement-table">
      <thead>
        <tr>
          <th>Account Line</th>
          <th class="right-align">Base (G$)</th>
          <th v-if="hasComparative" class="right-align">Comparative (G$)</th>
          <th v-if="hasComparative" class="right-align">Δ (G$)</th>
        </tr>
      </thead>
      <tbody>
        <!-- NON-CURRENT ASSETS -->
        <tr class="section-header-row grey lighten-4">
          <td colspan="4"><strong>NON-CURRENT ASSETS</strong></td>
        </tr>
        <tr class="clickable-row" @click="showToast('Property (Green)', 'Free (unallocated) Green Permanent Resource Cards held by team.')">
          <td class="indent">Property (Green) <i class="material-icons tiny help-icon">info_outline</i></td>
          <td class="right-align">{{ fmt(base.property) }}</td>
          <td v-if="hasComparative" class="right-align">{{ fmt(comp.property) }}</td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(comp.property - base.property)">
            {{ fmtDelta(comp.property - base.property) }}
          </td>
        </tr>
        <tr class="clickable-row" @click="showToast('Equipment (Yellow)', 'Free (unallocated) Yellow Permanent Resource Cards held by team.')">
          <td class="indent">Equipment (Yellow) <i class="material-icons tiny help-icon">info_outline</i></td>
          <td class="right-align">{{ fmt(base.equipment) }}</td>
          <td v-if="hasComparative" class="right-align">{{ fmt(comp.equipment) }}</td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(comp.equipment - base.equipment)">
            {{ fmtDelta(comp.equipment - base.equipment) }}
          </td>
        </tr>
        <tr class="subtotal-row">
          <td><strong>Total Non-Current Assets</strong></td>
          <td class="right-align"><strong>{{ fmt(base.totalNonCurrentAssets) }}</strong></td>
          <td v-if="hasComparative" class="right-align"><strong>{{ fmt(comp.totalNonCurrentAssets) }}</strong></td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(comp.totalNonCurrentAssets - base.totalNonCurrentAssets)">
            {{ fmtDelta(comp.totalNonCurrentAssets - base.totalNonCurrentAssets) }}
          </td>
        </tr>

        <!-- CURRENT ASSETS -->
        <tr class="section-header-row grey lighten-4">
          <td colspan="4"><strong>CURRENT ASSETS</strong></td>
        </tr>
        <tr class="clickable-row" @click="showToast('Cash & Bank', 'Team cash balance plus contract cash value.')">
          <td class="indent">Cash &amp; Bank <i class="material-icons tiny help-icon">info_outline</i></td>
          <td class="right-align">{{ fmt(base.cash) }}</td>
          <td v-if="hasComparative" class="right-align">{{ fmt(comp.cash) }}</td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(comp.cash - base.cash)">
            {{ fmtDelta(comp.cash - base.cash) }}
          </td>
        </tr>
        <tr class="clickable-row" @click="showToast('Trade Debtors', 'Team debtors balance plus contract debtors value.')">
          <td class="indent">Trade Debtors (Receivables) <i class="material-icons tiny help-icon">info_outline</i></td>
          <td class="right-align">{{ fmt(base.debtors) }}</td>
          <td v-if="hasComparative" class="right-align">{{ fmt(comp.debtors) }}</td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(comp.debtors - base.debtors)">
            {{ fmtDelta(comp.debtors - base.debtors) }}
          </td>
        </tr>
        <tr class="clickable-row" @click="showToast('Inventory', 'Remaining unallocated production capacity after contract requirements.')">
          <td class="indent">Inventory (Capacity) <i class="material-icons tiny help-icon">info_outline</i></td>
          <td class="right-align">{{ fmt(base.inventory) }}</td>
          <td v-if="hasComparative" class="right-align">{{ fmt(comp.inventory) }}</td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(comp.inventory - base.inventory)">
            {{ fmtDelta(comp.inventory - base.inventory) }}
          </td>
        </tr>
        <tr class="subtotal-row">
          <td><strong>Total Current Assets</strong></td>
          <td class="right-align"><strong>{{ fmt(base.totalCurrentAssets) }}</strong></td>
          <td v-if="hasComparative" class="right-align"><strong>{{ fmt(comp.totalCurrentAssets) }}</strong></td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(comp.totalCurrentAssets - base.totalCurrentAssets)">
            {{ fmtDelta(comp.totalCurrentAssets - base.totalCurrentAssets) }}
          </td>
        </tr>

        <tr class="total-row grey lighten-3">
          <td><strong>TOTAL ASSETS</strong></td>
          <td class="right-align"><strong>{{ fmt(base.totalAssets) }}</strong></td>
          <td v-if="hasComparative" class="right-align"><strong>{{ fmt(comp.totalAssets) }}</strong></td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(comp.totalAssets - base.totalAssets)">
            <strong>{{ fmtDelta(comp.totalAssets - base.totalAssets) }}</strong>
          </td>
        </tr>

        <!-- LIABILITIES & EQUITY -->
        <tr class="section-header-row grey lighten-4">
          <td colspan="4"><strong>LIABILITIES</strong></td>
        </tr>
        <tr class="clickable-row" @click="showToast('Current Liabilities', 'Total unused temporary resource tokens held by team.')">
          <td class="indent">Current Liabilities (Unused Tokens) <i class="material-icons tiny help-icon">info_outline</i></td>
          <td class="right-align">{{ fmt(base.currentLiabilities) }}</td>
          <td v-if="hasComparative" class="right-align">{{ fmt(comp.currentLiabilities) }}</td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(-(comp.currentLiabilities - base.currentLiabilities))">
            {{ fmtDelta(comp.currentLiabilities - base.currentLiabilities) }}
          </td>
        </tr>
        <tr class="clickable-row" @click="showToast('Non-Current Liabilities', 'Facilitator-configured Long-Term Debt.')">
          <td class="indent">Non-Current Liabilities (Long-Term Debt) <i class="material-icons tiny help-icon">info_outline</i></td>
          <td class="right-align">{{ fmt(base.nonCurrentLiabilities) }}</td>
          <td v-if="hasComparative" class="right-align">{{ fmt(comp.nonCurrentLiabilities) }}</td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(-(comp.nonCurrentLiabilities - base.nonCurrentLiabilities))">
            {{ fmtDelta(comp.nonCurrentLiabilities - base.nonCurrentLiabilities) }}
          </td>
        </tr>
        <tr class="subtotal-row">
          <td><strong>Total Liabilities</strong></td>
          <td class="right-align"><strong>{{ fmt(base.totalLiabilities) }}</strong></td>
          <td v-if="hasComparative" class="right-align"><strong>{{ fmt(comp.totalLiabilities) }}</strong></td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(-(comp.totalLiabilities - base.totalLiabilities))">
            {{ fmtDelta(comp.totalLiabilities - base.totalLiabilities) }}
          </td>
        </tr>

        <!-- EQUITY -->
        <tr class="total-row teal lighten-5 clickable-row" @click="showToast('Equity', 'Total Assets minus Total Liabilities.')">
          <td><strong>EQUITY (NET ASSETS) <i class="material-icons tiny help-icon">info_outline</i></strong></td>
          <td class="right-align"><strong class="teal-text text-darken-3">{{ fmt(base.equity) }}</strong></td>
          <td v-if="hasComparative" class="right-align"><strong>{{ fmt(comp.equity) }}</strong></td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(comp.equity - base.equity)">
            <strong>{{ fmtDelta(comp.equity - base.equity) }}</strong>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { computed } from 'vue'
import M from 'materialize-css'

export default {
  name: 'BalanceSheet',
  props: {
    baseData: {
      type: Object,
      required: true
    },
    comparativeData: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const showToast = (title, explanation) => {
      M.toast({
        html: `<div style="line-height: 1.4;"><strong>${title}:</strong> ${explanation}</div>`,
        displayLength: 4000
      })
    }

    const base = computed(() => props.baseData || {})
    const comp = computed(() => props.comparativeData?.balanceSheet || {})
    const hasComparative = computed(() => !!props.comparativeData)

    const fmt = (val) => {
      if (val === undefined || val === null || isNaN(val)) return '0.00'
      return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    const fmtDelta = (val) => {
      if (val === undefined || val === null || isNaN(val)) return '0.00'
      const prefix = val > 0 ? '+' : ''
      return prefix + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    const deltaClass = (val) => {
      if (!val || Math.abs(val) < 0.001) return 'grey-text'
      return val > 0 ? 'green-text text-darken-2 fw-bold' : 'red-text text-darken-2 fw-bold'
    }

    return {
      showToast,
      base,
      comp,
      hasComparative,
      fmt,
      fmtDelta,
      deltaClass
    }
  }
}
</script>

<style scoped>
.financial-statement-card {
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.statement-title {
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 10px 0;
  color: #263238;
}

.statement-table th {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #546e7a;
}

.statement-table td {
  padding: 6px 8px;
  font-size: 0.85rem;
}

.indent {
  padding-left: 20px !important;
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.clickable-row:hover {
  background-color: #e0f2f1 !important;
}

.help-icon {
  font-size: 0.85rem;
  color: #78909c;
  vertical-align: middle;
  margin-left: 2px;
}

.section-header-row td {
  font-size: 0.78rem;
  color: #455a64;
  letter-spacing: 0.5px;
}

.subtotal-row {
  border-top: 1px solid #cfd8dc;
  border-bottom: 1px solid #cfd8dc;
  background-color: #fafafa;
}

.total-row {
  border-top: 2px solid #37474f;
  border-bottom: 2px double #37474f;
}

.fw-bold {
  font-weight: 700;
}
</style>
