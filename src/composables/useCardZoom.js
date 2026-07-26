import { ref } from 'vue'

const zoomedCard = ref(null)
const zoomType = ref(null) // 'resource' | 'contract'
const zoomColor = ref(null) // 'red' | 'green' | etc.

const openZoom = (card, type, color = null) => {
  zoomedCard.value = card
  zoomType.value = type
  zoomColor.value = color
}

const closeZoom = () => {
  zoomedCard.value = null
  zoomType.value = null
  zoomColor.value = null
}

export default function useCardZoom() {
  return {
    zoomedCard,
    zoomType,
    zoomColor,
    openZoom,
    closeZoom
  }
}
