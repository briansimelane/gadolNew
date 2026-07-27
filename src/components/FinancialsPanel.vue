<template>
  <div class="financials-full-page-container">
    <div class="financials-page-content">
      <!-- Full Page Header Bar & Navigation -->
      <div class="panel-header teal darken-3 white-text">
        <div class="header-left">
          <button class="btn green darken-2 waves-effect return-btn" @click="$emit('close')">
            <i class="material-icons left">arrow_back</i> Return to Game
          </button>
          <div>
            <h5 class="header-title">Financial Statements &amp; Analysis</h5>
            <small class="header-subtitle">
              {{ gameData?.name || 'Game Room' }} | Turn {{ gameData?.turnNumber || 1 }}
              <span class="live-chip">LIVE</span>
            </small>
          </div>
        </div>
        <button class="btn-flat white-text close-btn waves-effect" @click="$emit('close')" title="Return to Simulation Game">
          <i class="material-icons">close</i>
        </button>
      </div>

        <!-- Role Navigation Tabs (Facilitator/Admin) -->
        <div v-if="isFacilitatorOrAdmin" class="view-tabs teal darken-2 white-text">
          <button 
            class="tab-btn waves-effect" 
            :class="{ active: activeTab === 'byTeam' }" 
            @click="activeTab = 'byTeam'"
          >
            <i class="material-icons tiny">person</i> By Team Statement
          </button>
          <button 
            class="tab-btn waves-effect" 
            :class="{ active: activeTab === 'allTeams' }" 
            @click="activeTab = 'allTeams'"
          >
            <i class="material-icons tiny">groups</i> All Teams Debrief
          </button>
        </div>

        <!-- Panel Body Content -->
        <div class="panel-body grey lighten-4">
          
          <!-- Facilitator Assumptions Panel (Top of Facilitator View) -->
          <AssumptionsPanel 
            v-if="isFacilitatorOrAdmin" 
            :config="financialsConfig" 
            @updateConfig="handleUpdateConfig" 
          />

          <!-- 1. SPECTATOR VIEW -->
          <div v-if="role === 'SPECTATOR' || (isFacilitatorOrAdmin && activeTab === 'allTeams')">
            <AllTeamsTable 
              :players="gameData?.players || []" 
              :numPlayers="numPlayers" 
              :config="financialsConfig"
              :isSpectator="role === 'SPECTATOR'" 
            />
          </div>

          <!-- 2. FACILITATOR BY-TEAM VIEW -->
          <div v-else-if="isFacilitatorOrAdmin && activeTab === 'byTeam'">
            <div class="team-selector-chips margin-bottom-12">
              <button 
                v-for="p in activePlayers" 
                :key="p.seat" 
                class="btn-flat seat-chip waves-effect" 
                :class="{ active: selectedSeat === p.seat }" 
                :style="selectedSeat === p.seat ? { backgroundColor: getSeatColor(p.seat), color: '#fff' } : {}"
                @click="selectedSeat = p.seat"
              >
                Team {{ p.seat }} {{ p.name ? `(${p.name})` : '' }}
              </button>
            </div>

            <!-- Selected Team View -->
            <div v-if="selectedPlayer" class="team-financial-container">
              <!-- Comparative What-If Controls -->
              <div class="comparative-controls card-panel white z-depth-1 margin-bottom-12">
                <div class="row margin-bottom-0 align-items-center">
                  <div class="col s12 m6">
                    <label class="control-label">Comparative What-If Analysis:</label>
                    <select class="browser-default" v-model="selectedCompRef">
                      <option value="">-- None (Base Secret Contract Only) --</option>
                      <option v-for="c in marketContracts" :key="c.Ref" :value="c.Ref">
                        Market Contract: {{ c.Ref }} (Val: {{ c.Value }} pts, Cash: G${{ c.Cash }})
                      </option>
                    </select>
                  </div>
                  <div class="col s12 m6 right-align hide-on-small-only">
                    <span v-if="selectedPlayer.secretContractCompleted" class="chip teal white-text">
                      <i class="material-icons tiny">verified</i> Secret Realised
                    </span>
                    <span v-else class="chip grey lighten-2 black-text">
                      Base: Secret Contract
                    </span>
                  </div>
                </div>
              </div>

              <!-- Cards Header (Base Secret Card vs Comparative Card) -->
              <div class="cards-preview-row margin-bottom-12">
                <div class="card-preview-item">
                  <span class="preview-label">Base: Team {{ selectedPlayer.seat }} Secret Contract</span>
                  <ContractCard v-if="selectedPlayer.secretContractCard" :card="selectedPlayer.secretContractCard" :interactive="false" />
                </div>
                <div v-if="selectedCompCard" class="card-preview-item">
                  <span class="preview-label">Comparative What-If Contract</span>
                  <ContractCard :card="selectedCompCard" :interactive="false" />
                </div>
              </div>

              <!-- Financial Statements -->
              <IncomeStatement 
                :baseData="baseFinData.incomeStatement" 
                :comparativeData="compFinData" 
                :workings="baseFinData.workings" 
              />
              <BalanceSheet 
                :baseData="baseFinData.balanceSheet" 
                :comparativeData="compFinData" 
              />
              <RatioPack :baseData="baseFinData" />
            </div>
          </div>

          <!-- 3. PLAYER VIEW (ONLY THEIR OWN TEAM) -->
          <div v-else-if="role === 'PLAYER' && ownPlayer">
            <div class="player-team-header card-panel white z-depth-1 margin-bottom-12">
              <div class="row margin-bottom-0 align-items-center">
                <div class="col s12 m6">
                  <h6 class="margin-0 font-weight-bold">
                    Team {{ ownPlayer.seat }} Financial Statements
                  </h6>
                </div>
                <div class="col s12 m6">
                  <label class="control-label">Comparative What-If Analysis:</label>
                  <select class="browser-default" v-model="selectedCompRef">
                    <option value="">-- None (Base Secret Contract Only) --</option>
                    <option v-for="c in marketContracts" :key="c.Ref" :value="c.Ref">
                      Market Contract: {{ c.Ref }} (Val: {{ c.Value }} pts, Cash: G${{ c.Cash }})
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Cards & Team Current Standing Row -->
            <div class="cards-preview-row margin-bottom-12">
              <div v-if="viewingPlayer && viewingPlayer.secretContractCard" class="card-preview-item">
                <span class="preview-label">Base: Team {{ viewingPlayer.seat }} Secret Contract</span>
                <div v-if="viewingPlayer.secretContractCompleted" class="chip teal white-text margin-bottom-6">
                  Secret Contract Realised &amp; Completed
                </div>
                <ContractCard :card="viewingPlayer.secretContractCard" :interactive="false" />
              </div>
              <div v-if="selectedCompCard" class="card-preview-item">
                <span class="preview-label">Comparative What-If Contract</span>
                <ContractCard :card="selectedCompCard" :interactive="false" />
              </div>
              <div v-if="viewingPlayer" class="team-standing-preview-item">
                <span class="preview-label">Team {{ viewingPlayer.seat }} Current Standing</span>
                <ScoreboardColorMatrix 
                  :teams="[viewingPlayer]" 
                  :currentTurnIndex="gameData?.currentPlayer" 
                  :roomName="gameData?.name" 
                  :hideHeader="true"
                />
              </div>
            </div>

            <!-- Statements & Ratios -->
            <IncomeStatement 
              :baseData="playerBaseFinData.incomeStatement" 
              :comparativeData="playerCompFinData" 
              :workings="playerBaseFinData.workings" 
            />
            <BalanceSheet 
              :baseData="playerBaseFinData.balanceSheet" 
              :comparativeData="playerCompFinData" 
            />
            <RatioPack 
              :baseData="playerBaseFinData" 
              :comparativeData="playerCompFinData" 
            />
          </div>

          <div v-else class="center-align padding-20">
            <p class="grey-text">Loading financial statements...</p>
          </div>

        </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { computeFinancials, DEFAULT_FINANCIALS_CONFIG } from '../composables/useFinancials'
import AssumptionsPanel from './financials/AssumptionsPanel.vue'
import IncomeStatement from './financials/IncomeStatement.vue'
import BalanceSheet from './financials/BalanceSheet.vue'
import RatioPack from './financials/RatioPack.vue'
import AllTeamsTable from './financials/AllTeamsTable.vue'
import ContractCard from './cards/ContractCard.vue'
import ScoreboardColorMatrix from './ScoreboardColorMatrix.vue'
import { updateDoc } from 'firebase/firestore'

export default {
  name: 'FinancialsPanel',
  components: {
    AssumptionsPanel,
    IncomeStatement,
    BalanceSheet,
    RatioPack,
    AllTeamsTable,
    ContractCard,
    ScoreboardColorMatrix
  },
  props: {
    gameData: {
      type: Object,
      required: true
    },
    roomDocRef: {
      type: Object,
      default: null
    },
    role: {
      type: String,
      default: 'PLAYER'
    },
    seat: {
      type: Number,
      default: null
    }
  },
  emits: ['close'],
  setup(props) {
    const activeTab = ref('byTeam')
    const selectedSeat = ref(1)
    const selectedCompRef = ref('')

    const isFacilitatorOrAdmin = computed(() => {
      return props.role === 'FACILITATOR' || props.role === 'ADMIN'
    })

    const numPlayers = computed(() => {
      return parseInt(props.gameData?.numPlayers) || 4
    })

    const activePlayers = computed(() => {
      return (props.gameData?.players || []).slice(0, numPlayers.value)
    })

    const ownPlayer = computed(() => {
      if (props.role === 'PLAYER' && props.seat) {
        return props.gameData?.players?.[props.seat - 1] || null
      }
      return null
    })

    const selectedPlayer = computed(() => {
      return props.gameData?.players?.[selectedSeat.value - 1] || activePlayers.value[0] || null
    })

    const viewingPlayer = computed(() => {
      return ownPlayer.value || selectedPlayer.value || null
    })

    const financialsConfig = computed(() => {
      return props.gameData?.financialsConfig || DEFAULT_FINANCIALS_CONFIG
    })

    const marketContracts = computed(() => {
      return (props.gameData?.z00contractCards || []).slice(0, 4)
    })

    const selectedCompCard = computed(() => {
      if (!selectedCompRef.value) return null
      return marketContracts.value.find(c => c.Ref === selectedCompRef.value) || null
    })

    const seatColors = {
      1: '#1b5e20',
      2: '#b71c1c',
      3: '#f57f17',
      4: '#4a148c'
    }
    const getSeatColor = (seat) => seatColors[seat] || '#37474f'

    // Compute Base & Comparative financials for selected Facilitator seat
    const baseFinData = computed(() => {
      const p = selectedPlayer.value
      if (!p) return computeFinancials({})
      return computeFinancials({
        scores: p.scores || {},
        contractsCompleted: p.contractsCompleted || [],
        reportingContract: p.secretContractCard || null,
        alreadyRealised: !!p.secretContractCompleted,
        config: financialsConfig.value
      })
    })

    const compFinData = computed(() => {
      const p = selectedPlayer.value
      if (!p || !selectedCompCard.value) return null
      return computeFinancials({
        scores: p.scores || {},
        contractsCompleted: p.contractsCompleted || [],
        reportingContract: selectedCompCard.value,
        alreadyRealised: false,
        config: financialsConfig.value
      })
    })

    // Compute Base & Comparative financials for active Player
    const playerBaseFinData = computed(() => {
      const p = ownPlayer.value
      if (!p) return computeFinancials({})
      return computeFinancials({
        scores: p.scores || {},
        contractsCompleted: p.contractsCompleted || [],
        reportingContract: p.secretContractCard || null,
        alreadyRealised: !!p.secretContractCompleted,
        config: financialsConfig.value
      })
    })

    const playerCompFinData = computed(() => {
      const p = ownPlayer.value
      if (!p || !selectedCompCard.value) return null
      return computeFinancials({
        scores: p.scores || {},
        contractsCompleted: p.contractsCompleted || [],
        reportingContract: selectedCompCard.value,
        alreadyRealised: false,
        config: financialsConfig.value
      })
    })

    const handleUpdateConfig = (newConfig) => {
      if (!props.roomDocRef || !isFacilitatorOrAdmin.value) return
      updateDoc(props.roomDocRef, {
        financialsConfig: newConfig
      }).catch(err => console.error('Error updating financialsConfig:', err))
    }

    return {
      activeTab,
      selectedSeat,
      selectedCompRef,
      isFacilitatorOrAdmin,
      numPlayers,
      activePlayers,
      ownPlayer,
      selectedPlayer,
      viewingPlayer,
      financialsConfig,
      marketContracts,
      selectedCompCard,
      getSeatColor,
      baseFinData,
      compFinData,
      playerBaseFinData,
      playerCompFinData,
      handleUpdateConfig
    }
  }
}
</script>

<style scoped>
.financials-full-page-container {
  width: 100%;
  min-height: calc(100vh - 60px);
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.financials-page-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex: 1;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.return-btn {
  font-weight: 700;
  border-radius: 20px;
  text-transform: none;
}

.panel-header {
  padding: 12px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
}

.header-subtitle {
  opacity: 0.9;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.live-chip {
  background: #ff5252;
  color: #fff;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.close-btn {
  padding: 0;
  margin: 0;
  min-width: 36px;
}

.view-tabs {
  display: flex;
  gap: 4px;
  padding: 4px 12px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.tab-btn {
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.85);
  padding: 6px 14px;
  border-radius: 4px 4px 0 0;
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tab-btn.active {
  background: #f5f5f5;
  color: #004d40;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.team-selector-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.seat-chip {
  border: 1px solid #b0bec5;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: none;
}

.comparative-controls {
  padding: 10px 14px;
  border-radius: 8px;
}

.control-label {
  font-weight: 700;
  font-size: 0.8rem;
  color: #37474f;
}

.cards-preview-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: flex-start;
}

.card-preview-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.team-standing-preview-item {
  width: 420px;
  max-width: 420px;
  flex: 0 0 420px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.preview-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #546e7a;
  margin-bottom: 4px;
}

.margin-bottom-12 { margin-bottom: 12px; }
.margin-bottom-6 { margin-bottom: 6px; }
.margin-bottom-0 { margin-bottom: 0; }
.margin-0 { margin: 0; }
.padding-20 { padding: 20px; }
.font-weight-bold { font-weight: 700; }
.align-items-center { align-items: center; }

@media (max-width: 600px) {
  .financials-panel-drawer {
    width: 100vw;
  }
}
</style>
