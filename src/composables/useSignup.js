import { ref } from '@vue/reactivity'
import { projectAuth } from '../firebase/config'
import { projectFirestore } from '../firebase/config'


const error = ref(null)


const signup = async (email, passwword, displayName, lastName) => {
    error.value = null

    try {
        const res = await projectAuth.createUserWithEmailAndPassword(email, passwword)
        if (!res) {
            throw new Error('Could not complete the signup')
        }
        await res.user.updateProfile({ displayName })
        projectFirestore.collection('players').doc(res.user.uid).set({ name: displayName, surname: lastName })
        error.value = null
        
        return res


    } catch(err) {
        console.log(err.message)
        error.value = err.message
    }

}

const useSignup = () => {
    return { error, signup }
}

export default useSignup