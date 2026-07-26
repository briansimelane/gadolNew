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
            <span v-if="zoomType === 'upcoming'">Upcoming Resource Card</span>
            <span v-else-if="zoomType === 'resource'">Permanent Resource Card</span>
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

          <div class="zoom-actions" v-if="zoomType === 'upcoming'" style="padding: 10px 0;">
            <p class="grey-text center italic" style="font-size: 0.9rem; margin: 0;">
              <i class="material-icons tiny" style="vertical-align: middle; margin-right: 4px;">lock</i>
              Upcoming cards cannot be purchased yet
            </p>
          </div>
          <div class="zoom-actions" v-else-if="isMyTurn">
            <button 
              v-if="afford" 
              class="btn waves-effect waves-light green darken-3 zoom-action-btn" 
              @click="onAction"
            >
              {{ zoomType === 'resource' ? 'Buy the card' : 'Complete the contract' }}
              <i class="material-icons right">send</i>
            </button>
            <p v-else class="red-text center bold">You do not have enough resources to buy this card</p>
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
import { onMounted, onUnmounted, ref, computed } from 'vue'
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
    }
  },
  emits: ['action'],
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

    return {
      zoomedCard,
      zoomType,
      zoomColor,
      closeZoom,
      onAction,
      cardScale
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
</style>
