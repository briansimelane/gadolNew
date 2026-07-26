import { ref } from 'vue'
import { projectAuth, projectFirestore } from '../firebase/config'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

const error = ref(null)

const signup = async (email, passwword, displayName, lastName) => {
    error.value = null

    try {
        const res = await createUserWithEmailAndPassword(projectAuth, email, passwword)
        if (!res) {
            throw new Error('Could not complete the signup')
        }
        await updateProfile(res.user, { displayName })
        await setDoc(doc(projectFirestore, 'players', res.user.uid), { name: displayName, surname: lastName })
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