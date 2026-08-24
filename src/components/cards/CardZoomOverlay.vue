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
            v-if="zoomType === 'resource' || zoomType === 'upcoming' || (zoomType === 'inPlay' && !isInPlayContract)" 
            :card="zoomedCard" 
            :color="zoomColor || getInPlayCardColor" 
            :interactive="false"
            :scale="cardScale"
          />
          <ContractCard 
            v-else-if="zoomType === 'contract' || (zoomType === 'inPlay' && isInPlayContract)" 
            :card="zoomedCard" 
            :interactive="false"
            :scale="cardScale"
          />
        </div>

        <!-- Action / Info Panel -->
        <div class="zoom-panel">
          <h5 class="zoom-title">
            <span v-if="zoomType === 'upcoming'">Upcoming {{ cardCategoryName }} Card</span>
            <span v-else-if="zoomType === 'inPlay'">In Play Space {{ inPlayTargetSpace }} Card</span>
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
            <div v-else-if="zoomType === 'inPlay'" style="padding: 12px; background: #e0f2f1; border-radius: 8px; border-left: 4px solid #00796b; margin-top: 5px;">
              <p style="margin: 0; font-weight: 600; color: #004d40; font-size: 0.95rem;">
                <i class="material-icons tiny" style="vertical-align: middle; margin-right: 4px;">layers</i>
                In Play Space {{ inPlayTargetSpace }} Top Card
              </p>
              <p style="margin: 6px 0 0 0; font-size: 0.88rem; color: #00695c;">
                This card is currently at the top of In Play Space {{ inPlayTargetSpace }}. Only this top card can be bought or discarded.
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

            <!-- Visual Card Stack Preview (Read-Only Image Previews) -->
            <div 
              v-if="zoomType === 'inPlay' && inPlayStack.length > 1" 
              class="visual-stack-preview-box" 
              style="margin-top: 14px; width: 100%; padding: 10px; background: #e0f2f1; border-radius: 8px; border: 1px solid #80cbc4;"
            >
              <div style="font-size: 0.82rem; font-weight: 700; color: #004d40; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                <span>
                  <i class="material-icons tiny" style="vertical-align: middle; margin-right: 4px;">layers</i>
                  Cards in Space {{ inPlayTargetSpace }} Stack ({{ inPlayStack.length }} Total)
                </span>
                <span class="grey-text text-darken-2" style="font-size: 0.75rem; font-weight: 600;">Top to Bottom</span>
              </div>

              <!-- Horizontal Scroll Row of Visual Card Image Thumbnails -->
              <div class="stack-visual-row" style="display: flex; gap: 12px; overflow-x: auto; padding: 6px 4px 10px 4px; align-items: flex-start;">
                <div 
                  v-for="(item, idx) in reversedStack" 
                  :key="item.Ref + '_' + idx"
                  class="visual-card-thumb-container"
                  :style="{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    opacity: idx === 0 ? 1 : 0.7,
                    pointerEvents: 'none',
                    userSelect: 'none'
                  }"
                >
                  <span 
                    class="badge" 
                    :class="idx === 0 ? 'teal darken-2 white-text' : 'grey lighten-1 black-text'"
                    style="margin: 0 0 6px 0; font-size: 0.65rem; font-weight: 700; border-radius: 4px; padding: 2px 6px;"
                  >
                    {{ idx === 0 ? 'Top Card (Active)' : '#' + (reversedStack.length - idx) }}
                  </span>

                  <div style="pointer-events: none; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));">
                    <ContractCard 
                      v-if="isStackItemContract(item)"
                      :card="item"
                      :interactive="false"
                      :scale="0.45"
                    />
                    <ResourceCard 
                      v-else
                      :card="item"
                      :color="getStackItemColor(item)"
                      :interactive="false"
                      :scale="0.45"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions Panel when it's Active Player's Turn -->
          <div class="zoom-actions" v-if="isMyTurn">
            <!-- Actions for In Play Cards -->
            <div v-if="zoomType === 'inPlay'" class="in-play-actions-container" style="width: 100%;">
              <!-- Buy In Play Card Button -->
              <div class="buy-action-row" style="margin-bottom: 12px;">
                <button 
                  v-if="afford" 
                  class="btn waves-effect waves-light green darken-3 zoom-action-btn" 
                  @click="onInPlayBuyAction"
                >
                  {{ isInPlayContract ? 'Complete the contract' : 'Buy the card' }}
                  <i class="material-icons right">send</i>
                </button>
                <p v-else class="red-text center bold" style="margin: 4px 0;">You do not have enough resources to buy this card</p>
              </div>

              <!-- Discard In Play Card Button & Confirmation -->
              <div v-if="!showDiscardConfirm" class="discard-action-row">
                <button 
                  class="btn waves-effect waves-light red darken-3 zoom-action-btn"
                  @click="showDiscardConfirm = true"
                >
                  <i class="material-icons left">delete</i>
                  Discard card from Space {{ inPlayTargetSpace }}
                </button>
              </div>

              <!-- Discard Confirmation Alert Box -->
              <div v-else class="discard-confirm-box" style="padding: 12px; background: #fff3e0; border-radius: 8px; border: 1px solid #ffe0b2;">
                <p style="margin: 0; font-weight: 700; color: #e65100; font-size: 0.92rem; display: flex; align-items: center; gap: 4px;">
                  <i class="material-icons tiny">warning</i> Confirm Discard
                </p>
                <p style="margin: 6px 0 10px 0; font-size: 0.85rem; color: #ef6c00;">
                  Are you sure you want to discard this card from Space {{ inPlayTargetSpace }}? It will be removed from play.
                </p>
                <div style="display: flex; gap: 8px; justify-content: flex-end;">
                  <button class="btn-small waves-effect grey lighten-1 black-text" @click="showDiscardConfirm = false">Cancel</button>
                  <button class="btn-small waves-effect waves-light red darken-3 bold" @click="confirmDiscardAction">Yes, Discard Card</button>
                </div>
              </div>
            </div>

            <template v-else>
              <p v-if="zoomType === 'upcoming'" class="grey-text center italic" style="font-size: 0.9rem; margin: 0 0 10px 0;">
                <i class="material-icons tiny" style="vertical-align: middle; margin-right: 4px;">schedule</i>
                Upcoming card (Cannot buy yet, but can be moved)
              </p>

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
              <div v-if="zoomType !== 'upcoming'" class="buy-action-row" style="margin-bottom: 12px;">
                <button 
                  v-if="afford && !isReservedByOtherTeam" 
                  class="btn waves-effect waves-light green darken-3 zoom-action-btn" 
                  @click="onAction"
                >
                  {{ zoomType === 'resource' ? 'Buy the card' : 'Complete the contract' }}
                  <i class="material-icons right">send</i>
                </button>
                <p v-else-if="isReservedByOtherTeam" class="red-text center bold style-notice" style="margin: 4px 0;">
                  <i class="material-icons tiny">lock</i> Reserved by Team {{ currentReservedSeat }} (Cannot Buy)
                </p>
                <p v-else class="red-text center bold" style="margin: 4px 0;">You do not have enough resources to buy this card</p>
              </div>

              <!-- Move to In Play Space Section -->
              <div class="move-in-play-box" style="width: 100%; background: #e0f2f1; padding: 10px; border-radius: 8px; border: 1px solid #80cbc4;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  <span style="font-weight: 700; color: #004d40; font-size: 0.85rem;">
                    Move to In Play Space
                  </span>
                  <span v-if="isReservedByMyTeam" class="teal-text text-darken-3 bold" style="font-size: 0.75rem;">
                    (Reclaims your {{ currentAllocatedCount }} manager{{ currentAllocatedCount > 1 ? 's' : '' }})
                  </span>
                </div>

                <div v-if="isSecretContract" class="grey-text center bold italic" style="font-size: 0.85rem;">
                  <i class="material-icons tiny">lock</i> Team Secret Contract cannot be moved
                </div>
                <div v-else-if="isReservedByOtherTeam" class="red-text center bold style-notice" style="font-size: 0.85rem;">
                  <i class="material-icons tiny">lock</i> Reserved by Team {{ currentReservedSeat }} (Cannot Move)
                </div>
                <div v-else style="display: flex; gap: 8px;">
                  <button 
                    class="btn-small waves-effect waves-light teal darken-2" 
                    style="flex: 1; border-radius: 6px; text-transform: none; font-weight: 600;" 
                    @click="onMoveCard('A')"
                  >
                    Move to A
                  </button>
                  <button 
                    class="btn-small waves-effect waves-light teal darken-4" 
                    style="flex: 1; border-radius: 6px; text-transform: none; font-weight: 600;" 
                    @click="onMoveCard('B')"
                  >
                    Move to B
                  </button>
                </div>
              </div>
            </template>
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
  emits: ['action', 'allocateManagers', 'moveCard'],
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
    
    const isSecretContract = computed(() => {
      if (!zoomedCard.value || zoomType.value !== 'contract') return false
      return props.activePlayer?.secretContractCard?.Ref === zoomedCard.value?.Ref
    })

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

    const showDiscardConfirm = ref(false)

    watch(zoomedCard, () => {
      showDiscardConfirm.value = false
    })

    const isInPlayContract = computed(() => {
      if (!zoomedCard.value) return false
      return zoomedCard.value.inPlayMeta?.kind === 'contract' || zoomedCard.value.Value !== undefined || zoomedCard.value.Colour === 'White'
    })

    const getInPlayCardColor = computed(() => {
      if (!zoomedCard.value) return 'green'
      const col = zoomedCard.value.inPlayMeta?.colour || zoomedCard.value.Colour || 'green'
      return col.toLowerCase()
    })

    const inPlayTargetSpace = computed(() => {
      return zoomedCard.value?.inPlaySpaceTarget || zoomedCard.value?.inPlayMeta?.target || 'A'
    })

    const onInPlayBuyAction = () => {
      emit('action', {
        card: zoomedCard.value,
        type: 'inPlayBuy',
        target: inPlayTargetSpace.value
      })
      closeZoom()
    }

    const confirmDiscardAction = () => {
      emit('action', {
        card: zoomedCard.value,
        type: 'discard',
        target: inPlayTargetSpace.value
      })
      showDiscardConfirm.value = false
      closeZoom()
    }

    const onMoveCard = (target) => {
      emit('moveCard', {
        card: zoomedCard.value,
        kind: zoomType.value,
        colour: zoomColor.value || zoomedCard.value?.Colour,
        target
      })
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

    const inPlayStack = computed(() => zoomedCard.value?.inPlayStack || [])

    const reversedStack = computed(() => [...inPlayStack.value].reverse())

    const isStackItemContract = (item) => {
      if (!item) return false
      return item.inPlayMeta?.kind === 'contract' || item.Value !== undefined || item.Colour === 'White'
    }

    const getStackItemColor = (item) => {
      if (!item) return 'green'
      const col = item.inPlayMeta?.colour || item.Colour || 'green'
      return col.toLowerCase()
    }

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
      onAllocateManagers,
      isSecretContract,
      onMoveCard,
      inPlayTargetSpace,
      showDiscardConfirm,
      isInPlayContract,
      getInPlayCardColor,
      onInPlayBuyAction,
      confirmDiscardAction,
      inPlayStack,
      reversedStack,
      isStackItemContract,
      getStackItemColor
    }
  }
}
</script>

<style scoped>
.stack-item-pill {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.15s ease;
}

.stack-item-pill:hover {
  background-color: #f5f5f5;
}

.stack-item-pill.active-inspect-item {
  border: 2px solid #00796b;
  background-color: #e0f2f1;
}
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
  padding: 16px;
  box-sizing: border-box;
}

.zoom-container {
  background-color: #ffffff;
  border-radius: 14px;
  max-width: 720px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: row;
  padding: 24px;
  position: relative;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
  border: 1px solid #e0e0e0;
  color: #212121;
  box-sizing: border-box;
}

@media only screen and (max-width: 600px) {
  .zoom-container {
    flex-direction: column;
    align-items: center;
    max-height: 90vh;
    overflow-y: auto;
    padding: 16px;
  }
}

.zoom-close-btn {
  position: absolute;
  top: 14px;
  right: 16px;
  background: none;
  border: none;
  color: #555;
  font-size: 26px;
  cursor: pointer;
  z-index: 10;
  line-height: 1;
}

.zoom-close-btn:hover {
  color: #000;
}

.zoom-card-wrapper {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 8px;
}

.zoom-panel {
  flex: 1 1 auto;
  min-width: 0;
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
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
  padding-right: 32px;
}

/* Stylized horizontal scrollbar for visual stack preview */
.visual-stack-preview-box {
  box-sizing: border-box;
  overflow: hidden;
}

.stack-visual-row {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  overflow-y: hidden !important;
  white-space: nowrap;
  max-width: 100%;
  box-sizing: border-box;
  padding: 6px 4px 10px 4px;
  scrollbar-width: thin;
  scrollbar-color: #00796b #e0f2f1;
}

.stack-visual-row::-webkit-scrollbar {
  height: 6px;
}

.stack-visual-row::-webkit-scrollbar-track {
  background: #e0f2f1;
  border-radius: 3px;
}

.stack-visual-row::-webkit-scrollbar-thumb {
  background: #00796b;
  border-radius: 3px;
}

.stack-visual-row::-webkit-scrollbar-thumb:hover {
  background: #004d40;
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
