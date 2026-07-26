import { ref } from 'vue'
import { projectFirestore } from '../firebase/config'
import { collection, addDoc as fbAddDoc } from 'firebase/firestore'

const useCollection = (collectionName) => {
  const error = ref(null)

  // add a new document
  const addDoc = async (doc) => {
    error.value = null
    try {
      await fbAddDoc(collection(projectFirestore, collectionName), doc)
    }
    catch(err) {
      console.log(err.message)
      error.value = 'could not send the message'
    }
  }

  return { error, addDoc }
}

export default useCollection