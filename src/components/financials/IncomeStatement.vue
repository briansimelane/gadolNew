<template>
  <div class="financial-statement-card card-panel white z-depth-1">
    <div class="statement-header">
      <h6 class="statement-title">
        <i class="material-icons tiny teal-text">receipt</i>
        Income Statement (P&amp;L)
      </h6>
    </div>

    <table class="striped responsive-table statement-table">
      <thead>
        <tr>
          <th>Line Item</th>
          <th class="right-align">Base (G$)</th>
          <th v-if="hasComparative" class="right-align">Comparative (G$)</th>
          <th v-if="hasComparative" class="right-align">Δ (G$)</th>
        </tr>
      </thead>
      <tbody>
        <tr class="clickable-row" @click="showToast('Revenue', 'Value earned from completed market contracts + reporting contract value minus unmet card and production penalties.')">
          <td>
            <strong>Revenue <i class="material-icons tiny help-icon">info_outline</i></strong>
            <div class="revenue-formula-text grey-text text-darken-2">
              <small>
                Calculated as: 
                <span v-if="base.completedValue > 0">Market Completed (G$ {{ base.completedValue }}) + </span>
                Contract (G$ {{ (base.reportingRevenue || 0) + (workings?.unmetCards || 0) + (workings?.unmetProduction || 0) }})
                <span v-if="(workings?.unmetCards || 0) > 0" class="red-text"> - Unmet Cards ({{ workings.unmetCards }})</span>
                <span v-if="(workings?.unmetProduction || 0) > 0" class="red-text"> - Unmet Prod ({{ workings.unmetProduction }})</span>
                = <strong>G$ {{ fmt(base.revenue) }}</strong>
              </small>
            </div>
          </td>
          <td class="right-align"><strong>{{ fmt(base.revenue) }}</strong></td>
          <td v-if="hasComparative" class="right-align"><strong>{{ fmt(comp.revenue) }}</strong></td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(comp.revenue - base.revenue)">
            {{ fmtDelta(comp.revenue - base.revenue) }}
          </td>
        </tr>
        <tr class="clickable-row" @click="showToast('Cost of Sales', 'Sum of permanent resource card requirements (CostRed + CostGreen + CostYellow + CostPurple + CostBlack) allocated to contracts.')">
          <td class="indent">Cost of Sales <i class="material-icons tiny help-icon">info_outline</i></td>
          <td class="right-align">({{ fmt(base.costOfSales) }})</td>
          <td v-if="hasComparative" class="right-align">({{ fmt(comp.costOfSales) }})</td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(-(comp.costOfSales - base.costOfSales))">
            {{ fmtDelta(comp.costOfSales - base.costOfSales) }}
          </td>
        </tr>
        <tr class="subtotal-row clickable-row" @click="showToast('Gross Profit', 'Revenue minus Cost of Sales.')">
          <td><strong>Gross Profit <i class="material-icons tiny help-icon">info_outline</i></strong></td>
          <td class="right-align"><strong>{{ fmt(base.grossProfit) }}</strong></td>
          <td v-if="hasComparative" class="right-align"><strong>{{ fmt(comp.grossProfit) }}</strong></td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(comp.grossProfit - base.grossProfit)">
            {{ fmtDelta(comp.grossProfit - base.grossProfit) }}
          </td>
        </tr>

        <!-- OpEx Breakdown -->
        <tr class="clickable-row" @click="showToast('People Costs (Red)', 'Free (unallocated) Red Permanent Resource Cards held by team.')">
          <td class="indent">People Costs (Red) <i class="material-icons tiny help-icon">info_outline</i></td>
          <td class="right-align">{{ fmt(base.peopleCosts) }}</td>
          <td v-if="hasComparative" class="right-align">{{ fmt(comp.peopleCosts) }}</td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(-(comp.peopleCosts - base.peopleCosts))">
            {{ fmtDelta(comp.peopleCosts - base.peopleCosts) }}
          </td>
        </tr>
        <tr class="clickable-row" @click="showToast('Operations Costs (Purple)', 'Free (unallocated) Purple Permanent Resource Cards held by team.')">
          <td class="indent">Operations Costs (Purple) <i class="material-icons tiny help-icon">info_outline</i></td>
          <td class="right-align">{{ fmt(base.operationsCosts) }}</td>
          <td v-if="hasComparative" class="right-align">{{ fmt(comp.operationsCosts) }}</td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(-(comp.operationsCosts - base.operationsCosts))">
            {{ fmtDelta(comp.operationsCosts - base.operationsCosts) }}
          </td>
        </tr>
        <tr class="clickable-row" @click="showToast('Outsourced Costs (Black)', 'Free (unallocated) Black Permanent Resource Cards held by team.')">
          <td class="indent">Outsourced Costs (Black) <i class="material-icons tiny help-icon">info_outline</i></td>
          <td class="right-align">{{ fmt(base.outsourcedCosts) }}</td>
          <td v-if="hasComparative" class="right-align">{{ fmt(comp.outsourcedCosts) }}</td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(-(comp.outsourcedCosts - base.outsourcedCosts))">
            {{ fmtDelta(comp.outsourcedCosts - base.outsourcedCosts) }}
          </td>
        </tr>
        <tr>
          <td class="indent">Total Operating Expenses (OpEx)</td>
          <td class="right-align">({{ fmt(base.totalOpex) }})</td>
          <td v-if="hasComparative" class="right-align">({{ fmt(comp.totalOpex) }})</td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(-(comp.totalOpex - base.totalOpex))">
            {{ fmtDelta(comp.totalOpex - base.totalOpex) }}
          </td>
        </tr>

        <tr class="subtotal-row">
          <td><strong>Operating Profit (PBIT)</strong></td>
          <td class="right-align"><strong>{{ fmt(base.pbit) }}</strong></td>
          <td v-if="hasComparative" class="right-align"><strong>{{ fmt(comp.pbit) }}</strong></td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(comp.pbit - base.pbit)">
            {{ fmtDelta(comp.pbit - base.pbit) }}
          </td>
        </tr>
        <tr>
          <td class="indent">Interest Expense</td>
          <td class="right-align">({{ fmt(base.interestExpense) }})</td>
          <td v-if="hasComparative" class="right-align">({{ fmt(comp.interestExpense) }})</td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(-(comp.interestExpense - base.interestExpense))">
            {{ fmtDelta(comp.interestExpense - base.interestExpense) }}
          </td>
        </tr>
        <tr>
          <td class="indent">Profit Before Tax (PBT)</td>
          <td class="right-align">{{ fmt(base.pbt) }}</td>
          <td v-if="hasComparative" class="right-align">{{ fmt(comp.pbt) }}</td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(comp.pbt - base.pbt)">
            {{ fmtDelta(comp.pbt - base.pbt) }}
          </td>
        </tr>
        <tr>
          <td class="indent">Taxation</td>
          <td class="right-align">({{ fmt(base.taxation) }})</td>
          <td v-if="hasComparative" class="right-align">({{ fmt(comp.taxation) }})</td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(-(comp.taxation - base.taxation))">
            {{ fmtDelta(comp.taxation - base.taxation) }}
          </td>
        </tr>
        <tr class="total-row grey lighten-4">
          <td><strong>NET PROFIT</strong></td>
          <td class="right-align"><strong class="teal-text text-darken-3">{{ fmt(base.netProfit) }}</strong></td>
          <td v-if="hasComparative" class="right-align"><strong>{{ fmt(comp.netProfit) }}</strong></td>
          <td v-if="hasComparative" class="right-align" :class="deltaClass(comp.netProfit - base.netProfit)">
            <strong>{{ fmtDelta(comp.netProfit - base.netProfit) }}</strong>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Collapsible Workings Drawer (§7.5) -->
    <div class="workings-section margin-top-10">
      <button class="btn-flat btn-small waves-effect grey-text text-darken-2" @click="showWorkings = !showWorkings">
        <i class="material-icons left tiny">help_outline</i>
        {{ showWorkings ? 'Hide Workings' : 'Show Workings' }}
      </button>

      <div v-if="showWorkings" class="workings-box card-panel grey lighten-4">
        <h6><strong>Resource Allocation Workings (Base Contract)</strong></h6>
        <div v-if="workings.alreadyRealised" class="chip teal white-text">
          Secret Contract Already Completed — Reported as Realised
        </div>
        <table class="bordered condensed-table margin-top-5">
          <thead>
            <tr>
              <th>Resource Category</th>
              <th class="center-align">Required</th>
              <th class="center-align">Held</th>
              <th class="center-align">Allocated</th>
              <th class="center-align">Free (OpEx/NCA)</th>
              <th class="center-align">Unmet</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in colorRows" :key="c.color">
              <td>
                <span class="color-badge" :style="{ background: c.hex }"></span>
                {{ c.label }}
              </td>
              <td class="center-align">{{ workings.required[c.color] || 0 }}</td>
              <td class="center-align">{{ workings.held[c.color] || 0 }}</td>
              <td class="center-align">{{ workings.allocated[c.color] || 0 }}</td>
              <td class="center-align">{{ workings.free[c.color] || 0 }}</td>
              <td class="center-align" :class="{ 'red-text fw-bold': (workings.unmet[c.color] || 0) > 0 }">
                {{ workings.unmet[c.color] || 0 }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="workings-summary margin-top-5">
          <small>Unmet Resource Penalty: <strong>-{{ workings.unmetCards || 0 }} pts</strong></small> |
          <small>Unmet Production Penalty: <strong>-{{ workings.unmetProduction || 0 }} pts</strong></small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import M from 'materialize-css'

export default {
  name: 'IncomeStatement',
  props: {
    baseData: {
      type: Object,
      required: true
    },
    comparativeData: {
      type: Object,
      default: null
    },
    workings: {
      type: Object,
      default: () => ({ required: {}, held: {}, allocated: {}, free: {}, unmet: {} })
    }
  },
  setup(props) {
    const showWorkings = ref(false)

    const showToast = (title, explanation) => {
      M.toast({
        html: `<div style="line-height: 1.4;"><strong>${title}:</strong> ${explanation}</div>`,
        displayLength: 4000
      })
    }

    const base = computed(() => props.baseData || {})
    const comp = computed(() => props.comparativeData?.incomeStatement || {})
    const hasComparative = computed(() => !!props.comparativeData)

    const colorRows = [
      { color: 'green', label: 'Property (Green)', hex: '#007b46' },
      { color: 'yellow', label: 'Equipment (Yellow)', hex: '#fdb410' },
      { color: 'red', label: 'People (Red)', hex: '#e21234' },
      { color: 'purple', label: 'Operations (Purple)', hex: '#692586' },
      { color: 'black', label: 'Outsource (Black)', hex: '#000000' }
    ]

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
      showWorkings,
      showToast,
      base,
      comp,
      hasComparative,
      colorRows,
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

.margin-top-10 {
  margin-top: 10px;
}

.margin-top-5 {
  margin-top: 5px;
}

.workings-box {
  padding: 10px;
  border-radius: 6px;
}

.color-badge {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 4px;
}

.condensed-table th, .condensed-table td {
  padding: 4px 6px;
  font-size: 0.78rem;
}
</style>
