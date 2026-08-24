<template>
  <teleport to="#modals">
    <div 
      class="zoom-backdrop" 
      v-if="zoomedCard" 
      @click.self="closeZoom"
      role="dialog"
      aria-modal="true"
    >
      <div class="zoom-container">
        <!-- Close Button -->
        <button class="zoom-close-btn" @click="closeZoom" aria-label="Close zoom">&times;</button>

        <div class="zoom-card-wrapper">
          <ResourceCard 
            v-if="zoomType === 'resource' || zoomType === 'upcoming'" 
            :card="zoomedCard" 
            :color="zoomColor" 
            :interactive="false"
            :scale="cardScale"
          />
          <ContractCard 
            v-else-if="zoomType === 'contract'" 
            :card="zoomedCard" 
            :interactive="false"
            :scale="cardScale"
          />
        </div>

        <!-- Action / Info Panel -->
        <div class="zoom-panel">
          <h5 class="zoom-title">
            <span v-if="zoomType === 'upcoming'">Upcoming {{ cardCategoryName }} Card</span>
            <span v-else-if="zoomType === 'resource'">{{ cardCategoryName }} Card</span>
            <span v-else>Contract Card</span>
          </h5>

          <div class="zoom-instructions">
            <div v-if="zoomType === 'upcoming'" style="padding: 12px; background: #e0f2f1; border-radius: 8px; border-left: 4px solid #00796b; margin-top: 5px;">
              <p style="margin: 0; font-weight: 600; color: #004d40; font-size: 0.95rem;">
                <i class="material-icons tiny" style="vertical-align: middle; margin-right: 4px;">schedule</i>
                Upcoming Card
              </p>
              <p style="margin: 6px 0 0 0; font-size: 0.88rem; color: #00695c;">
                This card is currently in the upcoming queue. It will move into the active market once top cards are purchased.
              </p>
            </div>
            <ul v-else-if="zoomType === 'resource'">
              <li>A permanent resource card may be bought with a combination of other permanent resources (cards) or temporary resources (tokens).</li>
              <li>The number on the top left of the card shows its value of Production.</li>
            </ul>
            <ul v-else>
              <li>A Contract card can only be fulfilled if you have permanent resources (cards) not temporary resources (tokens).</li>
              <li>The resource cards must produce at least the required Production.</li>
            </ul>
          </div>

          <!-- Manager Reservation & Actions Panel -->
          <div class="zoom-actions" v-if="zoomType === 'upcoming'" style="padding: 10px 0;">
            <p class="grey-text center italic" style="font-size: 0.9rem; margin: 0;">
              <i class="material-icons tiny" style="vertical-align: middle; margin-right: 4px;">lock</i>
              Upcoming cards cannot be purchased yet
            </p>
          </div>
          <div class="zoom-actions" v-else-if="isMyTurn">
            <!-- Manager Allocation Section (Resource Cards Only) -->
            <div v-if="zoomType === 'resource'" class="manager-allocation-box">
              <div class="allocation-header">
                <i class="material-icons tiny">person</i>
                <span>Manager Reservation System</span>
              </div>

              <!-- Reservation Status Alert -->
              <div v-if="currentAllocatedCount > 0" class="reservation-status-tag" :class="{ 'my-team': isReservedByMyTeam, 'other-team': isReservedByOtherTeam }">
                <i class="material-icons tiny">{{ isReservedByMyTeam ? 'verified_user' : 'lock' }}</i>
                <span v-if="isReservedByMyTeam">Reserved by your Team with {{ currentAllocatedCount }} Manager{{ currentAllocatedCount > 1 ? 's' : '' }}</span>
                <span v-else>Reserved by Team {{ currentReservedSeat }} with {{ currentAllocatedCount }} Manager{{ currentAllocatedCount > 1 ? 's' : '' }}</span>
              </div>

              <!-- Steal / Top-Up / Reserve Quantity Selector -->
              <div v-if="canAllocate" class="manager-selector-row">
                <span class="selector-label">
                  {{ isReservedByMyTeam ? 'Top Up to:' : (isReservedByOtherTeam ? 'Steal with:' : 'Allocate:') }}
                </span>
                <div class="quantity-picker">
                  <button 
                    class="btn-flat btn-small q-btn" 
                    @click="selectedManagerCount = Math.max(minRequiredManagers, selectedManagerCount - 1)"
                    :disabled="selectedManagerCount <= minRequiredManagers"
                  >-</button>
                  <span class="q-val">{{ selectedManagerCount }} <i class="material-icons tiny">person</i></span>
                  <button 
                    class="btn-flat btn-small q-btn" 
                    @click="selectedManagerCount = Math.min(maxSelectableManagers, selectedManagerCount + 1)"
                    :disabled="selectedManagerCount >= maxSelectableManagers"
                  >+</button>
                </div>

                <button 
                  class="btn-small waves-effect waves-light cyan darken-3 allocate-submit-btn"
                  @click="onAllocateManagers"
                >
                  <i class="material-icons left tiny">how_to_reg</i>
                  {{ isReservedByMyTeam ? 'Top Up' : (isReservedByOtherTeam ? 'Steal' : 'Reserve') }}
                </button>
              </div>

              <!-- Disabled Allocation Reason Messages -->
              <div v-else-if="hasAllocatedThisTurn" class="allocation-msg-box warning">
                <i class="material-icons tiny">info</i>
                <span>You have already allocated managers on a card this turn.</span>
              </div>
              <div v-else-if="isLockedOut" class="allocation-msg-box locked">
                <i class="material-icons tiny">lock</i>
                <span>Card is locked out with maximum 4 managers.</span>
              </div>
              <div v-else-if="availableManagers < 1" class="allocation-msg-box warning">
                <i class="material-icons tiny">warning</i>
                <span>No available managers remaining in supply.</span>
              </div>
              <div v-else-if="isReservedByOtherTeam && availableManagers <= currentAllocatedCount" class="allocation-msg-box warning">
                <i class="material-icons tiny">block</i>
                <span>Need at least {{ currentAllocatedCount + 1 }} available managers to steal this card.</span>
              </div>
            </div>

            <!-- Buy Card / Complete Contract Button -->
            <div class="buy-action-row">
              <button 
                v-if="afford && !isReservedByOtherTeam" 
                class="btn waves-effect waves-light green darken-3 zoom-action-btn" 
                @click="onAction"
              >
                {{ zoomType === 'resource' ? 'Buy the card' : 'Complete the contract' }}
                <i class="material-icons right">send</i>
              </button>
              <p v-else-if="isReservedByOtherTeam" class="red-text center bold style-notice">
                <i class="material-icons tiny">lock</i> Reserved by Team {{ currentReservedSeat }} (Cannot Buy)
              </p>
              <p v-else class="red-text center bold">You do not have enough resources to buy this card</p>
            </div>
          </div>
          <div class="zoom-actions" v-else style="padding: 10px 0;">
            <p class="grey-text center italic" style="font-size: 0.9rem; margin: 0;">
              <i class="material-icons tiny" style="vertical-align: middle; margin-right: 4px;">visibility</i>
              Viewing card details
            </p>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import useCardZoom from '../../composables/useCardZoom'
import ResourceCard from './ResourceCard.vue'
import ContractCard from './ContractCard.vue'

export default {
  name: 'CardZoomOverlay',
  components: { ResourceCard, ContractCard },
  props: {
    isMyTurn: {
      type: Boolean,
      default: false
    },
    afford: {
      type: Boolean,
      default: false
    },
    activePlayer: {
      type: Object,
      default: null
    },
    activeSeat: {
      type: Number,
      default: 1
    },
    gameData: {
      type: Object,
      default: null
    }
  },
  emits: ['action', 'allocateManagers'],
  setup(props, { emit }) {
    const { zoomedCard, zoomType, zoomColor, closeZoom } = useCardZoom()
    const viewportWidth = ref(window.innerWidth)

    const handleResize = () => {
      viewportWidth.value = window.innerWidth
    }

    const cardScale = computed(() => {
      // Clamp to 85% of viewport width
      const maxScale = (viewportWidth.value * 0.85) / 140
      return Math.min(2.2, maxScale)
    })

    const activeSeatVal = computed(() => props.activeSeat || props.activePlayer?.seat || 1)
    
    const availableManagers = computed(() => {
      if (props.activePlayer?.scores?.managersAvailable !== undefined) {
        return props.activePlayer.scores.managersAvailable
      }
      // Dynamic fallback calculation: 4 - total allocated by this team on active market cards
      const activeSeat = activeSeatVal.value
      let allocated = 0
      const allCards = [
        ...(props.gameData?.z01greenCards || []),
        ...(props.gameData?.z02yellowCards || []),
        ...(props.gameData?.z03redCards || []),
        ...(props.gameData?.z04purpleCards || []),
        ...(props.gameData?.z05blackCards || [])
      ]
      allCards.forEach(c => {
        if (c && c.reservedBySeat === activeSeat) {
          allocated += (c.allocatedManagersCount || 0)
        }
      })
      return Math.max(0, 4 - allocated)
    })

    const hasAllocatedThisTurn = computed(() => props.activePlayer?.scores?.hasAllocatedThisTurn ?? false)

    const currentReservedSeat = computed(() => zoomedCard.value?.reservedBySeat ?? null)
    const currentAllocatedCount = computed(() => zoomedCard.value?.allocatedManagersCount ?? 0)

    const isReservedByOtherTeam = computed(() => {
      return currentAllocatedCount.value > 0 && currentReservedSeat.value !== activeSeatVal.value
    })

    const isReservedByMyTeam = computed(() => {
      return currentAllocatedCount.value > 0 && currentReservedSeat.value === activeSeatVal.value
    })

    const isLockedOut = computed(() => currentAllocatedCount.value >= 4)

    const minRequiredManagers = computed(() => {
      if (currentAllocatedCount.value === 0) return 1
      if (isReservedByMyTeam.value) return currentAllocatedCount.value + 1
      return currentAllocatedCount.value + 1 // Steal minimum
    })

    const maxSelectableManagers = computed(() => {
      if (isReservedByMyTeam.value) {
        const additionalAvailable = availableManagers.value
        return Math.min(4, currentAllocatedCount.value + additionalAvailable)
      }
      return Math.min(4, availableManagers.value)
    })

    const canAllocate = computed(() => {
      if (!props.isMyTurn) return false
      if (hasAllocatedThisTurn.value) return false
      if (isLockedOut.value) return false
      if (availableManagers.value < 1) return false

      if (isReservedByOtherTeam.value) {
        // Stealing requires allocating strictly more than currentAllocatedCount
        const minStealNeeded = currentAllocatedCount.value + 1
        if (minStealNeeded > 4) return false
        if (availableManagers.value < minStealNeeded) return false
      }

      if (isReservedByMyTeam.value) {
        if (currentAllocatedCount.value >= 4) return false
        if (availableManagers.value < 1) return false
      }

      if (minRequiredManagers.value > maxSelectableManagers.value) return false
      return true
    })

    const selectedManagerCount = ref(1)

    watch([zoomedCard, minRequiredManagers, canAllocate], () => {
      if (canAllocate.value) {
        selectedManagerCount.value = Math.min(
          maxSelectableManagers.value,
          Math.max(minRequiredManagers.value, selectedManagerCount.value || minRequiredManagers.value)
        )
      } else {
        selectedManagerCount.value = minRequiredManagers.value
      }
    }, { immediate: true })

    const onAllocateManagers = () => {
      if (canAllocate.value) {
        emit('allocateManagers', { card: zoomedCard.value, count: selectedManagerCount.value })
        closeZoom()
      }
    }

    const onAction = () => {
      emit('action', { card: zoomedCard.value, type: zoomType.value })
      closeZoom()
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeZoom()
      }
    }

    onMounted(() => {
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
    })

    const cardCategoryName = computed(() => {
      const col = (zoomColor.value || zoomedCard.value?.Colour || '').toLowerCase()
      if (col === 'green') return 'Property'
      if (col === 'yellow') return 'Equipment'
      if (col === 'red') return 'People'
      if (col === 'purple') return 'Operations'
      if (col === 'black') return 'Outsource'
      return 'Resource'
    })

    return {
      zoomedCard,
      zoomType,
      zoomColor,
      cardCategoryName,
      closeZoom,
      onAction,
      cardScale,
      availableManagers,
      hasAllocatedThisTurn,
      currentReservedSeat,
      currentAllocatedCount,
      isReservedByOtherTeam,
      isReservedByMyTeam,
      isLockedOut,
      minRequiredManagers,
      maxSelectableManagers,
      canAllocate,
      selectedManagerCount,
      onAllocateManagers
    }
  }
}
</script>

<style scoped>
.zoom-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 10px;
}

.zoom-container {
  background-color: #ffffff;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 24px;
  position: relative;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
  border: 1px solid #e0e0e0;
  color: #212121;
}

@media only screen and (max-width: 600px) {
  .zoom-container {
    flex-direction: column;
    align-items: center;
    max-height: 90vh;
    overflow-y: auto;
  }
}

.zoom-close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  color: #666;
  font-size: 28px;
  cursor: pointer;
  z-index: 10;
}

.zoom-close-btn:hover {
  color: #000;
}

.zoom-card-wrapper {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.zoom-panel {
  flex: 1 1 auto;
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

@media only screen and (max-width: 600px) {
  .zoom-panel {
    padding-left: 0;
    padding-top: 16px;
    width: 100%;
  }
}

.zoom-title {
  margin-top: 0;
  font-size: 20px;
  font-weight: bold;
  color: #004d40;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 8px;
}

.zoom-instructions {
  margin: 16px 0;
  font-size: 14px;
  line-height: 1.5;
  color: #37474f;
}

.zoom-instructions ul {
  padding-left: 20px;
}

.zoom-instructions li {
  margin-bottom: 10px;
  list-style-type: disc;
}

.zoom-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16px;
  width: 100%;
}

.zoom-action-btn {
  width: 100%;
}

.manager-allocation-box {
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #e0e0e0;
}

.allocation-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  font-size: 0.85rem;
  color: #004d40;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.reservation-status-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.reservation-status-tag.my-team {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #a5d6a7;
}

.reservation-status-tag.other-team {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ef9a9a;
}

.manager-selector-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}

.selector-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #37474f;
}

.quantity-picker {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #ffffff;
  border: 1px solid #b0bec5;
  border-radius: 6px;
  padding: 2px 6px;
}

.q-btn {
  padding: 0 8px;
  height: 28px;
  line-height: 28px;
  font-weight: bold;
  font-size: 1.1rem;
}

.q-val {
  font-weight: bold;
  font-size: 0.95rem;
  color: #00796b;
  display: flex;
  align-items: center;
  gap: 2px;
}

.allocate-submit-btn {
  border-radius: 6px;
  text-transform: none;
  font-weight: 600;
}

.allocation-msg-box {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
}

.allocation-msg-box.warning {
  background-color: #fff3e0;
  color: #e65100;
  border: 1px solid #ffe0b2;
}

.allocation-msg-box.locked {
  background-color: #eceff1;
  color: #455a64;
  border: 1px solid #cfd8dc;
}

.buy-action-row {
  width: 100%;
}
</style>
