<template>
  <div class="all-teams-financials card-panel white z-depth-1">
    <div class="table-header">
      <h5 class="table-title">
        <i class="material-icons teal-text">assessment</i>
        All Teams Financial Comparison
      </h5>
      <span class="grey-text text-darken-1 hide-on-small-only">
        Debrief View (Reported on Secret Contracts)
      </span>
    </div>

    <div class="table-container">
      <table class="striped centered responsive-table comparison-table">
        <thead>
          <tr>
            <th class="left-align text-column">Metric</th>
            <th v-for="team in teams" :key="team.seat" class="team-header-cell">
              <div class="team-chip" :style="{ backgroundColor: getSeatColor(team.seat) }">
                Team {{ team.seat }} {{ team.name ? `(${team.name})` : '' }}
              </div>
              <small class="basis-label hide-on-spectator">
                {{ team.secretContractCompleted ? 'Secret Realised' : 'Secret Contract' }}
              </small>
              <small class="basis-label show-on-spectator">
                Secret Basis
              </small>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Income Statement Metrics -->
          <tr class="section-title-row">
            <td :colspan="teams.length + 1" class="left-align"><strong>INCOME STATEMENT</strong></td>
          </tr>
          <tr>
            <td class="left-align">Revenue</td>
            <td v-for="t in teams" :key="t.seat" :class="highlightClass(t.seat, 'revenue', true)">
              G$ {{ fmt(t.data.incomeStatement.revenue) }}
            </td>
          </tr>
          <tr>
            <td class="left-align">Gross Profit</td>
            <td v-for="t in teams" :key="t.seat" :class="highlightClass(t.seat, 'grossProfit', true)">
              G$ {{ fmt(t.data.incomeStatement.grossProfit) }}
            </td>
          </tr>
          <tr>
            <td class="left-align">Total OpEx</td>
            <td v-for="t in teams" :key="t.seat">
              (G$ {{ fmt(t.data.incomeStatement.totalOpex) }})
            </td>
          </tr>
          <tr class="subtotal-row">
            <td class="left-align"><strong>PBIT (Operating Profit)</strong></td>
            <td v-for="t in teams" :key="t.seat" :class="highlightClass(t.seat, 'pbit', true)">
              <strong>G$ {{ fmt(t.data.incomeStatement.pbit) }}</strong>
            </td>
          </tr>
          <tr class="total-row grey lighten-4">
            <td class="left-align"><strong>NET PROFIT</strong></td>
            <td v-for="t in teams" :key="t.seat" :class="highlightClass(t.seat, 'netProfit', true)">
              <strong class="teal-text text-darken-3">G$ {{ fmt(t.data.incomeStatement.netProfit) }}</strong>
            </td>
          </tr>

          <!-- Balance Sheet Metrics -->
          <tr class="section-title-row">
            <td :colspan="teams.length + 1" class="left-align"><strong>BALANCE SHEET</strong></td>
          </tr>
          <tr>
            <td class="left-align">Total Assets</td>
            <td v-for="t in teams" :key="t.seat" :class="highlightClass(t.seat, 'totalAssets', true)">
              G$ {{ fmt(t.data.balanceSheet.totalAssets) }}
            </td>
          </tr>
          <tr>
            <td class="left-align">Total Liabilities</td>
            <td v-for="t in teams" :key="t.seat">
              G$ {{ fmt(t.data.balanceSheet.totalLiabilities) }}
            </td>
          </tr>
          <tr class="total-row teal lighten-5">
            <td class="left-align"><strong>EQUITY (NET ASSETS)</strong></td>
            <td v-for="t in teams" :key="t.seat" :class="highlightClass(t.seat, 'equity', true)">
              <strong class="teal-text text-darken-4">G$ {{ fmt(t.data.balanceSheet.equity) }}</strong>
            </td>
          </tr>

          <!-- Headline Ratios -->
          <tr class="section-title-row">
            <td :colspan="teams.length + 1" class="left-align"><strong>HEADLINE RATIOS</strong></td>
          </tr>
          <tr>
            <td class="left-align">Net Margin (%)</td>
            <td v-for="t in teams" :key="t.seat" :class="highlightClass(t.seat, 'netProfitMargin', true, 'profitability')">
              {{ fmtPct(t.data.ratios.profitability.netProfitMargin) }}
            </td>
          </tr>
          <tr>
            <td class="left-align">Current Ratio</td>
            <td v-for="t in teams" :key="t.seat" :class="highlightClass(t.seat, 'currentRatio', true, 'liquidity')">
              {{ fmtRatio(t.data.ratios.liquidity.currentRatio) }}
            </td>
          </tr>
          <tr>
            <td class="left-align">Debt-to-Equity</td>
            <td v-for="t in teams" :key="t.seat">
              {{ fmtRatio(t.data.ratios.solvency.debtToEquity) }}
            </td>
          </tr>
          <tr>
            <td class="left-align">ROCE (%)</td>
            <td v-for="t in teams" :key="t.seat" :class="highlightClass(t.seat, 'roce', true, 'profitability')">
              {{ fmtPct(t.data.ratios.profitability.roce) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { computeFinancials } from '../../composables/useFinancials'

export default {
  name: 'AllTeamsTable',
  props: {
    players: {
      type: Array,
      default: () => []
    },
    numPlayers: {
      type: Number,
      default: 4
    },
    config: {
      type: Object,
      default: () => ({})
    },
    isSpectator: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const seatColors = {
      1: '#1b5e20',
      2: '#b71c1c',
      3: '#f57f17',
      4: '#4a148c'
    }

    const getSeatColor = (seat) => seatColors[seat] || '#37474f'

    const teams = computed(() => {
      const activePlayers = (props.players || []).slice(0, props.numPlayers)
      return activePlayers.map(p => {
        const finData = computeFinancials({
          scores: p.scores || {},
          contractsCompleted: p.contractsCompleted || [],
          reportingContract: p.secretContractCard || null,
          alreadyRealised: !!p.secretContractCompleted,
          config: props.config
        })
        return {
          seat: p.seat,
          name: p.name,
          secretContractCompleted: p.secretContractCompleted,
          data: finData
        }
      })
    })

    const bestValues = computed(() => {
      const best = {}
      const keys = ['revenue', 'grossProfit', 'pbit', 'netProfit', 'totalAssets', 'equity']
      keys.forEach(k => {
        let maxVal = -Infinity
        let bestSeat = null
        teams.value.forEach(t => {
          let val = 0
          if (t.data.incomeStatement[k] !== undefined) val = t.data.incomeStatement[k]
          else if (t.data.balanceSheet[k] !== undefined) val = t.data.balanceSheet[k]

          if (val > maxVal) {
            maxVal = val
            bestSeat = t.seat
          }
        })
        best[k] = bestSeat
      })

      // Ratios
      const ratioKeys = [
        { key: 'netProfitMargin', cat: 'profitability' },
        { key: 'currentRatio', cat: 'liquidity' },
        { key: 'roce', cat: 'profitability' }
      ]
      ratioKeys.forEach(({ key, cat }) => {
        let maxVal = -Infinity
        let bestSeat = null
        teams.value.forEach(t => {
          const val = t.data.ratios[cat][key]
          if (val !== null && val > maxVal) {
            maxVal = val
            bestSeat = t.seat
          }
        })
        best[key] = bestSeat
      })

      return best
    })

    const highlightClass = (seat, key, highIsGood = true, ratioCat = null) => {
      if (bestValues.value[key] === seat) {
        return 'best-cell green lighten-5 font-weight-bold'
      }
      return ''
    }

    const fmt = (val) => {
      if (val === undefined || val === null || isNaN(val)) return '0.00'
      return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    const fmtPct = (val) => {
      if (val === undefined || val === null || isNaN(val)) return '-'
      return (val * 100).toFixed(1) + '%'
    }

    const fmtRatio = (val) => {
      if (val === undefined || val === null || isNaN(val)) return '-'
      return val.toFixed(2)
    }

    return {
      teams,
      getSeatColor,
      highlightClass,
      fmt,
      fmtPct,
      fmtRatio
    }
  }
}
</script>

<style scoped>
.all-teams-financials {
  padding: 16px;
  border-radius: 8px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.table-title {
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 1.2rem;
  color: #263238;
}

.table-container {
  overflow-x: auto;
}

.comparison-table th, .comparison-table td {
  padding: 8px 12px;
  font-size: 0.9rem;
}

.text-column {
  min-width: 180px;
}

.team-header-cell {
  min-width: 160px;
}

.team-chip {
  color: #ffffff;
  font-weight: 700;
  font-size: 0.82rem;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 2px;
}

.basis-label {
  display: block;
  font-size: 0.72rem;
  color: #78909c;
}

.section-title-row td {
  font-size: 0.75rem;
  color: #455a64;
  letter-spacing: 0.5px;
  background-color: #f5f5f5;
  padding: 4px 8px;
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

.best-cell {
  border: 1px solid #81c784;
}

.font-weight-bold {
  font-weight: 700;
}
</style>
