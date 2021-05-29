import { ref } from 'vue'
import { projectFirestore } from "../firebase/config"


const getGame = (id) => {
    const game = ref(null)
    const error = ref(null)

    const load = async() => {
        try {
            let res = await projectFirestore.collection('rooms').doc(id).get()
            game.value = res.docs.map(doc => {
                return { ...doc.data(), id: doc.id }
            })
        }
        catch(err) {
            error.value = err.message
            console.log(error.value)
        }
    }
    return { game, error, load }
}

export default getGame