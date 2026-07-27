<template>
  <div class="financial-statement-card card-panel white z-depth-1">
    <div class="statement-header">
      <h6 class="statement-title">
        <i class="material-icons tiny teal-text">show_chart</i>
        Financial Ratios
        <span v-if="hasComparative" class="comp-badge blue lighten-5 blue-text text-darken-3 font-weight-bold">
          Base | Comparative
        </span>
      </h6>
    </div>

    <div class="row">
      <!-- Profitability -->
      <div class="col s12 m6 l3">
        <div class="ratio-group card-panel grey lighten-4">
          <h6 class="ratio-group-title">Profitability</h6>
          <div class="ratio-row clickable" @click="showToast('Gross Margin', 'Gross Profit ÷ Revenue')">
            <span>Gross Margin <i class="material-icons tiny help-icon">info_outline</i></span>
            <div class="ratio-val-box">
              <strong class="base-val">{{ fmtPct(baseRatios.profitability?.grossProfitMargin) }}</strong>
              <span v-if="hasComparative" class="comp-val blue-text text-darken-3"> | {{ fmtPct(compRatios?.profitability?.grossProfitMargin) }}</span>
            </div>
          </div>
          <div class="ratio-row clickable" @click="showToast('Operating Margin', 'Operating Profit (PBIT) ÷ Revenue')">
            <span>Operating Margin <i class="material-icons tiny help-icon">info_outline</i></span>
            <div class="ratio-val-box">
              <strong class="base-val">{{ fmtPct(baseRatios.profitability?.operatingMargin) }}</strong>
              <span v-if="hasComparative" class="comp-val blue-text text-darken-3"> | {{ fmtPct(compRatios?.profitability?.operatingMargin) }}</span>
            </div>
          </div>
          <div class="ratio-row clickable" @click="showToast('Net Margin', 'Net Profit ÷ Revenue')">
            <span>Net Margin <i class="material-icons tiny help-icon">info_outline</i></span>
            <div class="ratio-val-box">
              <strong class="base-val">{{ fmtPct(baseRatios.profitability?.netProfitMargin) }}</strong>
              <span v-if="hasComparative" class="comp-val blue-text text-darken-3"> | {{ fmtPct(compRatios?.profitability?.netProfitMargin) }}</span>
            </div>
          </div>
          <div class="ratio-row clickable" @click="showToast('ROA', 'Return on Assets = Net Profit ÷ Total Assets')">
            <span>ROA <i class="material-icons tiny help-icon">info_outline</i></span>
            <div class="ratio-val-box">
              <strong class="base-val">{{ fmtPct(baseRatios.profitability?.roa) }}</strong>
              <span v-if="hasComparative" class="comp-val blue-text text-darken-3"> | {{ fmtPct(compRatios?.profitability?.roa) }}</span>
            </div>
          </div>
          <div class="ratio-row clickable" @click="showToast('ROE', 'Return on Equity = Net Profit ÷ Equity')">
            <span>ROE <i class="material-icons tiny help-icon">info_outline</i></span>
            <div class="ratio-val-box">
              <strong class="base-val">{{ fmtPct(baseRatios.profitability?.roe) }}</strong>
              <span v-if="hasComparative" class="comp-val blue-text text-darken-3"> | {{ fmtPct(compRatios?.profitability?.roe) }}</span>
            </div>
          </div>
          <div class="ratio-row clickable" @click="showToast('ROCE', 'Return on Capital Employed = PBIT ÷ (Equity + Long-Term Debt)')">
            <span>ROCE <i class="material-icons tiny help-icon">info_outline</i></span>
            <div class="ratio-val-box">
              <strong class="base-val">{{ fmtPct(baseRatios.profitability?.roce) }}</strong>
              <span v-if="hasComparative" class="comp-val blue-text text-darken-3"> | {{ fmtPct(compRatios?.profitability?.roce) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Liquidity -->
      <div class="col s12 m6 l3">
        <div class="ratio-group card-panel grey lighten-4">
          <h6 class="ratio-group-title">Liquidity</h6>
          <div class="ratio-row clickable" @click="showToast('Current Ratio', 'Total Current Assets ÷ Total Current Liabilities')">
            <span>Current Ratio <i class="material-icons tiny help-icon">info_outline</i></span>
            <div class="ratio-val-box">
              <strong class="base-val">{{ fmtRatio(baseRatios.liquidity?.currentRatio) }}</strong>
              <span v-if="hasComparative" class="comp-val blue-text text-darken-3"> | {{ fmtRatio(compRatios?.liquidity?.currentRatio) }}</span>
            </div>
          </div>
          <div class="ratio-row clickable" @click="showToast('Quick Ratio', '(Current Assets - Inventory) ÷ Current Liabilities')">
            <span>Quick Ratio <i class="material-icons tiny help-icon">info_outline</i></span>
            <div class="ratio-val-box">
              <strong class="base-val">{{ fmtRatio(baseRatios.liquidity?.quickRatio) }}</strong>
              <span v-if="hasComparative" class="comp-val blue-text text-darken-3"> | {{ fmtRatio(compRatios?.liquidity?.quickRatio) }}</span>
            </div>
          </div>
          <div class="ratio-row clickable" @click="showToast('Cash Ratio', 'Cash ÷ Current Liabilities')">
            <span>Cash Ratio <i class="material-icons tiny help-icon">info_outline</i></span>
            <div class="ratio-val-box">
              <strong class="base-val">{{ fmtRatio(baseRatios.liquidity?.cashRatio) }}</strong>
              <span v-if="hasComparative" class="comp-val blue-text text-darken-3"> | {{ fmtRatio(compRatios?.liquidity?.cashRatio) }}</span>
            </div>
          </div>
          <div class="ratio-row clickable" @click="showToast('Working Capital', 'Total Current Assets - Total Current Liabilities')">
            <span>Working Capital <i class="material-icons tiny help-icon">info_outline</i></span>
            <div class="ratio-val-box">
              <strong class="base-val">{{ fmtMoney(baseRatios.liquidity?.workingCapital) }}</strong>
              <span v-if="hasComparative" class="comp-val blue-text text-darken-3"> | {{ fmtMoney(compRatios?.liquidity?.workingCapital) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Solvency / Gearing -->
      <div class="col s12 m6 l3">
        <div class="ratio-group card-panel grey lighten-4">
          <h6 class="ratio-group-title">Solvency &amp; Gearing</h6>
          <div class="ratio-row clickable" @click="showToast('Debt-to-Equity', 'Total Liabilities ÷ Equity')">
            <span>Debt-to-Equity <i class="material-icons tiny help-icon">info_outline</i></span>
            <div class="ratio-val-box">
              <strong class="base-val">{{ fmtRatio(baseRatios.solvency?.debtToEquity) }}</strong>
              <span v-if="hasComparative" class="comp-val blue-text text-darken-3"> | {{ fmtRatio(compRatios?.solvency?.debtToEquity) }}</span>
            </div>
          </div>
          <div class="ratio-row clickable" @click="showToast('Debt-to-Assets', 'Total Liabilities ÷ Total Assets')">
            <span>Debt-to-Assets <i class="material-icons tiny help-icon">info_outline</i></span>
            <div class="ratio-val-box">
              <strong class="base-val">{{ fmtPct(baseRatios.solvency?.debtToAssets) }}</strong>
              <span v-if="hasComparative" class="comp-val blue-text text-darken-3"> | {{ fmtPct(compRatios?.solvency?.debtToAssets) }}</span>
            </div>
          </div>
          <div class="ratio-row clickable" @click="showToast('Gearing', 'Non-Current Liabilities ÷ (Equity + Long-Term Debt)')">
            <span>Gearing <i class="material-icons tiny help-icon">info_outline</i></span>
            <div class="ratio-val-box">
              <strong class="base-val">{{ fmtPct(baseRatios.solvency?.gearing) }}</strong>
              <span v-if="hasComparative" class="comp-val blue-text text-darken-3"> | {{ fmtPct(compRatios?.solvency?.gearing) }}</span>
            </div>
          </div>
          <div class="ratio-row clickable" @click="showToast('Interest Cover', 'Operating Profit (PBIT) ÷ Interest Expense')">
            <span>Interest Cover <i class="material-icons tiny help-icon">info_outline</i></span>
            <div class="ratio-val-box">
              <strong class="base-val">{{ fmtRatio(baseRatios.solvency?.interestCover, '×') }}</strong>
              <span v-if="hasComparative" class="comp-val blue-text text-darken-3"> | {{ fmtRatio(compRatios?.solvency?.interestCover, '×') }}</span>
            </div>
          </div>
          <div class="ratio-row clickable" @click="showToast('Equity Ratio', 'Equity ÷ Total Assets')">
            <span>Equity Ratio <i class="material-icons tiny help-icon">info_outline</i></span>
            <div class="ratio-val-box">
              <strong class="base-val">{{ fmtPct(baseRatios.solvency?.equityRatio) }}</strong>
              <span v-if="hasComparative" class="comp-val blue-text text-darken-3"> | {{ fmtPct(compRatios?.solvency?.equityRatio) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Efficiency -->
      <div class="col s12 m6 l3">
        <div class="ratio-group card-panel grey lighten-4">
          <h6 class="ratio-group-title">Efficiency</h6>
          <div class="ratio-row clickable" @click="showToast('Asset Turnover', 'Revenue ÷ Total Assets')">
            <span>Asset Turnover <i class="material-icons tiny help-icon">info_outline</i></span>
            <div class="ratio-val-box">
              <strong class="base-val">{{ fmtRatio(baseRatios.efficiency?.assetTurnover, '×') }}</strong>
              <span v-if="hasComparative" class="comp-val blue-text text-darken-3"> | {{ fmtRatio(compRatios?.efficiency?.assetTurnover, '×') }}</span>
            </div>
          </div>
          <div class="ratio-row clickable" @click="showToast('Inventory Turnover', 'Cost of Sales ÷ Inventory')">
            <span>Inventory Turnover <i class="material-icons tiny help-icon">info_outline</i></span>
            <div class="ratio-val-box">
              <strong class="base-val">{{ fmtRatio(baseRatios.efficiency?.inventoryTurnover, '×') }}</strong>
              <span v-if="hasComparative" class="comp-val blue-text text-darken-3"> | {{ fmtRatio(compRatios?.efficiency?.inventoryTurnover, '×') }}</span>
            </div>
          </div>
          <div class="ratio-row clickable" @click="showToast('Debtors Days', '(Trade Debtors ÷ Revenue) × 365 days')">
            <span>Debtors Days <i class="material-icons tiny help-icon">info_outline</i></span>
            <div class="ratio-val-box">
              <strong class="base-val">{{ fmtDays(baseRatios.efficiency?.debtorsDays) }}</strong>
              <span v-if="hasComparative" class="comp-val blue-text text-darken-3"> | {{ fmtDays(compRatios?.efficiency?.debtorsDays) }}</span>
            </div>
          </div>
          <div class="ratio-row clickable" @click="showToast('WC Turnover', 'Revenue ÷ Working Capital')">
            <span>WC Turnover <i class="material-icons tiny help-icon">info_outline</i></span>
            <div class="ratio-val-box">
              <strong class="base-val">{{ fmtRatio(baseRatios.efficiency?.workingCapitalTurnover, '×') }}</strong>
              <span v-if="hasComparative" class="comp-val blue-text text-darken-3"> | {{ fmtRatio(compRatios?.efficiency?.workingCapitalTurnover, '×') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footnote-text grey-text text-darken-1">
      <i class="material-icons tiny">info_outline</i>
      <em>Financial Ratios calculated from current financial period figures. Click any ratio to view origin toast.</em>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import M from 'materialize-css'

export default {
  name: 'RatioPack',
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
    const baseRatios = computed(() => props.baseData?.ratios || {})
    const compRatios = computed(() => props.comparativeData?.ratios || null)
    const hasComparative = computed(() => !!props.comparativeData?.ratios)

    const showToast = (title, explanation) => {
      M.toast({
        html: `<div style="line-height: 1.4;"><strong>${title}:</strong> ${explanation}</div>`,
        displayLength: 4000
      })
    }

    const fmtPct = (val) => {
      if (val === undefined || val === null || isNaN(val)) return '-'
      return (val * 100).toFixed(1) + '%'
    }

    const fmtRatio = (val, suffix = '') => {
      if (val === undefined || val === null || isNaN(val)) return '-'
      return val.toFixed(2) + suffix
    }

    const fmtMoney = (val) => {
      if (val === undefined || val === null || isNaN(val)) return '-'
      return 'G$ ' + val.toFixed(2)
    }

    const fmtDays = (val) => {
      if (val === undefined || val === null || isNaN(val)) return '-'
      return val.toFixed(1) + ' days'
    }

    return {
      baseRatios,
      compRatios,
      hasComparative,
      showToast,
      fmtPct,
      fmtRatio,
      fmtMoney,
      fmtDays
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

.ratio-group {
  padding: 10px;
  border-radius: 6px;
  min-height: 190px;
  border: 1px solid #e0e0e0;
}

.ratio-group-title {
  font-weight: 700;
  font-size: 0.82rem;
  text-transform: uppercase;
  color: #37474f;
  border-bottom: 1px solid #cfd8dc;
  padding-bottom: 4px;
  margin: 0 0 8px 0;
}

.ratio-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
  padding: 3px 6px;
  border-radius: 4px;
}

.clickable {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.clickable:hover {
  background-color: #e0f2f1;
}

.help-icon {
  font-size: 0.85rem;
  color: #78909c;
  vertical-align: middle;
  margin-left: 2px;
}

.comp-badge {
  margin-left: auto;
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px solid #90caf9;
}

.ratio-val-box {
  display: flex;
  align-items: center;
  gap: 2px;
}

.comp-val {
  font-weight: 700;
  font-size: 0.78rem;
}

.footnote-text {
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 10px;
}
</style>
