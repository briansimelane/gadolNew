import { ref, onUnmounted } from 'vue'
import { projectFirestore } from '../firebase/config'
import { doc, onSnapshot } from 'firebase/firestore'

export default function useRoom(id) {
  const gameData = ref(null)
  const error = ref(null)
  const roomDocRef = doc(projectFirestore, 'rooms', id)

  const unsub = onSnapshot(roomDocRef, snapshot => {
    if (snapshot.exists()) {
      gameData.value = { ...snapshot.data(), id: snapshot.id }
    } else {
      error.value = 'Room does not exist'
    }
  }, err => {
    console.error('Error fetching room snapshot:', err)
    error.value = err.message
  })

  onUnmounted(() => {
    unsub()
  })

  return {
    gameData,
    error,
    roomDocRef
  }
}
